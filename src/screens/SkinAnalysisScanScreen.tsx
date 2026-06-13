import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FaceOverlay } from '../components/FaceOverlay'
import { useCameraStream } from '../hooks/useCameraStream'
import { useFaceDetection } from '../hooks/useFaceDetection'
import { analyzeSkinImage, getFallbackSkinAnalysis } from '../services/skinAnalysis'
import type { SkinAnalysisResult } from '../types'

interface SkinAnalysisScanScreenProps {
  onComplete: (result: SkinAnalysisResult) => void
}

type ScanPhase = 'preview' | 'capturing' | 'analyzing'

const HOLD_DURATION = 1800

const analysisSteps = [
  'Фиксируем снимок',
  'Оцениваем качество кадра',
  'Разбираем видимые параметры кожи',
  'Подбираем уходовые средства',
]

export function SkinAnalysisScanScreen({ onComplete }: SkinAnalysisScanScreenProps) {
  const { videoRef, hasCamera, error: cameraError } = useCameraStream(true)
  const {
    faceBox,
    faceDetected,
    ready: detectionReady,
    error: detectionError,
  } = useFaceDetection(videoRef, hasCamera)
  const [phase, setPhase] = useState<ScanPhase>('preview')
  const [holdProgress, setHoldProgress] = useState(0)
  const [analysisStep, setAnalysisStep] = useState(0)
  const [apiFallback, setApiFallback] = useState(false)

  const alignment = useMemo(() => getFaceAlignment(faceBox), [faceBox])
  const faceCentered = faceDetected && alignment.centered

  const captureFrame = useCallback(() => {
    const video = videoRef.current
    if (!video || !video.videoWidth || !video.videoHeight) return ''

    const canvas = document.createElement('canvas')
    canvas.width = Math.min(video.videoWidth, 1280)
    canvas.height = Math.round((canvas.width / video.videoWidth) * video.videoHeight)
    const context = canvas.getContext('2d')
    if (!context) return ''

    context.translate(canvas.width, 0)
    context.scale(-1, 1)
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    return canvas.toDataURL('image/jpeg', 0.88)
  }, [videoRef])

  const runAnalysis = useCallback(async () => {
    setPhase('analyzing')
    setAnalysisStep(0)
    setApiFallback(false)

    const image = captureFrame()

    try {
      if (!image) throw new Error('Camera frame is unavailable')
      const result = await analyzeSkinImage(image)
      onComplete(result)
    } catch {
      setApiFallback(true)
      window.setTimeout(() => onComplete(getFallbackSkinAnalysis()), 900)
    }
  }, [captureFrame, onComplete])

  const handleCapture = useCallback(() => {
    setPhase('capturing')
    window.setTimeout(runAnalysis, 650)
  }, [runAnalysis])

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
        handleCapture()
      }
    }, 50)

    return () => window.clearInterval(timer)
  }, [faceCentered, handleCapture, phase])

  useEffect(() => {
    if (phase !== 'analyzing') return

    const timer = window.setInterval(() => {
      setAnalysisStep((step) => Math.min(analysisSteps.length - 1, step + 1))
    }, 1050)

    return () => window.clearInterval(timer)
  }, [phase])

  const prompt = phase === 'preview'
    ? detectionError
      ? 'Не удалось запустить распознавание лица'
      : detectionReady
      ? alignment.prompt
      : 'Подготавливаем распознавание лица'
    : phase === 'capturing'
      ? 'Делаем фотографию'
      : apiFallback
        ? 'API недоступен, показываем демо-анализ'
        : analysisSteps[analysisStep]

  return (
    <div className="screen skin-scan">
      <div className="skin-scan__camera">
        {!hasCamera ? (
          <div className="skin-scan__fallback" />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="skin-scan__video"
          />
        )}
        <div className="skin-scan__tone" />
        <div className="skin-scan__focus" />
        <FaceOverlay
          scanning={phase === 'capturing' || phase === 'analyzing'}
          showLandmarks={phase !== 'preview'}
          faceBox={faceBox}
          detected={faceDetected}
          centered={faceCentered}
        />
      </div>

      <div className="skin-scan__header">
        <span className="skin-scan__eyebrow">Skin condition analysis</span>
        <h2 className="skin-scan__title">Расположите лицо в кадре</h2>
        <p className="skin-scan__hint" role="status" aria-live="polite">{prompt}</p>
      </div>

      <AnimatePresence>
        {phase === 'preview' && (
          <motion.div
            key={prompt}
            className={`skin-scan__guidance ${faceCentered ? 'skin-scan__guidance--ready' : ''}`}
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 18, scale: .97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: .98 }}
          >
            <span className="skin-scan__guidance-dot" />
            <strong>{prompt}</strong>
            {faceCentered && (
              <div className="skin-scan__hold">
                <span style={{ width: `${holdProgress}%` }} />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {phase !== 'preview' && (
        <motion.div
          className="skin-scan__analysis-card"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .45 }}
        >
          <span>{String(analysisStep + 1).padStart(2, '0')}</span>
          <strong>{prompt}</strong>
          <div className="skin-scan__analysis-progress">
            <i style={{ width: `${((analysisStep + 1) / analysisSteps.length) * 100}%` }} />
          </div>
        </motion.div>
      )}

      {cameraError && (
        <p className="skin-scan__error">Камера недоступна</p>
      )}

      <style>{`
        .skin-scan {
          background: #070605;
          color: #fff;
        }
        .skin-scan__camera {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }
        .skin-scan__video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scaleX(-1);
        }
        .skin-scan__fallback {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #2d2928, #100f10 56%, #050505);
        }
        .skin-scan__tone {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(0,0,0,.42), transparent 28%, transparent 64%, rgba(0,0,0,.62)),
            radial-gradient(ellipse at 50% 46%, transparent 0%, transparent 38%, rgba(10,7,6,.42) 74%);
          pointer-events: none;
        }
        .skin-scan__focus {
          position: absolute;
          left: 50%;
          top: 50%;
          width: min(58vw, 560px);
          height: min(76vh, 760px);
          transform: translate(-50%, -45%);
          border-radius: 48%;
          border: 1px solid rgba(255,255,255,.22);
          box-shadow: 0 0 0 999px rgba(0,0,0,.06), inset 0 0 90px rgba(255,255,255,.08);
          pointer-events: none;
          z-index: 4;
        }
        .skin-scan__header {
          position: absolute;
          top: calc(var(--space-md) + 24px);
          left: 0;
          right: 0;
          z-index: 15;
          text-align: center;
          pointer-events: none;
        }
        .skin-scan__eyebrow {
          display: block;
          margin-bottom: 10px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .16em;
          text-transform: uppercase;
          color: rgba(255,255,255,.58);
        }
        .skin-scan__title {
          font-size: var(--font-lg);
          font-weight: 620;
          letter-spacing: .03em;
          margin-bottom: 8px;
          text-shadow: 0 2px 16px rgba(0,0,0,.42);
        }
        .skin-scan__hint {
          font-size: var(--font-sm);
          color: rgba(255,255,255,.82);
          text-shadow: 0 1px 8px rgba(0,0,0,.42);
        }
        .skin-scan__guidance,
        .skin-scan__analysis-card {
          position: absolute;
          left: 50%;
          bottom: var(--space-lg);
          transform: translateX(-50%);
          z-index: 16;
          min-width: min(86vw, 430px);
          padding: 16px 22px;
          border-radius: 28px;
          background: rgba(255,255,255,.24);
          border: 1px solid rgba(255,255,255,.42);
          backdrop-filter: blur(24px) saturate(145%);
          -webkit-backdrop-filter: blur(24px) saturate(145%);
          box-shadow: 0 16px 44px rgba(0,0,0,.2);
        }
        .skin-scan__guidance {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          overflow: hidden;
        }
        .skin-scan__guidance strong,
        .skin-scan__analysis-card strong {
          font-size: 15px;
          font-weight: 560;
          letter-spacing: .01em;
        }
        .skin-scan__guidance-dot {
          width: 9px;
          height: 9px;
          flex: 0 0 auto;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 0 0 5px rgba(255,255,255,.14);
        }
        .skin-scan__guidance--ready .skin-scan__guidance-dot {
          box-shadow: 0 0 0 5px rgba(210,235,11,.22);
        }
        .skin-scan__hold {
          position: absolute;
          left: 10px;
          right: 10px;
          bottom: 5px;
          height: 3px;
          border-radius: 3px;
          overflow: hidden;
          background: rgba(255,255,255,.16);
        }
        .skin-scan__hold span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: #d2eb0b;
          transition: width .08s linear;
        }
        .skin-scan__analysis-card {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 10px 14px;
          align-items: center;
        }
        .skin-scan__analysis-card span {
          font-size: 12px;
          font-weight: 700;
          color: #d2eb0b;
        }
        .skin-scan__analysis-progress {
          grid-column: 1 / -1;
          height: 4px;
          border-radius: 4px;
          overflow: hidden;
          background: rgba(255,255,255,.16);
        }
        .skin-scan__analysis-progress i {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: #d2eb0b;
          transition: width .45s ease;
        }
        .skin-scan__error {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 20;
          color: rgba(255,255,255,.74);
          font-size: var(--font-md);
        }
      `}</style>
    </div>
  )
}

function getFaceAlignment(faceBox: ReturnType<typeof useFaceDetection>['faceBox']) {
  if (!faceBox) return { centered: false, prompt: 'Расположите лицо перед камерой' }

  const centerX = faceBox.left + faceBox.width / 2
  const centerY = faceBox.top + faceBox.height / 2

  if (faceBox.width < 25) return { centered: false, prompt: 'Подойдите немного ближе' }
  if (faceBox.width > 60) return { centered: false, prompt: 'Отойдите немного дальше' }
  if (centerX < 42) return { centered: false, prompt: 'Сместитесь немного вправо' }
  if (centerX > 58) return { centered: false, prompt: 'Сместитесь немного влево' }
  if (centerY < 39) return { centered: false, prompt: 'Опустите лицо немного ниже' }
  if (centerY > 63) return { centered: false, prompt: 'Поднимите лицо немного выше' }

  return { centered: true, prompt: 'Отлично, сохраняйте положение' }
}

