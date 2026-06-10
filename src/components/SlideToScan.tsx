import { useRef, useState, type TouchEvent, type MouseEvent } from 'react'
import { motion } from 'framer-motion'

interface SlideToScanProps {
  onComplete: () => void
  disabled?: boolean
}

export function SlideToScan({ onComplete, disabled = false }: SlideToScanProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [completed, setCompleted] = useState(false)
  const startX = useRef(0)
  const dragging = useRef(false)

  const THUMB_SIZE = 72
  const COMPLETE_THRESHOLD = 0.85

  const getMaxTravel = () => {
    if (!trackRef.current) return 300
    return trackRef.current.offsetWidth - THUMB_SIZE - 8
  }

  const updateProgress = (clientX: number) => {
    if (!trackRef.current || completed || disabled) return
    const rect = trackRef.current.getBoundingClientRect()
    const maxTravel = getMaxTravel()
    const x = Math.max(0, Math.min(clientX - rect.left - THUMB_SIZE / 2, maxTravel))
    const p = x / maxTravel
    setProgress(p)

    if (p >= COMPLETE_THRESHOLD) {
      setCompleted(true)
      setProgress(1)
      onComplete()
    }
  }

  const onStart = (clientX: number) => {
    if (completed || disabled) return
    dragging.current = true
    startX.current = clientX
  }

  const onMove = (clientX: number) => {
    if (!dragging.current) return
    updateProgress(clientX)
  }

  const onEnd = () => {
    if (!dragging.current) return
    dragging.current = false
    if (!completed) {
      setProgress(0)
    }
  }

  const handleTouchStart = (e: TouchEvent) => onStart(e.touches[0].clientX)
  const handleTouchMove = (e: TouchEvent) => onMove(e.touches[0].clientX)
  const handleMouseDown = (e: MouseEvent) => onStart(e.clientX)
  const handleMouseMove = (e: MouseEvent) => onMove(e.clientX)

  const thumbX = progress * getMaxTravel()

  return (
    <div className={`slide-to-scan ${completed ? 'slide-to-scan--done' : ''}`}>
      <div
        ref={trackRef}
        className="slide-to-scan__track glass"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={onEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={onEnd}
        onMouseLeave={onEnd}
      >
        <motion.div
          className="slide-to-scan__fill"
          style={{ width: `${thumbX + THUMB_SIZE}px` }}
          animate={{ opacity: progress > 0.1 ? 1 : 0 }}
        />
        <span className="slide-to-scan__label">
          {completed ? 'Сканирование...' : 'Проведите для сканирования →'}
        </span>
        <motion.div
          className="slide-to-scan__thumb"
          style={{ width: THUMB_SIZE, height: THUMB_SIZE }}
          animate={{ x: thumbX }}
          transition={{ type: 'spring', stiffness: 400, damping: 35 }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </div>

      <style>{`
        .slide-to-scan {
          width: 100%;
          max-width: 520px;
          margin: 0 auto;
          padding: 0 32px;
        }
        .slide-to-scan__track {
          position: relative;
          height: 88px;
          border-radius: 44px;
          display: flex;
          align-items: center;
          overflow: hidden;
          cursor: grab;
          touch-action: none;
        }
        .slide-to-scan__fill {
          position: absolute;
          left: 4px;
          top: 4px;
          bottom: 4px;
          border-radius: 40px;
          background: rgba(0, 0, 0, 0.08);
          pointer-events: none;
        }
        .slide-to-scan__label {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 17px;
          font-weight: 500;
          color: var(--text-secondary);
          letter-spacing: 0.02em;
          pointer-events: none;
          padding-left: 60px;
        }
        .slide-to-scan__thumb {
          position: absolute;
          left: 4px;
          top: 50%;
          margin-top: -36px;
          border-radius: 50%;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
          z-index: 2;
        }
        .slide-to-scan--done .slide-to-scan__track {
          opacity: 0.7;
          pointer-events: none;
        }
      `}</style>
    </div>
  )
}
