import { motion } from 'framer-motion'
import { Logo } from '../components/Logo'

interface HomeScreenProps {
  onStart: () => void
}

export function HomeScreen({ onStart }: HomeScreenProps) {
  return (
    <div className="screen home-screen beauty-gradient">
      <Logo />

      <div className="home-screen__content">
        <motion.div
          className="home-screen__visual"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="home-screen__image-wrapper">
            <img
              src="https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fe5?w=800&q=80&auto=format&fit=crop&crop=face"
              alt="Чистая кожа"
              className="home-screen__image"
            />
            <div className="home-screen__image-glow" />
          </div>
          <motion.div
            className="home-screen__ai-badge glass"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <span className="home-screen__ai-dot" />
            AI Powered
          </motion.div>
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
          <motion.button
            className="glow-button home-screen__cta"
            onClick={onStart}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            НАЧАТЬ ПОДБОР
          </motion.button>
        </motion.div>
      </div>

      <style>{`
        .home-screen__content {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-xl);
          padding: var(--space-lg) var(--space-xl);
        }
        .home-screen__visual {
          position: relative;
          flex-shrink: 0;
        }
        .home-screen__image-wrapper {
          position: relative;
          width: clamp(280px, 28vw, 480px);
          height: clamp(340px, 34vw, 580px);
          border-radius: 240px 240px 200px 200px / 280px 280px 200px 200px;
          overflow: hidden;
        }
        .home-screen__image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
        }
        .home-screen__image-glow {
          position: absolute;
          inset: -20px;
          border-radius: inherit;
          background: linear-gradient(135deg, rgba(184,160,224,0.2), rgba(224,160,200,0.15));
          z-index: -1;
          filter: blur(30px);
        }
        .home-screen__ai-badge {
          position: absolute;
          bottom: 40px;
          right: -20px;
          padding: 12px 24px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-secondary);
        }
        .home-screen__ai-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: linear-gradient(135deg, #b8a0e0, #e0a0c8);
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.2); }
        }
        .home-screen__text {
          max-width: clamp(320px, 40vw, 560px);
        }
        .home-screen__title {
          font-size: var(--font-xl);
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: 0.04em;
          margin-bottom: 28px;
          background: linear-gradient(135deg, #1a1a2e 0%, #4a4a6a 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .home-screen__subtitle {
          font-size: var(--font-md);
          line-height: 1.6;
          color: var(--text-secondary);
          margin-bottom: 48px;
          font-weight: 400;
        }
        .home-screen__cta {
          font-size: clamp(16px, 1.5vw, 20px);
        }

        @media (max-width: 900px), (max-height: 600px) {
          .home-screen__content {
            flex-direction: column;
            gap: var(--space-md);
            padding: calc(var(--space-lg) + 40px) var(--space-md) var(--space-md);
          }
        }
      `}</style>
    </div>
  )
}
