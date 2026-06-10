import { useState } from 'react'
import { motion } from 'framer-motion'
import { Logo } from '../components/Logo'
import { PodiumCarousel } from '../components/PodiumCarousel'
import { FaceOverlay } from '../components/FaceOverlay'
import { useCameraStream } from '../hooks/useCameraStream'
import { undertoneOptions, skinTypeOptions } from '../data/options'
import type { SkinProfile, SkinType, Undertone } from '../types'

interface ParametersScreenProps {
  onComplete: (profile: SkinProfile) => void
}

export function ParametersScreen({ onComplete }: ParametersScreenProps) {
  const { videoRef, hasCamera, error } = useCameraStream(true)
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
            <div className="parameters-screen__fallback-gradient" />
            {error && <p>Камера недоступна</p>}
          </div>
        )}
        <div className="parameters-screen__overlay" />
        {hasCamera && <FaceOverlay showLandmarks={false} />}
      </div>

      <Logo variant="light" />

      <motion.div
        className="parameters-screen__panel glass"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      >
        <div className="parameters-screen__section">
          <h3 className="parameters-screen__section-title">Выберите свой подтон</h3>
          <PodiumCarousel
            items={undertoneOptions}
            selectedIndex={undertoneIndex}
            onSelect={setUndertoneIndex}
            cardWidth={200}
            renderCard={(item, isCenter) => (
              <div className={`option-card ${isCenter ? 'option-card--center' : ''}`}>
                <div
                  className="option-card__swatch"
                  style={{ background: `linear-gradient(135deg, ${item.color}, ${item.color}88)` }}
                />
                <div className="option-card__info">
                  <span className="option-card__label">{item.label}</span>
                  {isCenter && (
                    <span className="option-card__desc">{item.description}</span>
                  )}
                </div>
              </div>
            )}
          />
        </div>

        <div className="parameters-screen__divider" />

        <div className="parameters-screen__section">
          <h3 className="parameters-screen__section-title">Выберите тип кожи</h3>
          <PodiumCarousel
            items={skinTypeOptions}
            selectedIndex={skinTypeIndex}
            onSelect={setSkinTypeIndex}
            cardWidth={200}
            renderCard={(item, isCenter) => (
              <div className={`option-card ${isCenter ? 'option-card--center' : ''}`}>
                <div
                  className="option-card__swatch option-card__swatch--type"
                  style={{ background: `linear-gradient(135deg, ${item.color}, white)` }}
                />
                <div className="option-card__info">
                  <span className="option-card__label">{item.label}</span>
                  {isCenter && (
                    <span className="option-card__desc">{item.description}</span>
                  )}
                </div>
              </div>
            )}
          />
        </div>

        <motion.button
          className="glow-button parameters-screen__confirm"
          onClick={handleConfirm}
          whileTap={{ scale: 0.97 }}
        >
          ПОДТВЕРДИТЬ
        </motion.button>
      </motion.div>

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
            rgba(0, 0, 0, 0.2) 0%,
            transparent 30%,
            transparent 40%,
            rgba(255, 255, 255, 0.92) 75%,
            rgba(255, 255, 255, 0.97) 100%
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
        .parameters-screen__fallback-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, #e8e0f5 0%, #f8e0ec 50%, #fafafa 100%);
        }
        .parameters-screen__fallback p {
          position: relative;
          z-index: 1;
          color: var(--text-secondary);
        }
        .parameters-screen__panel {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: var(--space-md) var(--space-lg) var(--space-md);
          border-radius: 32px 32px 0 0;
          z-index: 15;
          max-height: 55vh;
          overflow-y: auto;
        }
        .parameters-screen__section-title {
          font-size: var(--font-sm);
          font-weight: 600;
          text-align: center;
          margin-bottom: 8px;
          color: var(--text-primary);
        }
        .parameters-screen__divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(184,160,224,0.3), transparent);
          margin: 20px 0;
        }
        .parameters-screen__confirm {
          display: block;
          margin: 28px auto 0;
          padding: 22px 64px;
          font-size: 18px;
        }
        .option-card {
          background: rgba(255,255,255,0.7);
          border-radius: 20px;
          padding: 20px 16px;
          text-align: center;
          border: 1px solid rgba(255,255,255,0.9);
          transition: box-shadow 0.3s ease;
        }
        .option-card--center {
          box-shadow: 0 12px 40px rgba(180, 160, 220, 0.25);
          background: rgba(255,255,255,0.9);
        }
        .option-card__swatch {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          margin: 0 auto 14px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
        }
        .option-card__swatch--type {
          border-radius: 16px;
        }
        .option-card__label {
          display: block;
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 4px;
        }
        .option-card__desc {
          display: block;
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.4;
        }
      `}</style>
    </div>
  )
}
