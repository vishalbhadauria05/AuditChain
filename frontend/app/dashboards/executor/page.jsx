"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Wallet,
  Bell,
  CheckCircle,
  Clock,
  Upload,
  DollarSign,
  Layers,
  Briefcase,
  ShieldCheck,
  User,
  LogOut,
} from "lucide-react";

const ACCENT = "#00FF88";

export default function ExecutorDashboard() {
  const [wallet, setWallet] = useState(null);
  const [tab, setTab] = useState("proposals");
  const [showProfile, setShowProfile] = useState(false);

  const [proposals, setProposals] = useState([]);
  const [activeProjects, setActiveProjects] = useState([]);
  const [auditEntries, setAuditEntries] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  // side messages state (replaces alert)
  const [messages, setMessages] = useState([]);

  function showMessage(text, kind = "info", ttl = 5000) {
    const id = `msg-${Date.now()}`;
    const m = { id, text, kind, ts: Date.now() };
    setMessages((s) => [m, ...s]);
    if (ttl > 0) {
      setTimeout(() => setMessages((s) => s.filter((x) => x.id !== id)), ttl);
    }
  }

  useEffect(() => {
    // initialize mocks — replace with real fetches / Sepolia provider logic
    setWallet({ address: "0xAbC...1234", org: "Municipal Works Dept" });
    setProposals(mockProposals());
    setActiveProjects(mockActive());
    setAuditEntries(mockAudit());
    setNotifications(mockNotifications());
  }, []);

  // Accept a proposal and move to active
  function acceptProposal(projId) {
    const p = proposals.find((x) => x.id === projId);
    if (!p) return;
    setProposals((ps) => ps.filter((x) => x.id !== projId));
    setActiveProjects((ap) => [
      {
        ...p,
        status: "Active",
        progress: 0,
        acceptedAt: new Date().toISOString(),
      },
      ...ap,
    ]);
    setNotifications((n) => [
      {
        id: `nt-${Date.now()}`,
        title: "Project Accepted",
        body: `${p.name} moved to Active Projects`,
        ts: new Date().toISOString(),
        unread: true,
      },
      ...n,
    ]);
  }

  function declineProposal(projId) {
    setProposals((ps) => ps.filter((x) => x.id !== projId));
    setNotifications((n) => [
      {
        id: `nt-${Date.now()}`,
        title: "Project Declined",
        body: `You declined a project.`,
        ts: new Date().toISOString(),
        unread: true,
      },
      ...n,
    ]);
  }

  // Update milestone progress locally and add audit entry
  function updateMilestoneProgress(projectId, milestoneId, progress) {
    setActiveProjects((ap) =>
      ap.map((proj) => {
        if (proj.id !== projectId) return proj;
        const ms = proj.milestones.map((m) =>
          m.id === milestoneId
            ? {
                ...m,
                progress,
                status:
                  m.status === "VC Generated"
                    ? m.status
                    : progress >= 100
                    ? "Pending Verification"
                    : m.status,
              }
            : m
        );
        const completed = Math.round(
          ms.reduce((s, m) => s + (m.progress || 0), 0) / (ms.length || 1)
        );
        return { ...proj, milestones: ms, progress: completed };
      })
    );
    const project = activeProjects.find((p) => p.id === projectId) || {};
    setAuditEntries((a) => [
      {
        id: `audit-${Date.now()}`,
        type: "progress-update",
        projectId,
        milestoneId,
        details: `Progress set to ${progress}%`,
        timestamp: new Date().toISOString(),
        projectName: project.name || "—",
      },
      ...a,
    ]);
    showMessage(`Progress set to ${progress}%`, "info");
  }

  // Submit evidence — stores an audit entry and notification; real flow should upload to IPFS and notify funder/auditor
  function submitEvidence({ projectId, milestoneId, files, notes, progress }) {
    const project = activeProjects.find((p) => p.id === projectId);
    const entry = {
      id: `evi-${Date.now()}`,
      type: "evidence-submission",
      projectId,
      projectName: project?.name || "—",
      milestoneId,
      files: files.map((f, i) => ({
        name: f.name || `file-${i}`,
        cid: `ipfs://mock-${Date.now()}-${i}`,
      })),
      notes,
      progress,
      timestamp: new Date().toISOString(),
    };
    setAuditEntries((a) => [entry, ...a]);
    setNotifications((n) => [
      {
        id: `nt-${Date.now()}`,
        title: "Evidence Submitted",
        body: `Evidence submitted for ${project?.name || projectId}`,
        ts: new Date().toISOString(),
        unread: true,
      },
      ...n,
    ]);
    showMessage(
      `Evidence submitted for ${project?.name || projectId}`,
      "success"
    );
    // update milestone progress if provided
    if (typeof progress === "number")
      updateMilestoneProgress(projectId, milestoneId, progress);
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
      <Header
        wallet={wallet}
        notifications={notifications}
        setTab={setTab}
        showProfile={showProfile}
        setShowProfile={setShowProfile}
      />
      <div className="max-w-[1400px] mx-auto grid grid-cols-12 gap-6 mt-6">
        <aside className="col-span-3">
          <Sidebar
            tab={tab}
            setTab={setTab}
            proposals={proposals}
            activeCount={activeProjects.length}
          />
        </aside>

        <main className="col-span-9 space-y-6">
          {tab === "proposals" && (
            <ProposalsTab
              proposals={proposals}
              onAccept={acceptProposal}
              onDecline={declineProposal}
            />
          )}

          {tab === "active" && (
            <ActiveProjectsTab
              projects={activeProjects}
              onSelect={(p) => {
                setSelectedProject(p);
                setTab("evidence");
              }}
              showMessage={showMessage}
            />
          )}

          {tab === "evidence" && (
            <EvidenceSubmissionTab
              projects={activeProjects}
              selectedProject={selectedProject}
              onSubmit={submitEvidence}
              onSetMilestone={(m) => setSelectedMilestone(m)}
              showMessage={showMessage}
            />
          )}

          {tab === "funds" && <FundsTab projects={activeProjects} />}

          {tab === "extensions" && <ExtensionsTab projects={activeProjects} />}

          {tab === "audit" && <AuditTrailTab entries={auditEntries} />}
        </main>
      </div>
      {/* Side messages (replaces alert) */}
      <div className="fixed right-6 bottom-6 space-y-3 z-50">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`max-w-sm w-full p-3 rounded-xl border ${
              m.kind === "success"
                ? "bg-[#052617] border-[#053b25] text-[#bfffe7]"
                : m.kind === "error"
                ? "bg-[#2b0f0f] border-[#4a1515] text-[#ffc9c9]"
                : "bg-[#0F0F0F] border-gray-800 text-gray-200"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="text-sm whitespace-pre-wrap">{m.text}</div>
              <button
                onClick={() =>
                  setMessages((s) => s.filter((x) => x.id !== m.id))
                }
                className="text-xs text-gray-400"
              >
                Dismiss
              </button>
            </div>
            <div className="text-[10px] text-gray-500 mt-2">
              {new Date(m.ts).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Header ---------------- */
function Header({
  wallet,
  notifications,
  setTab,
  showProfile,
  setShowProfile,
}) {
  return (
    <header className="flex items-center justify-between relative">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl overflow-hidden bg-black flex items-center justify-center">
          <Image src="/logo.png" alt="AC" width={48} height={48} />
        </div>
        <div>
          <div className="text-lg font-semibold text-[#00FF88]">
            AuditChain — Executor
          </div>
          <div className="text-xs text-gray-400">{wallet?.org ?? "—"}</div>
          <div className="text-xs text-gray-500">Network: Sepolia Testnet</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-3 bg-gray-900 px-3 py-2 rounded-2xl">
          <Wallet className="w-4 h-4 text-gray-300" />
          <span className="text-sm">{wallet?.address ?? "Not connected"}</span>
        </div>

        <button
          onClick={() => setTab("evidence")}
          className="px-4 py-2 rounded-full border border-[#0f462f] hover:border-[#003F28] hover:bg-[#07130E]"
          style={{ boxShadow: "0 4px 18px rgba(0,255,136,0.06)" }}
        >
          <div className="flex items-center gap-2 text-sm">
            <Upload className="w-4 h-4 text-[#00FF88]" />
            <span>Submit Evidence</span>
          </div>
        </button>

        <button
          onClick={() => setTab("audit")}
          className="p-2 rounded-full bg-gray-900 hover:bg-[#07130E]"
        >
          <Bell className="w-5 h-5" />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowProfile((s) => !s)}
            className="p-2 rounded-full bg-gray-900 hover:bg-[#07130E]"
          >
            <User className="w-5 h-5" />
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-3 w-48 bg-[#0F0F0F] border border-gray-800 rounded-xl shadow-lg p-3 z-50">
              <div className="text-sm font-semibold mb-1">
                {wallet?.org || "Executor"}
              </div>
              <div className="text-xs text-gray-400 mb-3">
                {wallet?.address}
              </div>
              <button className="flex items-center gap-2 w-full text-left text-sm px-2 py-1 hover:bg-[#07130E] rounded-md">
                <User className="w-4 h-4 text-[#00FF88]" /> Profile
              </button>
              <button className="flex items-center gap-2 w-full text-left text-sm px-2 py-1 hover:bg-[#07130E] rounded-md mt-1">
                <LogOut className="w-4 h-4 text-red-400" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

/* ---------------- Sidebar ---------------- */
function Sidebar({ tab, setTab, proposals, activeCount }) {
  const nav = [
    {
      key: "proposals",
      label: "Project Proposals",
      icon: <Briefcase className="w-4 h-4" />,
    },
    {
      key: "active",
      label: "Active Projects",
      icon: <Layers className="w-4 h-4" />,
    },
    {
      key: "evidence",
      label: "Evidence Submission",
      icon: <Upload className="w-4 h-4" />,
    },
    {
      key: "funds",
      label: "Funds & Tranches",
      icon: <DollarSign className="w-4 h-4" />,
    },
    {
      key: "extensions",
      label: "Extensions",
      icon: <Clock className="w-4 h-4" />,
    },
    {
      key: "audit",
      label: "Audit Trail",
      icon: <ShieldCheck className="w-4 h-4" />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-[#0F0F0F] p-4 rounded-2xl border border-gray-800">
        <div className="text-sm text-[#00FF88] mb-2">Quick Summary</div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-400">Proposals</div>
            <div className="font-semibold">{proposals.length}</div>
          </div>
          <div>
            <div className="text-xs text-gray-400">Active</div>
            <div className="font-semibold">{activeCount}</div>
          </div>
        </div>
      </div>

      <nav className="bg-[#0F0F0F] p-3 rounded-2xl border border-gray-800">
        {nav.map((item) => (
          <button
            key={item.key}
            onClick={() => setTab(item.key)}
            className={`w-full flex items-center gap-3 p-3 mb-2 rounded-xl ${
              tab === item.key
                ? "bg-[#07130E] border border-[#02321E]"
                : "hover:bg-[#07130E]"
            }`}
          >
            <div
              className={`w-8 h-8 rounded-md bg-black flex items-center justify-center ${
                tab === item.key ? "ring-1 ring-[#003f28]" : ""
              }`}
            >
              {item.icon}
            </div>
            <div className="text-sm">{item.label}</div>
          </button>
        ))}
      </nav>
    </div>
  );
}

/* ---------------- Proposals Tab ---------------- */
function ProposalsTab({ proposals, onAccept, onDecline }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <h2 className="text-2xl font-semibold text-[#00FF88]">
        Project Proposals
      </h2>
      <p className="text-sm text-gray-400">
        Projects proposed to your organization. Accept to start work or decline
        to reject.
      </p>

      <div className="grid grid-cols-3 gap-4">
        {proposals.length === 0 && (
          <div className="col-span-3 p-6 rounded-2xl bg-[#0F0F0F] border border-gray-800 text-gray-400">
            No proposals available.
          </div>
        )}
        {proposals.map((p) => (
          <div
            key={p.id}
            className="p-4 rounded-2xl bg-[#0F0F0F] border border-gray-800"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">{p.name}</div>
                <div className="text-xs text-gray-500">
                  {p.location} • {p.milestones.length} milestones
                </div>
              </div>
              <div className="text-sm font-semibold">
                {p.totalAllocation} ETH
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-3 line-clamp-3">
              {p.description}
            </p>

            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={() => onAccept(p.id)}
                className="px-3 py-2 rounded-lg border border-[#02321E]"
              >
                Accept
              </button>
              <button
                onClick={() => onDecline(p.id)}
                className="px-3 py-2 rounded-lg bg-gray-900"
              >
                Decline
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ---------------- Active Projects Tab ---------------- */
function ActiveProjectsTab({ projects, onSelect, showMessage }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-[#00FF88]">
          Active Projects
        </h2>
        <div className="text-sm text-gray-400">
          Click a project to manage milestones and submit evidence.
        </div>
      </div>

      <div className="space-y-3">
        {projects.length === 0 && (
          <div className="p-6 rounded-2xl bg-[#0F0F0F] border border-gray-800 text-gray-400">
            No active projects yet.
          </div>
        )}

        {projects.map((proj) => (
          <div
            key={proj.id}
            className="p-4 rounded-2xl bg-[#0F0F0F] border border-gray-800"
          >
            <div className="flex items-start justify-between">
              <div onClick={() => onSelect(proj)} className="cursor-pointer">
                <div className="text-lg font-semibold">{proj.name}</div>
                <div className="text-xs text-gray-400">
                  {proj.location} • {proj.progress}% complete
                </div>
                <div className="w-full mt-3 h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    style={{
                      width: `${proj.progress}%`,
                      background: "linear-gradient(90deg,#032915,#00FF88)",
                    }}
                    className="h-2 rounded-full"
                  />
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-gray-400">Allocated</div>
                <div className="font-semibold">{proj.totalAllocation} ETH</div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {proj.milestones.map((m) => (
                <div key={m.id} className="p-3 rounded-lg bg-gray-900">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{m.title}</div>
                    <div
                      className={`text-xs px-2 py-1 rounded ${statusBadge(
                        m.status
                      )}`}
                    >
                      {m.status}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Deadline: {m.deadline}
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    Tranche: {m.tranche} ETH
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => onSelect(proj)}
                      className="px-2 py-1 rounded bg-[#07130E] border border-[#02321E] text-sm"
                    >
                      Open
                    </button>
                    <button
                      className="px-2 py-1 rounded bg-gray-800 text-sm hover:bg-[#07130E]"
                      onClick={() =>
                        showMessage(JSON.stringify(m, null, 2), "info", 8000)
                      }
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Evidence Submission Tab ---------------- */
function EvidenceSubmissionTab({
  projects,
  selectedProject,
  onSubmit,
  onSetMilestone,
  showMessage,
}) {
  const [projectId, setProjectId] = useState(
    selectedProject?.id ?? projects[0]?.id
  );
  const [milestoneId, setMilestoneId] = useState(
    projects[0]?.milestones?.[0]?.id ?? null
  );
  const [files, setFiles] = useState([]);
  const [notes, setNotes] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (selectedProject) setProjectId(selectedProject.id);
  }, [selectedProject]);

  useEffect(() => {
    const proj = projects.find((p) => p.id === projectId);
    setMilestoneId(proj?.milestones?.[0]?.id ?? null);
  }, [projectId, projects]);

  function handleFiles(e) {
    setFiles(Array.from(e.target.files));
  }

  function handleSubmit() {
    if (!projectId || !milestoneId)
      return showMessage("Select project and milestone", "error");
    onSubmit({ projectId, milestoneId, files, notes, progress });
    setFiles([]);
    setNotes("");
    showMessage(
      "Evidence submitted (mock). Replace with IPFS + Sepolia relayer flow.",
      "info",
      6000
    );
  }

  const proj = projects.find((p) => p.id === projectId);

  return (
    <div className="bg-[#0F0F0F] p-6 rounded-2xl border border-gray-800">
      <h3 className="text-lg font-semibold mb-2 text-[#00FF88]">
        Evidence Submission
      </h3>
      <p className="text-sm text-gray-400 mb-4">
        Upload proofs for milestones. These will be visible to the funder and
        auditor for verification. (VC is issued by auditor after verification.)
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <label className="text-xs text-gray-400">Project</label>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="w-full p-3 rounded-xl bg-black border border-gray-800"
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <label className="text-xs text-gray-400">Milestone</label>
          <select
            value={milestoneId}
            onChange={(e) => {
              setMilestoneId(e.target.value);
              onSetMilestone && onSetMilestone(e.target.value);
            }}
            className="w-full p-3 rounded-xl bg-black border border-gray-800"
          >
            {(proj?.milestones || []).map((m) => (
              <option key={m.id} value={m.id}>
                {m.title} — {m.deadline}
              </option>
            ))}
          </select>

          <label className="text-xs text-gray-400">
            Progress for this milestone (%)
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-xs text-gray-400">{progress}%</div>

          <label className="text-xs text-gray-400 mt-2">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-3 rounded-xl bg-black border border-gray-800 h-28"
          />
        </div>

        <div className="space-y-3">
          <label className="text-xs text-gray-400">Upload Evidence</label>
          <div className="p-4 rounded-xl border border-dashed border-gray-700 bg-[#050505]">
            <input
              multiple
              onChange={handleFiles}
              type="file"
              className="w-full text-sm"
            />
            <div className="text-xs text-gray-500 mt-2">
              {files.length} file(s) selected
            </div>
            <div className="flex gap-2 mt-3 flex-wrap">
              {files.map((f, i) => (
                <div
                  key={i}
                  className="text-xs px-2 py-1 rounded-md bg-gray-900"
                >
                  {f.name}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 rounded-xl border border-[#02321E]"
            >
              Submit Evidence
            </button>
            <button className="px-4 py-2 rounded-xl bg-gray-900">
              Save Draft
            </button>
          </div>

          <div className="mt-4 text-xs text-gray-500">
            Tip: Evidence uploads are immutable once pinned to IPFS. Include
            test logs and clear photos to help auditors.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Funds Tab ---------------- */
function FundsTab({ projects }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2 text-[#00FF88]">
        Funds & Tranches
      </h2>
      <div className="grid gap-3">
        {projects.length === 0 && (
          <div className="p-6 rounded-2xl bg-[#0F0F0F] border border-gray-800 text-gray-400">
            No projects.
          </div>
        )}
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="p-4 rounded-2xl bg-[#0F0F0F] border border-gray-800"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold">{proj.name}</div>
                <div className="text-xs text-gray-400">
                  Allocated: {proj.totalAllocation} ETH • Claimed:{" "}
                  {proj.claimed || 0} ETH
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">Progress</div>
                <div className="font-semibold">{proj.progress}%</div>
              </div>
            </div>

            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-400 border-b border-gray-800">
                    <th className="py-2">Milestone</th>
                    <th>Tranche</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {proj.milestones.map((m) => (
                    <tr key={m.id} className="border-b border-gray-900">
                      <td className="py-2">{m.title}</td>
                      <td>{m.tranche} ETH</td>
                      <td className="text-xs text-gray-300">{m.status}</td>
                      <td>
                        <button
                          disabled={m.status !== "VC Generated"}
                          className={`px-3 py-1 rounded-md text-sm ${
                            m.status === "VC Generated"
                              ? "bg-[#07130E] border border-[#02321E]"
                              : "bg-gray-800 text-gray-500"
                          }`}
                        >
                          Claim
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Extensions Tab ---------------- */
function ExtensionsTab({ projects }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2 text-[#00FF88]">Extensions</h2>
      <div className="grid gap-3">
        {projects.length === 0 && (
          <div className="p-6 rounded-2xl bg-[#0F0F0F] border border-gray-800 text-gray-400">
            No projects.
          </div>
        )}
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="p-4 rounded-2xl bg-[#0F0F0F] border border-gray-800"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold">{proj.name}</div>
                <div className="text-xs text-gray-400">
                  Extensions used: {proj.extensions?.length || 0}
                </div>
              </div>
              <div>
                <button className="px-3 py-1 rounded bg-[#07130E] border border-[#02321E]">
                  Request Extension
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Audit Trail Tab ---------------- */
function AuditTrailTab({ entries }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2 text-[#00FF88]">
        Audit Trail
      </h2>
      <div className="space-y-3 max-h-[60vh] overflow-y-auto">
        {entries.length === 0 && (
          <div className="p-6 rounded-2xl bg-[#0F0F0F] border border-gray-800 text-gray-400">
            No audit entries yet.
          </div>
        )}
        {entries.map((e) => (
          <div
            key={e.id}
            className="p-3 rounded-lg bg-gray-900 border border-gray-800"
          >
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">
                {e.projectName || e.projectId} — {e.milestoneId || "—"}
              </div>
              <div className="text-xs text-gray-400">
                {new Date(e.timestamp).toLocaleString()}
              </div>
            </div>
            <div className="text-xs text-gray-400 mt-2">
              {e.type}:{" "}
              {e.details || (e.files ? `${e.files.length} files` : "")}
            </div>
            {e.files && e.files.length > 0 && (
              <div className="mt-2 flex gap-2">
                {e.files.map((f, i) => (
                  <a
                    key={i}
                    className="text-xs text-[#00FF88] underline"
                    href="#"
                  >
                    {f.name}
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Helpers & Mocks ---------------- */
function statusBadge(status) {
  if (status === "Fund Released") return "bg-[#031826] text-[#00BFFF]";
  if (status === "VC Generated") return "bg-[#052a1d] text-[#00FF88]";
  if (status === "Pending Verification" || status === "Pending")
    return "bg-[#2a2208] text-yellow-400";
  if (status === "Incomplete") return "bg-[#2b0f0f] text-red-400";
  return "bg-gray-800 text-gray-300";
}

function mockProposals() {
  return [
    {
      id: "sep-prop-001",
      name: "Solar Rooftop — Ward 5",
      location: "Zone 5, Sepolia Network",
      totalAllocation: 150,
      milestones: [
        {
          id: "m1",
          title: "Survey & Material Procurement",
          tranche: 50,
          deadline: "2025-11-20",
          status: "Pending",
          progress: 0,
        },
        {
          id: "m2",
          title: "Installation & Testing",
          tranche: 100,
          deadline: "2025-12-25",
          status: "Pending",
          progress: 0,
        },
      ],
      description:
        "Deployment of rooftop solar units across ward 5 schools and offices. All transactions simulated via Sepolia smart escrow.",
    },
    {
      id: "sep-prop-002",
      name: "Waste Composting Units — Block C",
      location: "Municipal Block C",
      totalAllocation: 80,
      milestones: [
        {
          id: "m1",
          title: "Unit Fabrication",
          tranche: 40,
          deadline: "2025-11-28",
          status: "Pending",
          progress: 0,
        },
        {
          id: "m2",
          title: "Deployment & Testing",
          tranche: 40,
          deadline: "2026-01-10",
          status: "Pending",
          progress: 0,
        },
      ],
      description:
        "Setup of composting units under waste segregation program (AuditChain Testnet Demo).",
    },
  ];
}

function mockActive() {
  return [
    {
      id: "sep-proj-01",
      name: "Public Solar Lighting — Ward 4",
      location: "District Central",
      description: "Smart escrow-controlled pilot under Sepolia testnet.",
      totalAllocation: 600,
      claimed: 100,
      progress: 40,
      milestones: [
        {
          id: "m1",
          title: "Material Procurement",
          tranche: 100,
          deadline: "2025-11-15",
          status: "Fund Released",
          progress: 100,
        },
        {
          id: "m2",
          title: "Installation Phase 1",
          tranche: 250,
          deadline: "2025-12-10",
          status: "Pending Verification",
          progress: 70,
        },
        {
          id: "m3",
          title: "VC Verification & Completion",
          tranche: 250,
          deadline: "2026-01-05",
          status: "Incomplete",
          progress: 20,
        },
      ],
      extensions: [],
    },
  ];
}

function mockNotifications() {
  return [
    {
      id: "n1",
      title: "VC Verified",
      body: "Milestone m2 for Public Solar Lighting was verified on Sepolia",
      ts: new Date().toISOString(),
      unread: true,
    },
  ];
}

function mockAudit() {
  return [
    {
      id: "audit-sep-1",
      projectId: "sep-proj-01",
      projectName: "Public Solar Lighting — Sepolia Pilot",
      milestoneId: "m2",
      type: "VC Verification",
      details: "VC hash submitted and verified on Sepolia testnet",
      files: [{ name: "vc-proof.json" }, { name: "site-photo.jpg" }],
      timestamp: new Date().toISOString(),
    },
  ];
}
