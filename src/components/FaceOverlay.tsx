import { motion } from 'framer-motion'

interface FaceOverlayProps {
  scanning?: boolean
  showLandmarks?: boolean
}

const LANDMARKS = [
  { x: 50, y: 38 }, { x: 38, y: 40 }, { x: 62, y: 40 },
  { x: 35, y: 48 }, { x: 65, y: 48 }, { x: 50, y: 52 },
  { x: 42, y: 58 }, { x: 58, y: 58 }, { x: 50, y: 62 },
  { x: 44, y: 68 }, { x: 56, y: 68 }, { x: 50, y: 74 },
  { x: 30, y: 55 }, { x: 70, y: 55 }, { x: 25, y: 62 },
  { x: 75, y: 62 },
]

export function FaceOverlay({ scanning = false, showLandmarks = true }: FaceOverlayProps) {
  return (
    <div className="face-overlay">
      <motion.div
        className="face-overlay__frame"
        animate={scanning ? { boxShadow: [
          '0 0 0 2px rgba(184,160,224,0.6), 0 0 40px rgba(184,160,224,0.3)',
          '0 0 0 2px rgba(224,160,200,0.8), 0 0 60px rgba(224,160,200,0.5)',
          '0 0 0 2px rgba(160,200,232,0.6), 0 0 40px rgba(160,200,232,0.3)',
        ] } : {}}
        transition={{ duration: 2, repeat: scanning ? Infinity : 0 }}
      >
        <div className="face-overlay__corner face-overlay__corner--tl" />
        <div className="face-overlay__corner face-overlay__corner--tr" />
        <div className="face-overlay__corner face-overlay__corner--bl" />
        <div className="face-overlay__corner face-overlay__corner--br" />

        {showLandmarks && LANDMARKS.map((point, i) => (
          <motion.div
            key={i}
            className="face-overlay__landmark"
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: scanning ? [0.4, 1, 0.4] : 0.6 }}
            transition={{
              delay: i * 0.05,
              opacity: scanning ? { duration: 1.5, repeat: Infinity, delay: i * 0.1 } : {},
            }}
          />
        ))}

        {scanning && (
          <motion.div
            className="face-overlay__scanline"
            animate={{ top: ['15%', '85%', '15%'] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        <svg className="face-overlay__lines" viewBox="0 0 200 200" preserveAspectRatio="none">
          <motion.path
            d="M50,80 Q100,60 150,80"
            fill="none"
            stroke="rgba(184,160,224,0.5)"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: scanning ? 1 : 0.6 }}
            transition={{ duration: 1.5 }}
          />
          <motion.path
            d="M70,120 Q100,140 130,120"
            fill="none"
            stroke="rgba(224,160,200,0.5)"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: scanning ? 1 : 0.6 }}
            transition={{ duration: 1.5, delay: 0.3 }}
          />
          <line x1="100" y1="70" x2="100" y2="150" stroke="rgba(160,200,232,0.3)" strokeWidth="0.5" strokeDasharray="4,4" />
        </svg>
      </motion.div>

      <style>{`
        .face-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }
        .face-overlay__frame {
          position: relative;
          width: 55%;
          height: 72%;
          border-radius: 50% 50% 45% 45% / 55% 55% 45% 45%;
        }
        .face-overlay__corner {
          position: absolute;
          width: 32px;
          height: 32px;
          border-color: rgba(184, 160, 224, 0.8);
          border-style: solid;
        }
        .face-overlay__corner--tl { top: -4px; left: 20%; border-width: 3px 0 0 3px; border-radius: 8px 0 0 0; }
        .face-overlay__corner--tr { top: -4px; right: 20%; border-width: 3px 3px 0 0; border-radius: 0 8px 0 0; }
        .face-overlay__corner--bl { bottom: 5%; left: 22%; border-width: 0 0 3px 3px; border-radius: 0 0 0 8px; }
        .face-overlay__corner--br { bottom: 5%; right: 22%; border-width: 0 3px 3px 0; border-radius: 0 0 8px 0; }
        .face-overlay__landmark {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(184, 160, 224, 0.9);
          transform: translate(-50%, -50%);
          box-shadow: 0 0 8px rgba(184, 160, 224, 0.6);
        }
        .face-overlay__scanline {
          position: absolute;
          left: 10%;
          right: 10%;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(184,160,224,0.8), rgba(224,160,200,0.8), transparent);
          box-shadow: 0 0 20px rgba(184, 160, 224, 0.6);
        }
        .face-overlay__lines {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  )
}
