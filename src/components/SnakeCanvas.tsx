import React, { useEffect, useRef } from 'react'
import { Volume2, VolumeX, X } from 'lucide-react'
import type { SnakeGameState } from '../game/snakeEngine'

interface SnakeCanvasProps {
  gameState: SnakeGameState
  isRunning: boolean
  onToggleRun: () => void
  onReset: () => void
  soundEnabled: boolean
  onToggleSound: () => void
}

export const SnakeCanvas: React.FC<SnakeCanvasProps> = ({
  gameState,
  isRunning,
  onToggleRun,
  onReset,
  soundEnabled,
  onToggleSound,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const cell = 34
    const width = gameState.gridCols * cell // 17 * 34 = 578
    const height = gameState.gridRows * cell // 15 * 34 = 510

    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr
      canvas.height = height * dpr
    }

    ctx.save()
    ctx.scale(dpr, dpr)

    const { gridCols, gridRows, snake, food, direction } = gameState

    // 1. Google Snake Checkerboard (#aad751 and #a2d149)
    for (let y = 0; y < gridRows; y++) {
      for (let x = 0; x < gridCols; x++) {
        ctx.fillStyle = (x + y) % 2 === 0 ? '#aad751' : '#a2d149'
        ctx.fillRect(x * cell, y * cell, cell, cell)
      }
    }

    // 2. Draw Google Snake Red Apple at food position
    const fx = (food.x + 0.5) * cell
    const fy = (food.y + 0.54) * cell
    const appleRadius = cell * 0.38

    // Subtle shadow under apple
    ctx.fillStyle = 'rgba(0, 0, 0, 0.12)'
    ctx.beginPath()
    ctx.ellipse(fx, fy + appleRadius * 0.85, appleRadius * 0.85, appleRadius * 0.32, 0, 0, Math.PI * 2)
    ctx.fill()

    // Main red apple body
    ctx.fillStyle = '#e7471d'
    ctx.beginPath()
    ctx.arc(fx, fy, appleRadius, 0, Math.PI * 2)
    ctx.fill()

    // Subtle darker bottom curve on apple
    ctx.fillStyle = '#d93d15'
    ctx.beginPath()
    ctx.arc(fx, fy + 1.5, appleRadius * 0.92, 0.15 * Math.PI, 0.85 * Math.PI)
    ctx.fill()

    // Green leaf tilted right
    ctx.save()
    ctx.translate(fx + 2, fy - appleRadius - 1)
    ctx.rotate(-0.35)
    ctx.fillStyle = '#578a34'
    ctx.beginPath()
    ctx.ellipse(4, 0, 6.5, 3.2, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()

    // 3. Draw Continuous Blue Snake (#4974e8)
    if (snake.length > 0) {
      const bodyWidth = cell * 0.74

      // 3a. Soft drop shadow beneath the continuous snake body
      ctx.save()
      ctx.beginPath()
      for (let i = snake.length - 1; i >= 0; i--) {
        const px = (snake[i].x + 0.5) * cell
        const py = (snake[i].y + 0.5) * cell + 3
        if (i === snake.length - 1) {
          ctx.moveTo(px, py)
        } else {
          ctx.lineTo(px, py)
        }
      }
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.13)'
      ctx.lineWidth = bodyWidth
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.stroke()
      ctx.restore()

      // 3b. Main vibrant blue tubular body (#4974e8)
      ctx.save()
      ctx.beginPath()
      for (let i = snake.length - 1; i >= 0; i--) {
        const px = (snake[i].x + 0.5) * cell
        const py = (snake[i].y + 0.5) * cell
        if (i === snake.length - 1) {
          ctx.moveTo(px, py)
        } else {
          ctx.lineTo(px, py)
        }
      }
      ctx.strokeStyle = '#4974e8'
      ctx.lineWidth = bodyWidth
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.stroke()
      ctx.restore()

      // 3c. Head details: Snout, Bulging Eye Sockets, White Sclera, Pupils, and Nostrils
      const head = snake[0]
      const hx = (head.x + 0.5) * cell
      const hy = (head.y + 0.5) * cell

      const dirAngles: Record<string, number> = {
        RIGHT: 0,
        DOWN: Math.PI / 2,
        LEFT: Math.PI,
        UP: -Math.PI / 2,
      }
      const angle = dirAngles[direction] ?? 0

      ctx.save()
      ctx.translate(hx, hy)
      ctx.rotate(angle)

      // Extended rounded snout cap
      ctx.fillStyle = '#4974e8'
      ctx.beginPath()
      ctx.ellipse(cell * 0.08, 0, cell * 0.42, bodyWidth * 0.5, 0, 0, Math.PI * 2)
      ctx.fill()

      // Bulging outer blue eye bumps (top & bottom in local rotated coords)
      const eyeX = -cell * 0.06
      const eyeYOffset = bodyWidth * 0.42
      const outerEyeRadius = cell * 0.21
      const whiteEyeRadius = cell * 0.14
      const pupilRadius = cell * 0.065

      ctx.fillStyle = '#4974e8'
      ctx.beginPath()
      ctx.arc(eyeX, -eyeYOffset, outerEyeRadius, 0, Math.PI * 2)
      ctx.arc(eyeX, eyeYOffset, outerEyeRadius, 0, Math.PI * 2)
      ctx.fill()

      // White sclera
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(eyeX, -eyeYOffset, whiteEyeRadius, 0, Math.PI * 2)
      ctx.arc(eyeX, eyeYOffset, whiteEyeRadius, 0, Math.PI * 2)
      ctx.fill()

      // Dark blue pupils looking slightly forward
      ctx.fillStyle = '#1d3b8b'
      ctx.beginPath()
      ctx.arc(eyeX + 2, -eyeYOffset, pupilRadius, 0, Math.PI * 2)
      ctx.arc(eyeX + 2, eyeYOffset, pupilRadius, 0, Math.PI * 2)
      ctx.fill()

      // Two subtle dark blue nostrils near the tip of the snout
      ctx.fillStyle = '#2952b3'
      ctx.beginPath()
      ctx.arc(cell * 0.28, -cell * 0.11, 1.8, 0, Math.PI * 2)
      ctx.arc(cell * 0.28, cell * 0.11, 1.8, 0, Math.PI * 2)
      ctx.fill()

      ctx.restore()
    }

    ctx.restore()
  }, [gameState])

  return (
    <div className="w-full max-w-[640px] mx-auto shadow-xl rounded-sm overflow-hidden select-none">
      {/* Exact Google Snake Header Bar (#4a752c) */}
      <div className="bg-[#4a752c] h-14 px-5 flex items-center justify-between text-white">
        <div className="flex items-center gap-7">
          {/* Apple + Current Score */}
          <div className="flex items-center gap-2.5">
            <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
              <circle cx="15" cy="18" r="10.5" fill="#e7471d" />
              <ellipse
                cx="19"
                cy="6.5"
                rx="5"
                ry="2.6"
                transform="rotate(-20 19 6.5)"
                fill="#72b043"
              />
            </svg>
            <span className="font-sans text-[22px] font-medium tracking-tight">
              {gameState.score}
            </span>
          </div>

          {/* Gold Trophy + High Score */}
          <div className="flex items-center gap-2.5">
            <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden="true">
              <path
                d="M8 6h16v6c0 4.4-3.6 8-8 8s-8-3.6-8-8V6z"
                fill="#fbbc04"
              />
              <path
                d="M5 8h3v4c0 1.7-1.3 3-3 3V8zm19 0h3v7c-1.7 0-3-1.3-3-3V8z"
                fill="#e3a600"
              />
              <rect x="14" y="19" width="4" height="5" fill="#e3a600" />
              <rect x="10" y="24" width="12" height="3" rx="1" fill="#fbbc04" />
            </svg>
            <span className="font-sans text-[22px] font-medium tracking-tight">
              {gameState.highScore}
            </span>
          </div>
        </div>

        {/* Right Icons: Sound Toggle + Reset/Pause */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Desativar som' : 'Ativar som'}
            className="text-white/95 hover:text-white transition-opacity cursor-pointer p-1"
          >
            {soundEnabled ? (
              <Volume2 className="w-6 h-6 fill-white" />
            ) : (
              <VolumeX className="w-6 h-6" />
            )}
          </button>

          <button
            type="button"
            onClick={onReset}
            aria-label="Reiniciar partida"
            title="Reiniciar partida"
            className="text-white/95 hover:text-white transition-opacity cursor-pointer p-1"
          >
            <X className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Exact Google Snake Grass Frame (#578a34) */}
      <div
        onClick={onToggleRun}
        title="Clique no tabuleiro para pausar ou continuar"
        className="relative bg-[#578a34] p-5 sm:p-6 flex items-center justify-center cursor-pointer"
      >
        <canvas
          ref={canvasRef}
          style={{ width: '100%', aspectRatio: '17 / 15' }}
          className="block shadow-inner"
        />

        {/* Subtle Game Over / Pause Overlay */}
        {!isRunning && !gameState.isGameOver && (
          <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
            <div className="bg-[#4a752c] text-white px-5 py-2.5 rounded shadow-lg font-medium text-sm tracking-wide">
              Jogo Pausado — Clique para continuar
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
