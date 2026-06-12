import { motion } from 'framer-motion'
import { SlideToScan } from '../components/SlideToScan'
import heroPhoto from '../../photo/new-hero-photo.png'

interface HomeScreenProps {
  onStart: () => void
}

export function HomeScreen({ onStart }: HomeScreenProps) {
  return (
    <div className="screen home-screen">
      <div className="home-screen__content">
        <motion.div
          className="home-screen__visual"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="home-screen__image-wrapper">
            <img
              src={heroPhoto}
              alt="Чистая кожа"
              className="home-screen__image"
            />
          </div>
        </motion.div>

        <motion.div
          className="home-screen__text"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <h1 className="home-screen__title">
            НАЙДИ СВОЙ<br />ИДЕАЛЬНЫЙ ТОН
          </h1>
          <p className="home-screen__subtitle">
            Расскажи немного о своей коже, а мы подберём оттенки,
            которые подойдут именно тебе.
          </p>
          <motion.div
            className="home-screen__cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <SlideToScan
              onComplete={onStart}
              label="Проведите, чтобы начать подбор →"
              completedLabel="Начинаем подбор..."
            />
          </motion.div>
        </motion.div>
      </div>
      <div className="home-screen__pastel-highlight" />

      <style>{`
        .home-screen__content {
          flex: 1;
          display: grid;
          grid-template-columns: minmax(0, 52%) minmax(0, 48%);
          background: #fff;
        }
        .home-screen__visual {
          position: relative;
          min-width: 0;
          height: 100%;
          background: #f6f1f3;
        }
        .home-screen__image-wrapper {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }
        .home-screen__image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center bottom;
          transform: scale(1.04);
          transform-origin: center bottom;
        }
        .home-screen__text {
          align-self: center;
          max-width: 760px;
          padding: clamp(48px, 7vw, 120px);
          text-align: left;
          color: #000;
        }
        .home-screen__title {
          font-size: clamp(52px, 5.4vw, 88px);
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: 0.04em;
          margin-bottom: 28px;
          color: #000;
        }
        .home-screen__subtitle {
          max-width: 650px;
          font-size: clamp(20px, 1.9vw, 30px);
          line-height: 1.6;
          color: rgba(0,0,0,.62);
          margin-bottom: 48px;
          font-weight: 400;
        }
        .home-screen__cta {
          width: min(100%, 520px);
        }
        .home-screen__cta .slide-to-scan {
          max-width: none;
          padding: 0;
        }
        .home-screen__cta .slide-to-scan__track {
          border-color: #000;
          background: transparent;
          box-shadow: none;
        }
        .home-screen__cta .slide-to-scan__thumb {
          color: #000;
          border-color: #000;
          box-shadow: none;
        }
        .home-screen__cta .slide-to-scan__label {
          color: rgba(0,0,0,.66);
        }
        .home-screen__cta .slide-to-scan__fill {
          background: rgba(0,0,0,.08);
        }
        .home-screen__pastel-highlight {
          position: absolute;
          z-index: 2;
          left: 8%;
          right: 8%;
          bottom: -62px;
          height: 118px;
          border-radius: 50%;
          background:
            radial-gradient(circle at 10% 50%, rgba(114,211,157,.34), transparent 28%),
            radial-gradient(circle at 32% 42%, rgba(255,123,88,.34), transparent 31%),
            radial-gradient(circle at 52% 55%, rgba(255,171,79,.3), transparent 30%),
            radial-gradient(circle at 72% 42%, rgba(231,123,211,.32), transparent 32%),
            radial-gradient(circle at 92% 50%, rgba(151,112,230,.34), transparent 30%);
          filter: blur(24px);
          opacity: .68;
          pointer-events: none;
        }

        @media (orientation: portrait), (max-width: 900px) {
          .home-screen__content {
            display: block;
            position: relative;
            background: #000;
          }
          .home-screen__visual {
            position: absolute;
            inset: 0;
            background: #f6f1f3;
          }
          .home-screen__image-wrapper::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(180deg, transparent 32%, rgba(0,0,0,.46) 100%);
            pointer-events: none;
          }
          .home-screen__image {
            object-fit: cover;
            object-position: center top;
            transform: none;
          }
          .home-screen__text {
            position: absolute;
            left: var(--space-md);
            right: var(--space-md);
            bottom: var(--space-md);
            z-index: 3;
            max-width: none;
            padding: clamp(8px, 2vw, 16px);
            border: 0;
            border-radius: 0;
            background: transparent;
            color: #fff;
            backdrop-filter: none;
          }
          .home-screen__title {
            color: #fff;
            font-size: clamp(42px, 9vw, 72px);
            text-shadow: 0 3px 18px rgba(0,0,0,.42);
          }
          .home-screen__subtitle {
            color: rgba(255,255,255,.78);
            margin-bottom: 28px;
            text-shadow: 0 2px 12px rgba(0,0,0,.5);
          }
          .home-screen__cta .slide-to-scan__track,
          .home-screen__cta .slide-to-scan__thumb {
            border-color: #fff;
            color: #fff;
          }
          .home-screen__cta .slide-to-scan__label {
            color: rgba(255,255,255,.8);
          }
          .home-screen__cta .slide-to-scan__fill {
            background: rgba(255,255,255,.12);
          }
          .home-screen__pastel-highlight {
            left: -12%;
            right: -12%;
            bottom: -48px;
            height: 100px;
            opacity: .58;
          }
        }
      `}</style>
    </div>
  )
}
