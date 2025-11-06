"use client"

import { motion } from "framer-motion"
import { Wallet, Lock, Database, Cpu, FileCheck, Network, BarChart3 } from "lucide-react"

const steps = [
  {
    id: 1,
    title: "Giver → Escrow Contract",
    icon: <Wallet className="w-8 h-8 text-[#00FF88]" />,
    desc: "The Giver creates a project and deposits funds into the blockchain EscrowContract with predefined milestones and deadlines."
  },
  {
    id: 2,
    title: "Escrow Contract",
    icon: <Lock className="w-8 h-8 text-[#00FF88]" />,
    desc: "The EscrowContract securely holds project funds on-chain, stores milestone logic, and waits for valid verification credentials."
  },
  {
    id: 3,
    title: "Taker & Auditor",
    icon: <FileCheck className="w-8 h-8 text-[#00FF88]" />,
    desc: "The Taker uploads milestone evidence to IPFS. The Auditor reviews it, performs verification, and signs a Verifiable Credential (VC)."
  },
  {
    id: 4,
    title: "Off-chain Evidence Storage",
    icon: <Database className="w-8 h-8 text-[#00FF88]" />,
    desc: "Evidence such as images, IoT logs, and reports are stored on IPFS or Arweave. The CID is embedded inside the Verifiable Credential."
  },
  {
    id: 5,
    title: "Relayer / Oracle",
    icon: <Network className="w-8 h-8 text-[#00FF88]" />,
    desc: "A Relayer or Oracle posts the VC hash and signature to the EscrowContract for on-chain validation and automated fund logic."
  },
  {
    id: 6,
    title: "Smart Contract Verification",
    icon: <Cpu className="w-8 h-8 text-[#00FF88]" />,
    desc: "The EscrowContract verifies auditor DID, VC hash, and milestone validity. Valid VCs trigger tranche release; invalid ones revert funds."
  },
  {
    id: 7,
    title: "Public Dashboard",
    icon: <BarChart3 className="w-8 h-8 text-[#00FF88]" />,
    desc: "Everyone — Giver, Taker, Auditor — can view verified milestones, fund flows, and immutable audit logs in real time."
  }
]

// Animation configs (JS version)
const cardVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.4 + 0.5, duration: 0.7, ease: "easeOut" }
  })
}

const wireVariants = {
  hidden: { pathLength: 0 },
  visible: (i) => ({
    pathLength: 1,
    transition: { delay: i * 0.4, duration: 0.8, ease: "easeInOut" }
  })
}

export default function SystemFlow() {
  return (
    <section className="relative z-10 py-32 bg-gradient-to-b from-black via-[#0a0a0a] to-black overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,136,0.08)_0%,transparent_80%)] pointer-events-none" />

      {/* Header */}
      <div className="max-w-6xl mx-auto text-center mb-20 relative z-10">
          <p style={{marginTop:-100}} className="text-gray-400 mt-6 text-lg">
          A connected, verifiable, and tamper-proof fund release process.
        </p>
      </div>

      {/* Main section */}
      <div className="relative max-w-5xl mx-auto flex flex-col items-center space-y-24 z-10">
        {/* Curved connecting wires */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 1000 2300"
          preserveAspectRatio="xMidYMid meet"
        >
          {[...Array(6)].map((_, i) => {
            const yStart = 260 + i * 260
            const yEnd = yStart + 260
            const isLeft = i % 2 === 0
            const xStart = isLeft ? 300 : 700
            const xEnd = isLeft ? 700 : 300
            const cp1x = isLeft ? 120 : 880
            const cp2x = isLeft ? 880 : 120

            return (
              <motion.path
                key={i}
                d={`M ${xStart} ${yStart}
                   C ${cp1x} ${yStart + 200},
                     ${cp2x} ${yEnd - 200},
                     ${xEnd} ${yEnd}`}
                stroke="url(#beam)"
                strokeWidth="2"
                fill="transparent"
                variants={wireVariants}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                style={{ filter: "blur(1px)", mixBlendMode: "screen" }}
              />
            )
          })}
          <defs>
            <linearGradient id="beam" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#00FF88" stopOpacity="0.15" />
              <stop offset="50%" stopColor="#00FF88" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#00FF88" stopOpacity="0.15" />
            </linearGradient>
          </defs>
        </svg>

        {/* Step cards */}
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            variants={cardVariants}
            custom={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className={`relative bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-2xl p-10 w-full md:w-3/4 shadow-[0_0_35px_rgba(0,255,136,0.08)] backdrop-blur-sm ${
              index % 2 === 0 ? "self-start" : "self-end"
            }`}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-[#00FF88]/10 flex items-center justify-center">
                {step.icon}
              </div>
              <h3 className="text-2xl font-semibold text-[#00FF88]">{step.title}</h3>
            </div>
            <p className="text-gray-400 leading-relaxed">{step.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Footer text */}
      <div className="mt-32 text-center text-gray-500 text-sm">
        A transparent, automated audit trail — from allocation to verified milestones.
      </div>
    </section>
  )
}
