"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { Users, CheckCircle, Shield } from "lucide-react"

export default function RolesSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 50])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -40])
  const y3 = useTransform(scrollYProgress, [0, 1], [0, 60])

  const roles = [
    {
      icon: <Users className="w-10 h-10 text-[#00FF88]" />,
      title: "Giver (Funding Authority)",
      desc: "Creates projects and allocates funds to the blockchain escrow. Defines milestones, auditors, and fund release logic."
    },
    {
      icon: <CheckCircle className="w-10 h-10 text-[#00FF88]" />,
      title: "Taker (Implementer / Municipality)",
      desc: "Executes projects, submits evidence to IPFS, and requests milestone verification for tranche release."
    },
    {
      icon: <Shield className="w-10 h-10 text-[#00FF88]" />,
      title: "Auditor (Verifier / Credential Issuer)",
      desc: "Reviews on-ground evidence and issues Verifiable Credentials (VCs) confirming milestone completion."
    }
  ]

  return (
    <section style={{marginBottom:-260}} ref={ref} className="relative py-32 bg-black text-white overflow-hidden">
      {/* glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,136,0.08)_0%,transparent_80%)] pointer-events-none" />

      {/* cards */}
      <div className="max-w-6xl mx-auto text-center mb-16 relative z-10">
        <h2 className="text-5xl font-bold text-[#00FF88] mb-6">The Three Pillars</h2>
        <p className="text-gray-400 text-lg">
          Each role contributes to a transparent and trustless verification ecosystem.
        </p>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto grid md:grid-cols-3 gap-10 px-6">
        {roles.map((role, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(0,255,136,0.3)" }}
            className="relative bg-gradient-to-b from-gray-900 to-black border border-gray-800 rounded-2xl p-10 flex flex-col items-center text-center space-y-6 transition-all duration-300"
          >
            <div className="w-20 h-20 rounded-full bg-[#00FF88]/10 flex items-center justify-center mb-4">
              {role.icon}
            </div>
            <h3 className="text-2xl font-semibold text-[#00FF88]">{role.title}</h3>
            <p className="text-gray-400 leading-relaxed">{role.desc}</p>

            {/* small transparent anchor for wire alignment */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-2 h-2 bg-transparent" id={`wire-anchor-${i}`} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
