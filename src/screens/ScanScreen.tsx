import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Logo } from '../components/Logo'
import { FaceOverlay } from '../components/FaceOverlay'
import { SlideToScan } from '../components/SlideToScan'
import { AnalysisProgress } from '../components/AnalysisProgress'
import { useCameraStream } from '../hooks/useCameraStream'

interface ScanScreenProps {
  onComplete: () => void
}

type ScanPhase = 'preview' | 'scanning' | 'analyzing'

export function ScanScreen({ onComplete }: ScanScreenProps) {
  const { videoRef, hasCamera, error: cameraError } = useCameraStream(true)
  const [phase, setPhase] = useState<ScanPhase>('preview')
  const [analysisStep, setAnalysisStep] = useState(0)

  useEffect(() => {
    if (phase !== 'analyzing') return

    const timers = [
      setTimeout(() => setAnalysisStep(1), 1200),
      setTimeout(() => setAnalysisStep(2), 2400),
      setTimeout(() => setAnalysisStep(3), 3600),
      setTimeout(() => setAnalysisStep(4), 4800),
      setTimeout(() => onComplete(), 5500),
    ]

    return () => timers.forEach(clearTimeout)
  }, [phase, onComplete])

  const handleScanStart = () => {
    setPhase('scanning')
    setTimeout(() => setPhase('analyzing'), 2000)
  }

  return (
    <div className="screen scan-screen">
      <div className="scan-screen__camera">
        {!hasCamera ? (
          <div className="scan-screen__fallback">
            <div className="scan-screen__fallback-gradient" />
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="scan-screen__video"
          />
        )}
        <div className="scan-screen__overlay" />
        <FaceOverlay
          scanning={phase === 'scanning' || phase === 'analyzing'}
          showLandmarks={phase !== 'preview'}
        />
      </div>

      <Logo variant="light" />

      <div className="scan-screen__header">
        <h2 className="scan-screen__title">AI-сканирование</h2>
        <p className="scan-screen__hint">Расположите лицо в центре рамки</p>
      </div>

      <AnimatePresence>
        {phase === 'analyzing' && (
          <motion.div
            className="scan-screen__analysis"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <AnalysisProgress currentStep={analysisStep} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="scan-screen__controls">
        <AnimatePresence>
          {phase === 'preview' && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <SlideToScan onComplete={handleScanStart} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {cameraError && (
        <p className="scan-screen__error">Камера недоступна — демо-режим</p>
      )}

      <style>{`
        .scan-screen {
          background: #000;
        }
        .scan-screen__camera {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }
        .scan-screen__video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scaleX(-1);
        }
        .scan-screen__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.35) 0%,
            transparent 25%,
            transparent 65%,
            rgba(0, 0, 0, 0.5) 100%
          );
          pointer-events: none;
        }
        .scan-screen__fallback {
          width: 100%;
          height: 100%;
          position: relative;
        }
        .scan-screen__fallback-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, #3a3050 0%, #2a2038 50%, #1a1828 100%);
        }
        .scan-screen__header {
          position: absolute;
          top: calc(var(--space-md) + clamp(40px, 5vw, 56px));
          left: 0;
          right: 0;
          text-align: center;
          z-index: 15;
          pointer-events: none;
        }
        .scan-screen__title {
          font-size: var(--font-lg);
          font-weight: 600;
          letter-spacing: 0.06em;
          margin-bottom: 8px;
          color: white;
          text-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
        }
        .scan-screen__hint {
          font-size: var(--font-sm);
          color: rgba(255, 255, 255, 0.85);
          text-shadow: 0 1px 8px rgba(0, 0, 0, 0.4);
        }
        .scan-screen__analysis {
          position: absolute;
          bottom: calc(var(--space-lg) + 80px);
          left: 50%;
          transform: translateX(-50%);
          z-index: 15;
        }
        .scan-screen__controls {
          position: absolute;
          bottom: var(--space-lg);
          left: 0;
          right: 0;
          z-index: 15;
          padding: 0 var(--space-md);
        }
        .scan-screen__error {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: var(--font-md);
          color: rgba(255, 255, 255, 0.7);
          z-index: 12;
        }
      `}</style>
    </div>
  )
}
