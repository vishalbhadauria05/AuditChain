// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/// @title AuditChain - milestone-based fund release with Giver, Taker and Auditor roles
/// @notice Supports creating projects with milestones, auditor verification and releasing milestone funds to the taker
contract AuditChain {
	uint256 public projectCount;

	struct Milestone {
		uint256 amount;
		bool verified;
		bool released;
	}

	struct Project {
		address giver;
		address taker;
		address auditor;
		uint256 total;
		uint256 milestoneCount;
		uint256 releasedCount;
		bool active;
	}

	// project id => Project
	mapping(uint256 => Project) public projects;
	// project id => array of milestones
	mapping(uint256 => Milestone[]) private projectMilestones;

	// simple reentrancy guard
	bool private locked;

	modifier nonReentrant() {
		require(!locked, "Reentrant call");
		locked = true;
		_;
		locked = false;
	}

	modifier onlyGiver(uint256 projectId) {
		require(msg.sender == projects[projectId].giver, "Only giver");
		_;
	}

	modifier onlyAuditor(uint256 projectId) {
		require(msg.sender == projects[projectId].auditor, "Only auditor");
		_;
	}

	modifier onlyTaker(uint256 projectId) {
		require(msg.sender == projects[projectId].taker, "Only taker");
		_;
	}

	modifier onlyActive(uint256 projectId) {
		require(projects[projectId].active, "Project not active");
		_;
	}

	event ProjectCreated(uint256 indexed projectId, address indexed giver, address indexed taker, address auditor, uint256 total);
	event MilestoneVerified(uint256 indexed projectId, uint256 indexed milestoneIndex, address indexed auditor);
	event FundsReleased(uint256 indexed projectId, uint256 indexed milestoneIndex, address indexed taker, uint256 amount);
	event ProjectCancelled(uint256 indexed projectId, address indexed giver, uint256 refund);

	/// @notice Create a new project and fund it with milestone amounts
	/// @param taker Address who will receive milestone payments
	/// @param auditor Address authorized to verify milestones
	/// @param amounts Array of milestone amounts; sum must equal msg.value
	function createProject(address taker, address auditor, uint256[] calldata amounts) external payable returns (uint256) {
		require(taker != address(0), "Invalid taker");
		require(auditor != address(0), "Invalid auditor");
		require(amounts.length > 0, "No milestones");

		uint256 sum = 0;
		for (uint256 i = 0; i < amounts.length; i++) {
			require(amounts[i] > 0, "Milestone amount must be > 0");
			sum += amounts[i];
		}

		require(msg.value == sum, "Sent value must equal sum of milestones");

		uint256 pid = projectCount;

		projects[pid] = Project({
			giver: msg.sender,
			taker: taker,
			auditor: auditor,
			total: sum,
			milestoneCount: amounts.length,
			releasedCount: 0,
			active: true
		});

		// store milestones
		for (uint256 i = 0; i < amounts.length; i++) {
			projectMilestones[pid].push(Milestone({amount: amounts[i], verified: false, released: false}));
		}

		projectCount += 1;

		emit ProjectCreated(pid, msg.sender, taker, auditor, sum);
		return pid;
	}

	/// @notice Auditor verifies a milestone as completed/acceptable
	/// @param projectId The project id
	/// @param milestoneIndex Index of the milestone to verify
	function verifyMilestone(uint256 projectId, uint256 milestoneIndex) external onlyAuditor(projectId) onlyActive(projectId) {
		require(milestoneIndex < projects[projectId].milestoneCount, "Invalid milestone index");
		Milestone storage m = projectMilestones[projectId][milestoneIndex];
		require(!m.verified, "Already verified");
		m.verified = true;
		emit MilestoneVerified(projectId, milestoneIndex, msg.sender);
	}

	/// @notice Release funds for a verified milestone to the taker
	/// @param projectId The project id
	/// @param milestoneIndex Index of the milestone to release
	function releaseFunds(uint256 projectId, uint256 milestoneIndex) external nonReentrant onlyActive(projectId) {
		require(milestoneIndex < projects[projectId].milestoneCount, "Invalid milestone index");
		Milestone storage m = projectMilestones[projectId][milestoneIndex];
		require(m.verified, "Milestone not verified");
		require(!m.released, "Already released");

		// mark released before transfer
		m.released = true;
		projects[projectId].releasedCount += 1;

		uint256 amount = m.amount;
		address payable to = payable(projects[projectId].taker);

		(bool success, ) = to.call{value: amount}('');
		require(success, "Transfer failed");

		// if all milestones released, mark inactive
		if (projects[projectId].releasedCount == projects[projectId].milestoneCount) {
			projects[projectId].active = false;
		}

		emit FundsReleased(projectId, milestoneIndex, projects[projectId].taker, amount);
	}

	/// @notice Cancel a project and refund remaining un-released funds to the giver
	/// @dev Only the giver can cancel. Already released milestones are not refunded.
	/// @param projectId The project id
	function cancelProject(uint256 projectId) external nonReentrant onlyGiver(projectId) onlyActive(projectId) {
		uint256 refund = 0;
		Milestone[] storage ms = projectMilestones[projectId];
		for (uint256 i = 0; i < ms.length; i++) {
			if (!ms[i].released) {
				// mark as released to prevent double refunds
				ms[i].released = true;
				refund += ms[i].amount;
			}
		}

		projects[projectId].active = false;

		if (refund > 0) {
			address payable to = payable(projects[projectId].giver);
			(bool success, ) = to.call{value: refund}('');
			require(success, "Refund failed");
		}

		emit ProjectCancelled(projectId, projects[projectId].giver, refund);
	}

	/// @notice Get milestone info for a project
	/// @param projectId The project id
	/// @param milestoneIndex Index of the milestone
	function getMilestone(uint256 projectId, uint256 milestoneIndex) external view returns (uint256 amount, bool verified, bool released) {
		require(milestoneIndex < projects[projectId].milestoneCount, "Invalid milestone index");
		Milestone storage m = projectMilestones[projectId][milestoneIndex];
		return (m.amount, m.verified, m.released);
	}

	/// @notice Get project summary
	/// @param projectId The project id
	function getProject(uint256 projectId) external view returns (address giver, address taker, address auditor, uint256 total, uint256 milestoneCount, uint256 releasedCount, bool active) {
		Project storage p = projects[projectId];
		return (p.giver, p.taker, p.auditor, p.total, p.milestoneCount, p.releasedCount, p.active);
	}

	// Fallback to prevent accidental ETH sending without data
	receive() external payable {
		revert("Send to createProject only");
	}
}
