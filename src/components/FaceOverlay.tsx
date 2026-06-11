import { motion } from 'framer-motion'
import type { FaceBox } from '../hooks/useFaceDetection'

interface FaceOverlayProps {
  scanning?: boolean
  showLandmarks?: boolean
  faceBox?: FaceBox | null
  detected?: boolean
  centered?: boolean
}

const FACE_DOTS = Array.from({ length: 10 }, (_, row) =>
  Array.from({ length: 9 }, (_, column) => ({
    x: 14 + column * 9,
    y: 8 + row * 9.4,
  }))
).flat().filter((point) => {
  const x = (point.x - 50) / 40
  const y = (point.y - 50) / 48
  return x * x + y * y <= 1
})

export function FaceOverlay({
  scanning = false,
  showLandmarks = true,
  faceBox,
  detected = false,
  centered = false,
}: FaceOverlayProps) {
  const frame = faceBox
    ? {
        left: `${faceBox.left}%`,
        top: `${faceBox.top}%`,
        width: `${faceBox.width}%`,
        height: `${faceBox.height}%`,
      }
    : { left: '22.5%', top: '14%', width: '55%', height: '72%' }

  return (
    <div className={`face-overlay ${detected ? 'face-overlay--detected' : ''} ${centered ? 'face-overlay--centered' : ''}`}>
      <motion.div
        className="face-overlay__frame"
        animate={{
          ...frame,
        }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        {detected && showLandmarks && FACE_DOTS.map((point, i) => (
          <motion.div
            key={i}
            className="face-overlay__landmark"
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: scanning ? [0.7, 1.2, 0.7] : 1,
              opacity: scanning ? [0.35, 1, 0.35] : centered ? 0.9 : 0.62,
            }}
            transition={{
              delay: i * 0.012,
              duration: scanning ? 1.4 : 0.32,
              repeat: scanning ? Infinity : 0,
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

      </motion.div>

      <style>{`
        .face-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .face-overlay__frame {
          position: absolute;
          border-radius: 50% 50% 45% 45% / 55% 55% 45% 45%;
        }
        .face-overlay__landmark {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255, 191, 126, .92);
          transform: translate(-50%, -50%);
          box-shadow: 0 0 9px rgba(255, 174, 112, .66);
          transition: background .35s ease, box-shadow .35s ease;
        }
        .face-overlay--centered .face-overlay__landmark {
          background: rgba(126, 236, 190, .96);
          box-shadow: 0 0 10px rgba(126, 236, 190, .72);
        }
        .face-overlay__scanline {
          position: absolute;
          left: 10%;
          right: 10%;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(184,160,224,0.8), rgba(224,160,200,0.8), transparent);
          box-shadow: 0 0 20px rgba(184, 160, 224, 0.6);
        }
      `}</style>
    </div>
  )
}
