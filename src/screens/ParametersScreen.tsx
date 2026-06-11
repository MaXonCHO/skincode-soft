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

      <div className="parameters-screen__header">
        <AnimatePresence mode="wait">
          <motion.h3
            key={step}
            className="parameters-screen__title"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {step === 'undertone' ? 'Выберите свой подтон' : 'Выберите тип кожи'}
          </motion.h3>
        </AnimatePresence>
      </div>

      <div className="parameters-screen__panel">
        <AnimatePresence mode="wait">
          {step === 'undertone' && (
            <motion.div
              key="undertone"
              className="parameters-screen__step"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <PodiumCarousel
                items={undertoneOptions}
                selectedIndex={undertoneIndex}
                onSelect={setUndertoneIndex}
                getItemLabel={(item) => item.label}
                cardWidth={205}
                cardGap={22}
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
                    <span className="option-card__desc">{item.description}</span>
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
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <PodiumCarousel
                items={skinTypeOptions}
                selectedIndex={skinTypeIndex}
                onSelect={setSkinTypeIndex}
                getItemLabel={(item) => item.label}
                cardWidth={205}
                cardGap={22}
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
                    <span className="option-card__desc">{item.description}</span>
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
            rgba(0,0,0,.4) 0%,
            transparent 28%,
            rgba(0,0,0,.08) 52%,
            rgba(0,0,0,.78) 100%
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
          background: linear-gradient(180deg, #292929 0%, #151515 50%, #050505 100%);
        }
        .parameters-screen__fallback p {
          position: relative;
          z-index: 1;
          color: rgba(255,255,255,.72);
        }
        .parameters-screen__panel {
          position: absolute;
          bottom: var(--space-md);
          left: 50%;
          transform: translateX(-50%);
          width: min(96vw, 980px);
          padding: 0;
          z-index: 15;
        }
        .parameters-screen__header {
          position: absolute;
          top: calc(var(--space-md) + clamp(40px, 5vw, 56px));
          left: 0;
          right: 0;
          z-index: 15;
          text-align: center;
          pointer-events: none;
        }
        .parameters-screen__step {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .parameters-screen__title {
          font-family: inherit;
          font-size: var(--font-lg);
          font-weight: 600;
          text-align: center;
          margin-bottom: 0;
          color: #fff;
          letter-spacing: .06em;
          text-shadow: 0 2px 12px rgba(0,0,0,.4);
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
          height: 242px;
          font-family: inherit;
          background: rgba(255,255,255,.22);
          backdrop-filter: blur(18px) saturate(145%);
          -webkit-backdrop-filter: blur(18px) saturate(145%);
          border-radius: 18px;
          padding: 12px 12px 15px;
          text-align: center;
          border: 1px solid rgba(255,255,255,.42);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.42), 0 12px 30px rgba(0,0,0,.14);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .option-card--center {
          border-color: #fff;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.5), 0 16px 38px rgba(0,0,0,.24), 0 0 0 1px rgba(255,255,255,.22);
        }
        .option-card__image-frame {
          width: 100%;
          height: 154px;
          margin: 0 auto 11px;
          overflow: hidden;
          border-radius: 13px;
          background: rgba(255,255,255,.2);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,.46);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.34);
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
          font-size: 17px;
          font-weight: 600;
          color: #fff;
          margin-bottom: 2px;
        }
        .option-card__desc {
          display: block;
          font-size: 12px;
          color: rgba(255,255,255,.72);
          line-height: 1.35;
        }
        .parameters-screen .btn-primary,
        .parameters-screen .btn-secondary {
          color: #fff;
          background: transparent;
          border-color: rgba(255,255,255,.78);
          box-shadow: none;
        }
        .parameters-screen .podium-carousel__dot::before {
          border-color: rgba(255,255,255,.58);
        }
        .parameters-screen .podium-carousel__dot--active::before {
          border-color: #fff;
        }
      `}</style>
    </div>
  )
}
