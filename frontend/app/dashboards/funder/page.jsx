// File: dashboards/funder/page.jsx
// Funder Dashboard — Single Page Implementation (Plug and Play)

'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings, LogOut } from 'lucide-react'
import Image from 'next/image'

export default function FunderDashboard() {
  const [openCreate, setOpenCreate] = useState(false)

  const projects = [
    { title: 'SolarStreet Initiative', budget: '₹5,000,000', milestones: 5, status: 'Active' },
    { title: 'WaterSave Project', budget: '₹3,000,000', milestones: 4, status: 'Ongoing' }
  ]

  const vcs = [
    { project: 'SolarStreet', milestone: 'M1', auditor: 'Auditor A', hash: '0xabc...12', status: 'Verified', time: '2025-10-12 08:00Z' },
    { project: 'WaterSave', milestone: 'M2', auditor: 'Auditor B', hash: '0xdef...34', status: 'Pending', time: '2025-10-24 09:20Z' }
  ]

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Header */}
      <header className="border-b border-[#00FF8844] p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="AuditChain Logo" width={36} height={36} className="rounded-lg" />
          </div>
          <div>
            <div className="text-lg font-semibold text-[#00FF88]">AuditChain</div>
            <div className="text-sm text-gray-400">Funder Dashboard</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">Role: <span className="text-[#00FF88]">Funder</span></span>
          <button className="px-3 py-1 rounded-lg bg-[#111111] text-sm">0x4f...a9B2</button>
          <button className="p-2 rounded-lg bg-[#111111] hover:drop-shadow-[0_0_8px_#00FF88]"><Settings size={18} /></button>
          <button className="p-2 rounded-lg bg-[#111111] hover:bg-[#1b1b1b]"><LogOut size={18} /></button>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto space-y-8">
        {/* Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[{t:'Total Projects',v:'12'},{t:'Active Milestones',v:'34'},{t:'Funds in Escrow',v:'₹12.4M'},{t:'Completed Projects',v:'7'}]
            .map((c,i)=>(
              <motion.div key={i} initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}} className="p-4 bg-[#111111] rounded-2xl shadow-lg">
                <div className="text-sm text-gray-400">{c.t}</div>
                <div className="text-3xl font-semibold text-[#00FF88] mt-2">{c.v}</div>
              </motion.div>
          ))}
        </div>

        {/* Project Management */}
        <section className="p-4 bg-[#111111] rounded-2xl">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Project & Milestone Management</h3>
            <button onClick={()=>setOpenCreate(true)} className="px-3 py-1 rounded-lg bg-[#00FF88]/10 text-[#00FF88]">Create Project</button>
          </div>
          <div className="mt-4 grid gap-3">
            {projects.map((p,i)=>(
              <div key={i} className="p-3 bg-[#0f0f0f] rounded-lg border border-[#00FF8822] flex justify-between">
                <div>
                  <div className="font-semibold">{p.title}</div>
                  <div className="text-sm text-gray-400">Budget: {p.budget} · Milestones: {p.milestones}</div>
                </div>
                <div className="text-sm text-[#00FF88]">{p.status}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Fund Management */}
        <section className="p-4 bg-[#111111] rounded-2xl">
          <h3 className="text-lg font-semibold">Fund Management</h3>
          <div className="mt-4 p-3 bg-[#0f0f0f] rounded-lg border border-[#00FF8822] flex justify-between">
            <div>
              <div className="text-sm text-gray-400">Escrow Balance</div>
              <div className="text-2xl font-semibold text-[#00FF88]">₹12.4M</div>
            </div>
            <button className="px-3 py-1 rounded-lg bg-[#00FF88] text-black">Deposit</button>
          </div>
        </section>

        {/* VC Monitoring */}
        <section className="p-4 bg-[#111111] rounded-2xl">
          <h3 className="text-lg font-semibold">VC Verification Monitoring</h3>
          <div className="mt-4 overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-gray-400 text-left">
                <tr>
                  <th>Project</th><th>Milestone</th><th>Auditor</th><th>Hash</th><th>Status</th><th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {vcs.map((r,i)=>(
                  <tr key={i} className="border-t border-[#ffffff06]">
                    <td className="py-2">{r.project}</td>
                    <td>{r.milestone}</td>
                    <td>{r.auditor}</td>
                    <td className="text-xs text-gray-400">{r.hash}</td>
                    <td>{r.status==='Verified'?<span className="text-[#00FF88]">Verified</span>:<span className="text-yellow-400">Pending</span>}</td>
                    <td className="text-gray-400 text-xs">{r.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Extension & Disputes */}
        <section className="p-4 bg-[#111111] rounded-2xl">
          <h3 className="text-lg font-semibold">Extensions & Disputes</h3>
          <div className="mt-4 p-3 bg-[#0f0f0f] rounded-lg flex justify-between">
            <div>
              <div className="font-semibold">SolarStreet — Extension requested (M2)</div>
              <div className="text-sm text-gray-400">Reason: Rain delays</div>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 rounded-lg bg-[#111111]">Reject</button>
              <button className="px-3 py-1 rounded-lg bg-[#00FF88] text-black">Approve</button>
            </div>
          </div>
        </section>

        {/* Analytics */}
        <section className="p-4 bg-[#111111] rounded-2xl">
          <h3 className="text-lg font-semibold">Reporting & Analytics</h3>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-[#0f0f0f] rounded-lg">Milestone Completion</div>
            <div className="p-3 bg-[#0f0f0f] rounded-lg">Fund Utilization</div>
            <div className="p-3 bg-[#0f0f0f] rounded-lg">VC Timeline</div>
          </div>
        </section>
      </main>

      {openCreate && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-[#0b0b0b] p-6 rounded-2xl w-full max-w-lg">
            <h4 className="text-lg font-semibold">Create Project</h4>
            <form className="mt-4 space-y-3" onSubmit={(e)=>{e.preventDefault();setOpenCreate(false)}}>
              <input className="w-full p-3 bg-[#111111] rounded-lg" placeholder="Project title" />
              <textarea className="w-full p-3 bg-[#111111] rounded-lg" placeholder="Description" />
              <div className="flex gap-2">
                <input className="flex-1 p-3 bg-[#111111] rounded-lg" placeholder="Budget (tokens)" />
                <input className="w-40 p-3 bg-[#111111] rounded-lg" placeholder="# Milestones" />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={()=>setOpenCreate(false)} className="px-4 py-2 rounded-lg bg-[#111111]">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-[#00FF88] text-black">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}