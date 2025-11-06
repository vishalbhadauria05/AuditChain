"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Wallet, Hammer, ShieldCheck } from "lucide-react"

export default function AuthPage() {
  const router = useRouter()
  const [mode, setMode] = useState("login")
  const [role, setRole] = useState("Executor")
  const [form, setForm] = useState({
    fullName: "",
    orgName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    wallet: "",
    accreditationId: "",
    contractorId: "",
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function fakeApiDelay() {
    return new Promise(r => setTimeout(r, 700))
  }

  async function handleRegister(e) {
    e && e.preventDefault()
    setMessage(null)
    if (!form.email || !form.username || !form.password) {
      setMessage("Please fill required fields.")
      return
    }
    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match.")
      return
    }
    setLoading(true)
    await fakeApiDelay()
    setLoading(false)
    setMessage("Registration successful — redirecting…")
    redirectToRoleDashboard(role)
  }

  async function handleLogin(e) {
    e && e.preventDefault()
    setMessage(null)
    if (!form.username && !form.wallet) {
      setMessage("Enter username or connect wallet to login.")
      return
    }
    setLoading(true)
    await fakeApiDelay()
    setLoading(false)
    setMessage("Login successful — redirecting…")
    redirectToRoleDashboard(role || "Executor")
  }

  function redirectToRoleDashboard(roleParam) {
    router.push(`/dashboard/${roleParam}`)
  }

  async function connectWallet() {
    setMessage(null)
    if (!window.ethereum) {
      setMessage("No Web3 provider found. Install MetaMask.")
      return
    }
    try {
      setLoading(true)
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" })
      const address = accounts[0]
      update("wallet", address)
      setMessage(`Wallet connected: ${address}`)
    } catch (err) {
      setMessage(`Wallet connection failed: ${err.message || err}`)
    } finally {
      setLoading(false)
    }
  }

  function roleDescription(r) {
    if (r === "Funder") return "Funding authority — creates projects and deposits funds."
    if (r === "auditor") return "Accredited verifier — issues verifiable credentials."
    return "Executor / Implementer — executes project milestones and uploads evidence."
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-6">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* LEFT PANEL - Role Selection */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-10 flex flex-col justify-center rounded-2xl border border-gray-800 bg-gradient-to-b from-black via-[#001a00]/60 to-black/40 shadow-[0_0_30px_rgba(0,255,136,0.08)]"
        >
          <div className="mb-8 text-center">
  <div className="flex justify-center items-center mb-3">
    {/* Replaced SVG with Image logo */}
    <img
      src="/logo.png"      // put your logo in /public/auditchain-logo.png
      alt="AuditChain Logo"
      className="w-16 h-16 object-contain drop-shadow-[0_0_15px_rgba(0,255,136,0.3)]"
    />
  </div>
  <h1 className="text-3xl font-bold text-[#00FF88]">AuditChain</h1>
  <p className="text-gray-400 text-sm mt-1">
    Decentralised Audit-Trail & Smart Escrow System
  </p>
</div>

          <div className="space-y-4">
            {[
              {
                id: "Funder",
                icon: <Wallet className="w-6 h-6 text-[#00FF88]" />,
                title: "Funder",
                desc: "Funds projects, defines milestones & releases escrowed funds.",
              },
              {
                id: "Executor",
                icon: <Hammer className="w-6 h-6 text-[#00FF88]" />,
                title: "Executor",
                desc: "Executes milestones, uploads evidence, and claims verified funds.",
              },
              {
                id: "auditor",
                icon: <ShieldCheck className="w-6 h-6 text-[#00FF88]" />,
                title: "Auditor",
                desc: "Verifies milestones and issues Verifiable Credentials.",
              },
            ].map(r => (
              <motion.div
                key={r.id}
                whileHover={{ scale: 1.05 }}
                onClick={() => setRole(r.id)}
                className={`cursor-pointer p-5 border rounded-xl transition-all ${
                  role === r.id
                    ? "border-[#00FF88] bg-[#001a00]/60 shadow-[0_0_15px_rgba(0,255,136,0.15)]"
                    : "border-gray-700 bg-black/30 hover:border-[#00FF88]/40"
                }`}
              >
                <div className="flex items-center space-x-3">
                  {r.icon}
                  <div>
                    <h3 className="text-white font-semibold text-lg">{r.title}</h3>
                    <p className="text-gray-400 text-sm">{r.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-xs text-gray-500 text-center">
            Select your role to continue →
          </div>
        </motion.div>

        {/* RIGHT PANEL - Auth Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-10 rounded-2xl bg-gray-900/30 border border-gray-800"
        >
          {/* Mode Toggle (No text label now) */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-full bg-black/50 p-2 shadow-[0_0_12px_rgba(0,255,136,0.05)]">
              <button
                onClick={() => setMode("login")}
                className={`px-6 py-3 rounded-full text-base font-medium transition-all ${
                  mode === "login"
                    ? "bg-[#00FF88] text-black shadow-[0_0_20px_rgba(0,255,136,0.3)]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setMode("register")}
                className={`px-6 py-3 rounded-full text-base font-medium transition-all ${
                  mode === "register"
                    ? "bg-[#00FF88] text-black shadow-[0_0_20px_rgba(0,255,136,0.3)]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Register
              </button>
            </div>
          </div>

          <form onSubmit={mode === "register" ? handleRegister : handleLogin}>
            <div className="space-y-5">
              <div>
                <label className="text-xs text-gray-400">Full name / Organization</label>
                <input
                  value={form.fullName}
                  onChange={e => update("fullName", e.target.value)}
                  className="w-full mt-1 p-3 rounded-lg bg-black/30 border border-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#00FF88]"
                  placeholder="Your name or org"
                />
              </div>

              {/* Role-specific fields */}
              {mode === "register" && role === "Funder" && (
                <div>
                  <label className="text-xs text-gray-400">Treasury Wallet Address</label>
                  <input
                    value={form.orgName}
                    onChange={e => update("orgName", e.target.value)}
                    className="w-full mt-1 p-3 rounded-lg bg-black/30 border border-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#00FF88]"
                    placeholder="0x..."
                  />
                </div>
              )}
              {mode === "register" && role === "Executor" && (
                <div>
                  <label className="text-xs text-gray-400">Contractor / Registration ID</label>
                  <input
                    value={form.contractorId}
                    onChange={e => update("contractorId", e.target.value)}
                    className="w-full mt-1 p-3 rounded-lg bg-black/30 border border-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#00FF88]"
                    placeholder="Gov/Company ID"
                  />
                </div>
              )}
              {mode === "register" && role === "auditor" && (
                <div>
                  <label className="text-xs text-gray-400">Accreditation / Certification ID</label>
                  <input
                    value={form.accreditationId}
                    onChange={e => update("accreditationId", e.target.value)}
                    className="w-full mt-1 p-3 rounded-lg bg-black/30 border border-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#00FF88]"
                    placeholder="Certification number"
                  />
                </div>
              )}

              {/* Common fields */}
              <div>
                <label className="text-xs text-gray-400">Email</label>
                <input
                  value={form.email}
                  onChange={e => update("email", e.target.value)}
                  className="w-full mt-1 p-3 rounded-lg bg-black/30 border border-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#00FF88]"
                  type="email"
                  placeholder="you@domain.com"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400">Username</label>
                <input
                  value={form.username}
                  onChange={e => update("username", e.target.value)}
                  className="w-full mt-1 p-3 rounded-lg bg-black/30 border border-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#00FF88]"
                  placeholder="choose-a-username"
                />
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400">Password</label>
                  <input
                    value={form.password}
                    onChange={e => update("password", e.target.value)}
                    type="password"
                    className="w-full mt-1 p-3 rounded-lg bg-black/30 border border-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#00FF88]"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400">Confirm</label>
                  <input
                    value={form.confirmPassword}
                    onChange={e => update("confirmPassword", e.target.value)}
                    type="password"
                    className="w-full mt-1 p-3 rounded-lg bg-black/30 border border-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#00FF88]"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Wallet */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={connectWallet}
                  className="px-5 py-3 rounded-lg bg-[#00220a] text-[#00FF88] border border-[#00FF88] text-sm"
                >
                  Connect Wallet
                </button>
                <input
                  value={form.wallet}
                  onChange={e => update("wallet", e.target.value)}
                  className="flex-1 p-3 rounded-lg bg-black/20 border border-gray-800 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#00FF88]"
                  placeholder="0x... or leave to connect"
                />
              </div>

              {mode === "register" && (
                <div className="flex items-center text-sm text-gray-400">
                  <input id="terms" type="checkbox" className="mr-2" />
                  <label htmlFor="terms">I agree to the platform Terms & Conditions</label>
                </div>
              )}

              <div className="text-xs text-gray-400">{roleDescription(role)}</div>

              {message && <div className="text-sm text-yellow-300">{message}</div>}

              <div className="flex items-center justify-between pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 w-40 rounded-lg bg-[#00FF88] text-black font-semibold text-lg hover:brightness-95 transition-all shadow-[0_6px_20px_rgba(0,255,136,0.2)]"
                  disabled={loading}
                >
                  {loading ? "Working..." : mode === "register" ? "Create" : "Sign in"}
                </button>

                <div className="text-sm text-gray-400">
                  {mode === "register" ? (
                    <button type="button" onClick={() => setMode("login")} className="underline">
                      Already have an account?
                    </button>
                  ) : (
                    <button type="button" onClick={() => setMode("register")} className="underline">
                      Create account
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
