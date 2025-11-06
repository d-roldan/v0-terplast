"use client"

import { motion } from "framer-motion"
import type { ProcessStatus } from "./tank-control"
import { tankColors } from "./tank-selector"

interface TankHeaderProps {
  tankNumber: number
  status: ProcessStatus
}

export function TankHeader({ tankNumber, status }: TankHeaderProps) {
  const colors = tankColors[tankNumber as keyof typeof tankColors]

  return (
    <div
      className={`bg-gradient-to-r text-left leading-7 my-0.5 mx-0 px-5 py-3.5 ${colors.bg} p-2 border border-[#3a3e45] rounded-xl shadow ${colors.shadow}`}
    >
      <div className="flex items-center justify-between relative">
        <motion.div
          animate={status === "filling" ? { scale: [1, 1.05, 1] } : {}}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
          className="text-2xl font-bold text-white drop-shadow-lg"
        >
          Tanque N° {tankNumber}
        </motion.div>

        {status === "filling" && (
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
            className="absolute left-1/2 -translate-x-1/2 px-6 py-2 bg-gray-900/90 backdrop-blur-sm rounded-lg text-cyan-400 font-bold text-base border-2 border-cyan-400/50 shadow-lg shadow-cyan-500/20"
          >
            ENVASANDO
          </motion.div>
        )}

        {status === "filling" && (
          <div className="relative w-32 h-24">
            <motion.div
              initial={{ x: -40 }}
              animate={{ x: [-40, -40, -40, 100] }}
              transition={{
                duration: 8,
                times: [0, 0.7, 0.85, 1],
                repeat: Number.POSITIVE_INFINITY,
              }}
              className="absolute inset-0"
            >
              <svg viewBox="0 0 120 100" className="w-full h-full drop-shadow-2xl">
                {/* Sombra de la lata */}
                <ellipse cx="60" cy="92" rx="28" ry="4" fill="rgba(0,0,0,0.4)" />

                {/* Definiciones de gradientes mejorados */}
                <defs>
                  {/* Gradiente metálico del cuerpo */}
                  <linearGradient id="metalBody" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#c0c0c0" />
                    <stop offset="20%" stopColor="#e8e8e8" />
                    <stop offset="50%" stopColor="#ffffff" />
                    <stop offset="80%" stopColor="#e8e8e8" />
                    <stop offset="100%" stopColor="#c0c0c0" />
                  </linearGradient>

                  <linearGradient id="paintFill" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6b7280" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#9ca3af" stopOpacity="1" />
                    <stop offset="100%" stopColor="#6b7280" stopOpacity="0.9" />
                  </linearGradient>

                  {/* Gradiente radial para la tapa */}
                  <radialGradient id="topGradient" cx="50%" cy="50%">
                    <stop offset="0%" stopColor="#f0f0f0" />
                    <stop offset="70%" stopColor="#d0d0d0" />
                    <stop offset="100%" stopColor="#a0a0a0" />
                  </radialGradient>
                </defs>

                {/* Cuerpo principal de la lata más ancho */}
                <path
                  d="M 35 25 L 35 80 Q 35 88 44 88 L 76 88 Q 85 88 85 80 L 85 25 Z"
                  fill="url(#metalBody)"
                  stroke="#707070"
                  strokeWidth="1.5"
                />

                {/* Anillo superior decorativo */}
                <rect x="34" y="23" width="52" height="3" rx="1.5" fill="#b0b0b0" />

                {/* Tapa superior con gradiente radial */}
                <ellipse cx="60" cy="23" rx="26" ry="6" fill="url(#topGradient)" stroke="#808080" strokeWidth="1.5" />
                <ellipse cx="60" cy="22" rx="23" ry="5" fill="#e0e0e0" />

                {/* Asa de la tapa */}
                <ellipse cx="60" cy="21" rx="10" ry="3.5" fill="#c0c0c0" stroke="#909090" strokeWidth="0.8" />
                <ellipse cx="60" cy="20" rx="7" ry="2" fill="none" stroke="#a0a0a0" strokeWidth="1.2" />

                {/* Reflejos realistas en el cuerpo */}
                <path d="M 40 28 L 40 82 Q 40 85 43 85 L 46 85 Q 49 85 49 82 L 49 28 Z" fill="rgba(255,255,255,0.5)" />
                <path d="M 78 28 L 78 82 Q 78 85 75 85 L 73 85 Q 70 85 70 82 L 70 28 Z" fill="rgba(0,0,0,0.15)" />

                {/* Anillo inferior decorativo */}
                <rect x="34" y="85" width="52" height="3" rx="1.5" fill="#b0b0b0" />

                {/* Base inferior con profundidad */}
                <ellipse cx="60" cy="88" rx="26" ry="6" fill="#a0a0a0" stroke="#707070" strokeWidth="1.5" />
                <ellipse cx="60" cy="87" rx="23" ry="5" fill="#b8b8b8" />

                {/* Chorro de pintura cayendo */}
                <motion.rect
                  x="57"
                  y="5"
                  width="6"
                  height="18"
                  rx="3"
                  fill="url(#paintFill)"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: [0, 1, 1, 0], height: [0, 18, 18, 0] }}
                  transition={{
                    duration: 5,
                    times: [0, 0.1, 0.8, 1],
                    ease: "easeInOut",
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: 3,
                  }}
                />

                {/* Clip path para la pintura */}
                <clipPath id="paintClip">
                  <path d="M 36 16 L 36 80 Q 36 86 43 86 L 77 86 Q 84 86 84 80 L 84 16 Z" />
                </clipPath>

                {/* Relleno de pintura que tapa el fondo */}
                <motion.rect
                  x="36"
                  y="16"
                  width="48"
                  height="74"
                  fill="url(#paintFill)"
                  clipPath="url(#paintClip)"
                  initial={{ height: 10, y: 150 }}
                  animate={{ height: 74, y: 16 }}
                  transition={{
                    duration: 5,
                    ease: "easeInOut",
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: 3,
                  }}
                />

                {/* Brillo en la superficie del líquido */}
                <motion.ellipse
                  cx="60"
                  cy="50"
                  rx="16"
                  ry="5"
                  fill="rgba(255,255,255,0.4)"
                  clipPath="url(#paintClip)"
                  initial={{ cy: 90, opacity: 0 }}
                  animate={{ cy: 22, opacity: [0, 0.6, 0.6, 0] }}
                  transition={{
                    duration: 5,
                    ease: "easeInOut",
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: 3,
                  }}
                />
              </svg>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}
