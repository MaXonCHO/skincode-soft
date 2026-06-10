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
                    <div className="option-card__image-frame">
                      <img
                        className="option-card__image option-card__image--tone"
                        src={item.image}
                        alt={`${item.label} подтон`}
                        draggable={false}
                      />
                    </div>
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
                    <div className="option-card__image-frame">
                      <img
                        className="option-card__image"
                        src={item.image}
                        alt={`${item.label} тип кожи`}
                        draggable={false}
                      />
                    </div>
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
          background: rgba(255, 255, 255, 0.68);
          backdrop-filter: blur(28px) saturate(150%);
          -webkit-backdrop-filter: blur(28px) saturate(150%);
          border: 1px solid rgba(255, 255, 255, 0.8);
          border-radius: 20px;
          padding: clamp(16px, 2vw, 24px) clamp(20px, 2.5vw, 32px);
          z-index: 15;
          box-shadow: 0 18px 48px rgba(35, 28, 48, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.85);
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
          height: 178px;
          background: linear-gradient(145deg, rgba(255, 255, 255, 0.72), rgba(255, 255, 255, 0.4));
          backdrop-filter: blur(18px) saturate(145%);
          -webkit-backdrop-filter: blur(18px) saturate(145%);
          border-radius: 18px;
          padding: 10px 10px 12px;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.82);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 10px 28px rgba(38, 28, 48, 0.1);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .option-card--center {
          border-color: rgba(255, 255, 255, 0.95);
          box-shadow: inset 0 1px 0 #fff, 0 14px 34px rgba(38, 28, 48, 0.18), 0 0 0 1px rgba(116, 99, 135, 0.16);
        }
        .option-card__image-frame {
          width: 100%;
          height: 104px;
          margin: 0 auto 9px;
          overflow: hidden;
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.38);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.78);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.86);
        }
        .option-card__image {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          pointer-events: none;
        }
        .option-card__image--tone {
          object-fit: contain;
          object-position: center bottom;
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
