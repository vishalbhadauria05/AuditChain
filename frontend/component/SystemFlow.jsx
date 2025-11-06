"use client"

import { motion } from "framer-motion"
import {
  Wallet,
  Lock,
  FileCheck,
  Database,
  ShieldCheck,
  Network,
  Cpu,
  CheckCircle,
  BarChart3,
} from "lucide-react"

const steps = [
  {
    id: 1,
    title: "Funder (Government / Funding Organisation)",
    icon: <Wallet className="w-8 h-8 text-[#00FF88]" />,
    desc: "Creates projects and milestones, and allocates total funds into a Smart Escrow Contract for decentralized milestone-based release."
  },
  {
    id: 2,
    title: "Smart Escrow Contract (Blockchain Layer)",
    icon: <Lock className="w-8 h-8 text-[#00FF88]" />,
    desc: "Holds all funds securely on-chain, defines milestones, tranches, and deadlines, and awaits Verifiable Credential (VC) submissions before releasing funds."
  },
  {
    id: 3,
    title: "Executor (Municipality / Contractor)",
    icon: <FileCheck className="w-8 h-8 text-[#00FF88]" />,
    desc: "Executes project tasks, uploads milestone evidence, and submits verification requests for auditor review."
  },
  {
    id: 4,
    title: "Evidence Storage (IPFS)",
    icon: <Database className="w-8 h-8 text-[#00FF88]" />,
    desc: "Stores immutable project evidence such as images, IoT data, and reports. Generates a unique CID used for verification."
  },
  {
    id: 5,
    title: "Auditor (Verified Credential Issuer)",
    icon: <ShieldCheck className="w-8 h-8 text-[#00FF88]" />,
    desc: "Reviews evidence, validates on-site or IoT data, and issues cryptographically signed Verifiable Credentials (VCs) linked to milestone and CID."
  },
  {
    id: 6,
    title: "Relayer",
    icon: <Network className="w-8 h-8 text-[#00FF88]" />,
    desc: "Transfers VC hashes and auditor signatures to the Smart Escrow Contract, optionally automating milestone expiry or on-chain updates."
  },
  {
    id: 7,
    title: "On-Chain VC Verification",
    icon: <Cpu className="w-8 h-8 text-[#00FF88]" />,
    desc: "Verifies the auditor DID, checks VC signature validity, compares project and milestone IDs, validates CID, and updates project state."
  },
  {
    id: 8,
    title: "Outcome (VC Valid or Missing)",
    icon: <CheckCircle className="w-8 h-8 text-[#00FF88]" />,
    desc: "If VC is valid, funds are released to the Executor's wallet. If missing or expired, funds are reverted or slashed back to the Funder."
  },
  {
    id: 9,
    title: "Public and Internal Dashboards",
    icon: <BarChart3 className="w-8 h-8 text-[#00FF88]" />,
    desc: "Funder tracks project funds, Executor monitors milestones and payments, Auditor sees VC logs, and the public views transparent audit records."
  }
]

// Snappy animation preset (no stagger)
const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
}

export default function SystemFlow() {
  return (
    <section className="relative z-10 py-32 bg-gradient-to-b from-black via-[#0a0a0a] to-black overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,136,0.08)_0%,transparent_80%)] pointer-events-none" />

      {/* Header */}
      <div className="max-w-6xl mx-auto text-center mb-20 relative z-10">
        <p style={{marginTop:-100}} className="text-gray-400 text-lg">
          A connected, verifiable, and tamper-proof fund verification lifecycle powered by blockchain and Verifiable Credentials.
        </p>
      </div>

      {/* Step Cards */}
      <div className="relative max-w-5xl mx-auto flex flex-col items-center space-y-20 z-10">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }} // triggers earlier as you scroll
            className={`relative bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-2xl p-10 w-full md:w-3/4 shadow-[0_0_30px_rgba(0,255,136,0.05)] backdrop-blur-sm ${
              index % 2 === 0 ? "self-start" : "self-end"
            }`}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-[#00FF88]/10 flex items-center justify-center">
                {step.icon}
              </div>
              <h3 className="text-2xl font-semibold text-[#ffffff]">
                {step.title}
              </h3>
            </div>
            <p className="text-gray-400 leading-relaxed">{step.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-32 text-center text-gray-500 text-sm">
        Transparent, tamper-proof, and automated — AuditChain ensures funds move only when verified.
      </div>
    </section>
  )
}
