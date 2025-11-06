"use client"

import { Users, CheckCircle, Shield } from 'lucide-react'
import CubeAnimation from '@/component/ui/fontPillar'
import SystemFlow from '@/component/SystemFlow'
import RolesSection from '@/component/RolesSection'
import RolesToSystemBridge from '@/component/ui/RolesToFlow'

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white overflow-y-auto">
      {/* Hero Section */}
    <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-20">
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{ transform: 'scale(1.5)' }}>
        <CubeAnimation />
      </div>
        <div className="max-w-5xl w-full text-center space-y-8">
          <h1 className="text-6xl md:text-8xl font-bold text-[#00FF88] tracking-tight">
            AuditChain
          </h1>
          <h2 className="text-2xl md:text-3xl font-light text-gray-300">
            Decentralized Audit Trail and Fund Verification Protocol
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            Making public projects transparent, verifiable, and tamper-proof.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <button className="px-8 py-4 bg-[#00FF88] text-black font-semibold rounded-lg hover:bg-[#00FF88] hover:shadow-[0_0_30px_rgba(0,255,136,0.5)] transition-all duration-300">
              Explore Demo
            </button>
            <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-black transition-all duration-300">
              Whitepaper
            </button>
          </div>
        </div>
        
        {/* Subtle divider */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FF88] to-transparent opacity-30"></div>
      </section>
      <RolesSection />
      <RolesToSystemBridge />
      <SystemFlow />

      {/* Technology Section */}
      <section className="relative z-10 py-24 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Powered by Blockchain and Verifiable Credentials
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20">
            {/* Polygon Badge */}
            <div className="flex flex-col items-center space-y-3">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                <span className="text-2xl font-bold">P</span>
              </div>
              <span className="text-gray-400 font-medium">Polygon</span>
            </div>

            {/* IPFS Badge */}
            <div className="flex flex-col items-center space-y-3">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-600 to-cyan-800 flex items-center justify-center">
                <span className="text-2xl font-bold">IPFS</span>
              </div>
              <span className="text-gray-400 font-medium">IPFS</span>
            </div>

            {/* W3C VC Badge */}
            <div className="flex flex-col items-center space-y-3">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00FF88] to-green-700 flex items-center justify-center">
                <span className="text-xl font-bold">VC</span>
              </div>
              <span className="text-gray-400 font-medium">W3C VC</span>
            </div>
          </div>
        </div>
        
        {/* Section divider */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FF88] to-transparent opacity-30"></div>
      </section>

      {/* Call to Action Footer */}
      <section className="relative z-10 py-24 px-6 bg-black">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#00FF88]">
            Join the future of transparent governance.
          </h2>
          <button className="px-10 py-4 bg-[#00FF88] text-black font-semibold rounded-lg hover:bg-[#00FF88] hover:shadow-[0_0_40px_rgba(0,255,136,0.6)] transition-all duration-300 text-lg">
            Get Started
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-6 border-t border-gray-900">
        <div className="max-w-6xl mx-auto text-center text-gray-500 text-sm">
          © 2025 AuditChain. Building trust through transparency.
        </div>
      </footer>
    </div>
  )
}