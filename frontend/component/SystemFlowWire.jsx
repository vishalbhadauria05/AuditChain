// "use client"

// import { GoogleGeminiEffect } from "./ui/google-gemini-effect"
// import { motion } from "framer-motion"
// import { Lock, FileCheck, Cpu, Network, Database } from "lucide-react"

// const nodes = [
//   { icon: <Lock className="w-6 h-6 text-[#00FF88]" />, label: "Escrow Contract" },
//   { icon: <FileCheck className="w-6 h-6 text-[#00FF88]" />, label: "VC Verification" },
//   { icon: <Database className="w-6 h-6 text-[#00FF88]" />, label: "IPFS Evidence" },
//   { icon: <Network className="w-6 h-6 text-[#00FF88]" />, label: "Relayer" },
//   { icon: <Cpu className="w-6 h-6 text-[#00FF88]" />, label: "Smart Action" }
// ]

// export default function SystemFlowWire() {
//   return (
//     <section className="relative py-40 bg-gradient-to-br from-black via-[#0d0d0d] to-[#001a10] overflow-hidden">
//       {typeof window !== "undefined" && <GoogleGeminiEffect className="absolute inset-0 opacity-70" />}
//       <div className="relative z-10 max-w-5xl mx-auto text-center mb-16">
//         <h2 className="text-5xl font-bold text-[#00FF88] mb-4">System Workflow</h2>
//         <p className="text-gray-400 text-lg max-w-2xl mx-auto">
//           A transparent flow of funds and verifications — from Giver to Taker to Auditor — all secured by smart contracts.
//         </p>
//       </div>

//       <div className="relative flex flex-col md:flex-row justify-center items-center gap-20 z-10">
//         {nodes.map((node, i) => (
//           <motion.div
//             key={i}
//             initial={{ opacity: 0, y: 50 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: i * 0.2 }}
//             viewport={{ once: true }}
//             className="relative flex flex-col items-center text-center"
//           >
//             <div className="w-20 h-20 rounded-xl bg-[#00FF88]/10 border border-[#00FF88]/30 flex items-center justify-center mb-4">
//               {node.icon}
//             </div>
//             <p className="text-gray-300 text-sm">{node.label}</p>

//             {i !== nodes.length - 1 && (
//               <div className="hidden md:block absolute top-1/2 left-full w-20 h-[1px] bg-gradient-to-r from-[#00FF88]/30 to-transparent"></div>
//             )}
//           </motion.div>
//         ))}
//       </div>
//     </section>
//   )
// }
