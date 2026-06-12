import { motion } from 'framer-motion'
import { Logo } from '../components/Logo'
import { SlideToScan } from '../components/SlideToScan'
import heroPhoto from '../../photo/new-hero-photo.png'

interface HomeScreenProps {
  onStart: () => void
}

export function HomeScreen({ onStart }: HomeScreenProps) {
  return (
    <div className="screen home-screen">
      <Logo />

      <div className="home-screen__content">
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
              label="Начать подбор"
              completedLabel="Начинаем подбор..."
            />
          </motion.div>
        </motion.div>

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
      </div>

      <style>{`
        .home-screen__content {
          flex: 1;
          display: grid;
          grid-template-columns: minmax(0, 48%) minmax(0, 52%);
          background: #fff;
        }
        .home-screen > .logo {
          top: clamp(12px, 1.5vw, 22px);
          left: auto;
          right: clamp(18px, 2.6vw, 42px);
          width: clamp(180px, 18vw, 280px);
        }
        .home-screen__visual {
          position: relative;
          min-width: 0;
          height: 100%;
          background: transparent;
        }
        .home-screen__image-wrapper {
          position: absolute;
          inset: 0 -4% 0 0;
          overflow: hidden;
        }
        .home-screen__image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: right bottom;
          transform: scale(1.06);
          transform-origin: right bottom;
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
          border: 1px solid rgba(255,255,255,.76);
          background: rgba(255,255,255,.34);
          backdrop-filter: blur(24px) saturate(145%);
          -webkit-backdrop-filter: blur(24px) saturate(145%);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.86), 0 16px 38px rgba(38,28,48,.12);
        }
        .home-screen__cta .slide-to-scan__thumb {
          color: #000;
          border: 1px solid rgba(255,255,255,.86);
          background: rgba(255,255,255,.36);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.84), 0 8px 20px rgba(38,28,48,.12);
        }
        .home-screen__cta .slide-to-scan__label {
          color: rgba(0,0,0,.66);
        }
        .home-screen__cta .slide-to-scan__fill {
          background: rgba(210,235,11,.18);
        }
        @media (orientation: portrait), (max-width: 900px) {
          .home-screen__content {
            display: block;
            position: relative;
            background: #fff;
          }
          .home-screen__visual {
            position: absolute;
            inset: 0;
            background: transparent;
          }
          .home-screen__image-wrapper {
            inset: 0 -16% 0 0;
          }
          .home-screen__image {
            object-fit: contain;
            object-position: center bottom;
            transform: none;
          }
          .home-screen__text {
            position: absolute;
            left: var(--space-md);
            right: var(--space-md);
            bottom: var(--space-md);
            z-index: 3;
            max-width: none;
            padding: clamp(20px, 4vw, 32px);
            border: 0;
            border-radius: 0;
            background: transparent;
            color: #000;
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
            box-shadow: none;
          }
          .home-screen__text::before {
            content: '';
            position: absolute;
            z-index: -1;
            left: -12vw;
            right: -12vw;
            top: -40px;
            bottom: -18vh;
            background: radial-gradient(ellipse at 50% 40%, rgba(255,255,255,.86) 0%, rgba(255,255,255,.5) 45%, transparent 76%);
            filter: blur(18px);
            pointer-events: none;
          }
          .home-screen__title {
            color: #000;
            font-size: clamp(42px, 9vw, 72px);
            text-shadow: none;
          }
          .home-screen__subtitle {
            color: rgba(0,0,0,.64);
            margin-bottom: 28px;
            text-shadow: none;
          }
          .home-screen__cta .slide-to-scan__track,
          .home-screen__cta .slide-to-scan__thumb {
            border-color: rgba(255,255,255,.8);
            color: #000;
          }
          .home-screen__cta .slide-to-scan__label {
            color: rgba(0,0,0,.7);
          }
          .home-screen__cta .slide-to-scan__fill {
            background: rgba(255,255,255,.22);
          }
        }
      `}</style>
    </div>
  )
}
