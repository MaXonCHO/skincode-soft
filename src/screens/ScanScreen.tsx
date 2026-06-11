import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Logo } from '../components/Logo'
import { FaceOverlay } from '../components/FaceOverlay'
import { AnalysisProgress } from '../components/AnalysisProgress'
import { useCameraStream } from '../hooks/useCameraStream'
import { useFaceDetection } from '../hooks/useFaceDetection'

interface ScanScreenProps {
  onComplete: () => void
}

type ScanPhase = 'preview' | 'scanning' | 'analyzing'
const HOLD_DURATION = 1800

export function ScanScreen({ onComplete }: ScanScreenProps) {
  const { videoRef, hasCamera, error: cameraError } = useCameraStream(true)
  const {
    faceBox,
    faceDetected,
    ready: detectionReady,
    error: detectionError,
  } = useFaceDetection(videoRef, hasCamera)
  const [phase, setPhase] = useState<ScanPhase>('preview')
  const [analysisStep, setAnalysisStep] = useState(0)
  const [holdProgress, setHoldProgress] = useState(0)

  const alignment = useMemo(() => getFaceAlignment(faceBox), [faceBox])
  const faceCentered = faceDetected && alignment.centered

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

  const handleScanStart = useCallback(() => {
    setPhase('scanning')
    setTimeout(() => setPhase('analyzing'), 2000)
  }, [])

  useEffect(() => {
    if (phase !== 'preview' || !faceCentered) {
      setHoldProgress(0)
      return
    }

    const startedAt = performance.now()
    const timer = window.setInterval(() => {
      const progress = Math.min(100, ((performance.now() - startedAt) / HOLD_DURATION) * 100)
      setHoldProgress(progress)
      if (progress >= 100) {
        window.clearInterval(timer)
        handleScanStart()
      }
    }, 50)

    return () => window.clearInterval(timer)
  }, [faceCentered, handleScanStart, phase])

  const prompt = phase === 'preview'
    ? detectionError
      ? 'Не удалось запустить распознавание лица'
      : detectionReady
      ? alignment.prompt
      : 'Подготавливаем распознавание лица'
    : phase === 'scanning'
      ? 'Сохраняйте положение'
      : 'Анализируем параметры кожи'

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
        <div className="scan-screen__grid" />
        <FaceOverlay
          scanning={phase === 'scanning' || phase === 'analyzing'}
          showLandmarks
          faceBox={faceBox}
          detected={faceDetected}
          centered={faceCentered}
        />
      </div>

      <Logo variant="light" />

      <div className="scan-screen__header">
        <h2 className="scan-screen__title">Сканирование кожи</h2>
        <p className="scan-screen__hint" role="status" aria-live="polite">
          {prompt}
        </p>
      </div>

      <AnimatePresence>
        {phase === 'analyzing' && (
          <motion.div
            className="scan-screen__analysis"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AnalysisProgress currentStep={analysisStep} faceBox={faceBox} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {phase === 'preview' && (
          <motion.div
            key={prompt}
            className={`scan-screen__guidance ${faceCentered ? 'scan-screen__guidance--ready' : ''}`}
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 18, scale: .97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: .98 }}
          >
            <span className="scan-screen__guidance-dot" />
            <strong>{prompt}</strong>
            {faceCentered && (
              <div className="scan-screen__hold">
                <span style={{ width: `${holdProgress}%` }} />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {cameraError && (
        <p className="scan-screen__error">Камера недоступна — демо-режим</p>
      )}
      {detectionError && !cameraError && (
        <p className="scan-screen__detection-note">Проверьте подключение и обновите страницу</p>
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
          background: linear-gradient(180deg, #292929 0%, #151515 50%, #050505 100%);
        }
        .scan-screen__grid {
          position: absolute;
          inset: 0;
          z-index: 2;
          opacity: .28;
          background-image:
            linear-gradient(rgba(255,255,255,.17) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.17) 1px, transparent 1px),
            linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px);
          background-size: 120px 120px, 120px 120px, 24px 24px, 24px 24px;
          mask-image: radial-gradient(circle at center, #000 20%, rgba(0,0,0,.65) 58%, transparent 92%);
          pointer-events: none;
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
          inset: 0;
          z-index: 15;
          pointer-events: none;
        }
        .scan-screen__guidance {
          position: absolute;
          bottom: var(--space-lg);
          left: 50%;
          transform: translateX(-50%);
          z-index: 15;
          min-width: min(86vw, 380px);
          padding: 16px 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border-radius: 28px;
          background: rgba(255,255,255,.28);
          color: #fff;
          border: 1px solid rgba(255,255,255,.46);
          backdrop-filter: blur(24px) saturate(145%);
          box-shadow: 0 16px 44px rgba(0,0,0,.18);
          overflow: hidden;
        }
        .scan-screen__guidance strong {
          font-size: 15px;
          font-weight: 550;
          letter-spacing: .01em;
        }
        .scan-screen__guidance-dot {
          width: 9px;
          height: 9px;
          flex: 0 0 auto;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 0 0 5px rgba(255,255,255,.14);
        }
        .scan-screen__guidance--ready .scan-screen__guidance-dot {
          background: #fff;
          box-shadow: 0 0 0 5px rgba(255,255,255,.2);
        }
        .scan-screen__hold {
          position: absolute;
          left: 10px;
          right: 10px;
          bottom: 5px;
          height: 3px;
          border-radius: 3px;
          overflow: hidden;
          background: rgba(255,255,255,.16);
        }
        .scan-screen__hold span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: #fff;
          transition: width .08s linear;
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
        .scan-screen__detection-note {
          position: absolute;
          top: var(--space-md);
          right: var(--space-md);
          z-index: 16;
          padding: 8px 14px;
          border-radius: 20px;
          background: rgba(255,255,255,.3);
          color: rgba(255,255,255,.8);
          font-size: 11px;
          backdrop-filter: blur(18px);
        }
      `}</style>
    </div>
  )
}

function getFaceAlignment(faceBox: ReturnType<typeof useFaceDetection>['faceBox']) {
  if (!faceBox) return { centered: false, prompt: 'Расположите лицо перед камерой' }

  const centerX = faceBox.left + faceBox.width / 2
  const centerY = faceBox.top + faceBox.height / 2

  if (faceBox.width < 24) return { centered: false, prompt: 'Подойдите немного ближе' }
  if (faceBox.width > 58) return { centered: false, prompt: 'Отойдите немного дальше' }
  if (centerX < 42) return { centered: false, prompt: 'Сместитесь немного вправо' }
  if (centerX > 58) return { centered: false, prompt: 'Сместитесь немного влево' }
  if (centerY < 40) return { centered: false, prompt: 'Опустите лицо немного ниже' }
  if (centerY > 62) return { centered: false, prompt: 'Поднимите лицо немного выше' }

  return { centered: true, prompt: 'Отлично, сохраняйте положение' }
}
