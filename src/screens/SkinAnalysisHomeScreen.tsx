import { motion } from 'framer-motion'
import { Logo } from '../components/Logo'
import { SlideToScan } from '../components/SlideToScan'
import heroPhoto from '../../photo/hero-block-new.png'

interface SkinAnalysisHomeScreenProps {
  onStart: () => void
  onFoundationFlow: () => void
}

export function SkinAnalysisHomeScreen({ onStart, onFoundationFlow }: SkinAnalysisHomeScreenProps) {
  return (
    <div className="screen skin-home">
      <Logo />

      <div className="skin-home__content">
        <motion.div
          className="skin-home__visual"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <img src={heroPhoto} alt="Уход за кожей" className="skin-home__image" />
        </motion.div>

        <motion.div
          className="skin-home__panel"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="skin-home__eyebrow">AI Skin Check</span>
          <h1 className="skin-home__title">АНАЛИЗ СОСТОЯНИЯ КОЖИ</h1>
          <p className="skin-home__subtitle">
            Сделаем снимок при хорошем положении лица, оценим видимые параметры кожи
            и соберём персональный уход.
          </p>

          <div className="skin-home__actions">
            <SlideToScan
              onComplete={onStart}
              label="Начать анализ"
              completedLabel="Открываем камеру..."
            />
            <motion.button
              className="btn-secondary skin-home__foundation-button"
              onClick={onFoundationFlow}
              whileTap={{ scale: .97 }}
            >
              Подобрать тональное средство
            </motion.button>
          </div>
        </motion.div>
      </div>

      <style>{`
        .skin-home {
          background: #fff;
        }
        .skin-home > .logo {
          top: clamp(12px, 1.5vw, 22px);
          left: clamp(14px, 2vw, 32px);
          width: clamp(180px, 18vw, 280px);
        }
        .skin-home__content {
          flex: 1;
          display: grid;
          grid-template-columns: minmax(0, 54%) minmax(0, 46%);
          min-height: 0;
        }
        .skin-home__visual {
          position: relative;
          min-width: 0;
          overflow: hidden;
          background: linear-gradient(135deg, #fbf7f3, #f8edf1 54%, #fff);
        }
        .skin-home__visual::after {
          content: '';
          position: absolute;
          inset: auto 0 0;
          height: 38%;
          background: linear-gradient(180deg, transparent, rgba(255,255,255,.84));
          pointer-events: none;
        }
        .skin-home__image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center bottom;
        }
        .skin-home__panel {
          align-self: center;
          padding: clamp(42px, 6vw, 110px);
          color: #141214;
        }
        .skin-home__eyebrow {
          display: inline-block;
          margin-bottom: 18px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .16em;
          text-transform: uppercase;
          color: rgba(20,20,20,.46);
        }
        .skin-home__title {
          max-width: 720px;
          font-size: clamp(48px, 5vw, 84px);
          line-height: 1;
          font-weight: 700;
          letter-spacing: 0.03em;
          margin-bottom: 28px;
        }
        .skin-home__subtitle {
          max-width: 640px;
          font-size: clamp(19px, 1.55vw, 26px);
          line-height: 1.55;
          color: rgba(20,20,20,.62);
          margin-bottom: 42px;
        }
        .skin-home__actions {
          display: grid;
          gap: 18px;
          width: min(100%, 540px);
        }
        .skin-home__actions .slide-to-scan {
          max-width: none;
          padding: 0;
        }
        .skin-home__actions .slide-to-scan__track {
          border: 1px solid rgba(255,255,255,.82);
          background: rgba(255,255,255,.42);
          backdrop-filter: blur(24px) saturate(145%);
          -webkit-backdrop-filter: blur(24px) saturate(145%);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.9), 0 18px 42px rgba(67,44,53,.12);
        }
        .skin-home__actions .slide-to-scan__thumb {
          color: #111;
          border: 1px solid rgba(255,255,255,.88);
          background: rgba(255,255,255,.5);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.9), 0 8px 20px rgba(67,44,53,.12);
        }
        .skin-home__actions .slide-to-scan__label {
          color: rgba(0,0,0,.68);
        }
        .skin-home__actions .slide-to-scan__fill {
          background: rgba(210,235,11,.2);
        }
        .skin-home__foundation-button {
          width: 100%;
          color: #171419;
          border-color: rgba(23,20,25,.52);
          background: rgba(255,255,255,.38);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.78), 0 12px 30px rgba(67,44,53,.08);
        }
        @media (orientation: portrait), (max-width: 920px) {
          .skin-home__content {
            display: block;
            position: relative;
          }
          .skin-home__visual {
            position: absolute;
            inset: 0;
          }
          .skin-home__panel {
            position: absolute;
            left: var(--space-md);
            right: var(--space-md);
            bottom: var(--space-md);
            z-index: 3;
            padding: clamp(20px, 4vw, 34px);
          }
          .skin-home__panel::before {
            content: '';
            position: absolute;
            z-index: -1;
            left: -12vw;
            right: -12vw;
            top: -48px;
            bottom: -18vh;
            background: radial-gradient(ellipse at 50% 42%, rgba(255,255,255,.9) 0%, rgba(255,255,255,.58) 46%, transparent 78%);
            filter: blur(18px);
          }
          .skin-home__title {
            font-size: clamp(42px, 8.8vw, 72px);
          }
          .skin-home__subtitle {
            margin-bottom: 28px;
          }
        }
      `}</style>
    </div>
  )
}

