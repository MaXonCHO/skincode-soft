import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Logo } from '../components/Logo'
import { PodiumCarousel } from '../components/PodiumCarousel'
import { FaceOverlay } from '../components/FaceOverlay'
import { useCameraStream } from '../hooks/useCameraStream'
import { undertoneOptions, skinTypeOptions } from '../data/options'
import type { SkinProfile, SkinType, Undertone } from '../types'

interface ParametersScreenProps {
  onComplete: (profile: SkinProfile) => void
}

type Step = 'undertone' | 'skinType'

export function ParametersScreen({ onComplete }: ParametersScreenProps) {
  const { videoRef, hasCamera, error } = useCameraStream(true)
  const [step, setStep] = useState<Step>('undertone')
  const [undertoneIndex, setUndertoneIndex] = useState(2)
  const [skinTypeIndex, setSkinTypeIndex] = useState(3)

  const selectedUndertone = undertoneOptions[undertoneIndex]
  const selectedSkinType = skinTypeOptions[skinTypeIndex]

  const handleConfirm = () => {
    onComplete({
      undertone: selectedUndertone.id as Undertone,
      skinType: selectedSkinType.id as SkinType,
    })
  }

  return (
    <div className="screen parameters-screen">
      <div className="parameters-screen__camera">
        {hasCamera ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="parameters-screen__video"
          />
        ) : (
          <div className="parameters-screen__fallback">
            <div className="parameters-screen__fallback-bg" />
            {error && <p>Камера недоступна</p>}
          </div>
        )}
        <div className="parameters-screen__overlay" />
        {hasCamera && <FaceOverlay showLandmarks={false} />}
      </div>

      <Logo variant="light" />

      <div className="parameters-screen__panel">
        <AnimatePresence mode="wait">
          {step === 'undertone' && (
            <motion.div
              key="undertone"
              className="parameters-screen__step"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.35 }}
            >
              <h3 className="parameters-screen__title">Выберите свой подтон</h3>
              <PodiumCarousel
                items={undertoneOptions}
                selectedIndex={undertoneIndex}
                onSelect={setUndertoneIndex}
                cardWidth={150}
                cardGap={16}
                renderCard={(item, isCenter) => (
                  <div className={`option-card ${isCenter ? 'option-card--center' : ''}`}>
                    <div
                      className="option-card__swatch"
                      style={{ background: item.color }}
                    />
                    <span className="option-card__label">{item.label}</span>
                    {isCenter && (
                      <span className="option-card__desc">{item.description}</span>
                    )}
                  </div>
                )}
              />
              <motion.button
                className="btn-primary parameters-screen__action"
                onClick={() => setStep('skinType')}
                whileTap={{ scale: 0.97 }}
              >
                ДАЛЕЕ
              </motion.button>
            </motion.div>
          )}

          {step === 'skinType' && (
            <motion.div
              key="skinType"
              className="parameters-screen__step"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.35 }}
            >
              <h3 className="parameters-screen__title">Выберите тип кожи</h3>
              <PodiumCarousel
                items={skinTypeOptions}
                selectedIndex={skinTypeIndex}
                onSelect={setSkinTypeIndex}
                cardWidth={150}
                cardGap={16}
                renderCard={(item, isCenter) => (
                  <div className={`option-card ${isCenter ? 'option-card--center' : ''}`}>
                    <div className="option-card__swatch option-card__swatch--type" />
                    <span className="option-card__label">{item.label}</span>
                    {isCenter && (
                      <span className="option-card__desc">{item.description}</span>
                    )}
                  </div>
                )}
              />
              <div className="parameters-screen__actions">
                <button
                  className="btn-secondary parameters-screen__back"
                  onClick={() => setStep('undertone')}
                >
                  НАЗАД
                </button>
                <motion.button
                  className="btn-primary parameters-screen__action"
                  onClick={handleConfirm}
                  whileTap={{ scale: 0.97 }}
                >
                  ПОДТВЕРДИТЬ
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .parameters-screen {
          background: #000;
        }
        .parameters-screen__camera {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }
        .parameters-screen__video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scaleX(-1);
        }
        .parameters-screen__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.15) 0%,
            transparent 35%,
            transparent 55%,
            rgba(255, 255, 255, 0.85) 82%,
            #fff 100%
          );
          pointer-events: none;
        }
        .parameters-screen__fallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .parameters-screen__fallback-bg {
          position: absolute;
          inset: 0;
          background: #f5f5f5;
        }
        .parameters-screen__fallback p {
          position: relative;
          z-index: 1;
          color: #666;
        }
        .parameters-screen__panel {
          position: absolute;
          bottom: var(--space-md);
          left: 50%;
          transform: translateX(-50%);
          width: min(92vw, 640px);
          background: #fff;
          border: 1px solid #000;
          border-radius: 20px;
          padding: clamp(16px, 2vw, 24px) clamp(20px, 2.5vw, 32px);
          z-index: 15;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
        }
        .parameters-screen__step {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .parameters-screen__title {
          font-size: clamp(15px, 1.4vw, 18px);
          font-weight: 600;
          text-align: center;
          margin-bottom: 12px;
          color: #000;
          letter-spacing: 0.02em;
        }
        .parameters-screen__action {
          margin-top: 16px;
        }
        .parameters-screen__actions {
          display: flex;
          gap: 12px;
          margin-top: 16px;
          width: 100%;
          justify-content: center;
        }
        .parameters-screen__back {
          flex: 0 1 auto;
        }
        .parameters-screen__actions .parameters-screen__action {
          margin-top: 0;
          flex: 0 1 auto;
        }
        .option-card {
          background: #fff;
          border-radius: 14px;
          padding: 14px 12px;
          text-align: center;
          border: 1px solid #e0e0e0;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .option-card--center {
          border-color: #000;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }
        .option-card__swatch {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          margin: 0 auto 10px;
          border: 1px solid #000;
        }
        .option-card__swatch--type {
          border-radius: 12px;
          background: #f5f5f5;
        }
        .option-card__label {
          display: block;
          font-size: 15px;
          font-weight: 600;
          color: #000;
          margin-bottom: 2px;
        }
        .option-card__desc {
          display: block;
          font-size: 11px;
          color: #666;
          line-height: 1.35;
        }
      `}</style>
    </div>
  )
}
