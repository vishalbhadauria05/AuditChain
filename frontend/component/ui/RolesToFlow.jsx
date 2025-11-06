"use client"
import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"

export default function RolesToSystemBridge() {
  const containerRef = useRef(null)
  const cardRefs = [useRef(null), useRef(null), useRef(null)]
  const [paths, setPaths] = useState([])

  useEffect(() => {
    function updatePaths() {
      const rects = cardRefs.map(r => r.current?.getBoundingClientRect())
      const container = containerRef.current?.getBoundingClientRect()
      if (!rects[0] || !container) return

      const offsetY = container.top
      const centerY = rects[0].bottom - offsetY - 20 // bottom of cards
      const workflowY = 400 // target label Y inside svg viewBox

      const newPaths = rects.map(r => {
        const startX = r.left + r.width / 2 - container.left
        return `M ${startX} ${centerY} C ${startX} ${centerY + 80}, 720 ${centerY + 150}, 720 ${workflowY}`
      })
      setPaths(newPaths)
    }
    updatePaths()
    window.addEventListener("resize", updatePaths)
    return () => window.removeEventListener("resize", updatePaths)
  }, [])

  return (
    <section ref={containerRef} className="relative w-full h-[400px] bg-black overflow-hidden flex items-end justify-center">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 500" preserveAspectRatio="none">
        <defs>
          <linearGradient id="beamGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00FF88" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#00FF88" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#00FF88" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        {paths.map((d, i) => (
          <motion.path key={i} d={d} stroke="url(#beamGradient)" strokeWidth="3" fill="transparent" />
        ))}
      </svg>

      {/* assign refs to your 3 role cards */}
      <div className="absolute top-0 w-full flex justify-center gap-20">
        {[0,1,2].map(i => (
          <div key={i} ref={cardRefs[i]} className="w-64 h-48 bg-transparent" />
        ))}
      </div>

      <h2 style={{fontSize:60}} className=" text-4xl font-extrabold text-[#00FF88] mb-5 z-10">System Workflow</h2>
    </section>
  )
}
