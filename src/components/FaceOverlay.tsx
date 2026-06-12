import { motion } from 'framer-motion'
import type { FaceBox } from '../hooks/useFaceDetection'

interface FaceOverlayProps {
  scanning?: boolean
  showLandmarks?: boolean
  faceBox?: FaceBox | null
  detected?: boolean
  centered?: boolean
}

const FACE_DOTS = Array.from({ length: 17 }, (_, row) =>
  Array.from({ length: 13 }, (_, column) => ({
    x: 8 + column * 7,
    y: 4 + row * 5.8,
    delay: row * .025 + Math.abs(column - 6) * .012,
  }))
).flat().filter((point) => {
  const x = (point.x - 50) / 43
  const y = (point.y - 50) / 49
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
    <div className={`face-overlay ${detected ? 'face-overlay--detected' : ''} ${centered ? 'face-overlay--centered' : ''} ${scanning ? 'face-overlay--scanning' : ''}`}>
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
              scale: scanning ? [0.55, 1.2, 0.55] : 1,
              opacity: scanning ? [0.24, 1, 0.24] : centered ? 0.88 : 0.5,
            }}
            transition={{
              delay: scanning ? point.delay : i * .004,
              duration: scanning ? 1.8 : 0.32,
              repeat: scanning ? Infinity : 0,
              ease: 'easeInOut',
            }}
          />
        ))}
      </motion.div>

      <style>{`
        .face-overlay {
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
        }
        .face-overlay__frame {
          position: absolute;
          border-radius: 50% 50% 45% 45% / 55% 55% 45% 45%;
          perspective: 700px;
        }
        .face-overlay__landmark {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(255,255,255,.72);
          transform: translate(-50%, -50%);
          box-shadow: 0 0 9px rgba(255,255,255,.48);
          transition: background .35s ease, box-shadow .35s ease;
          z-index: 2;
        }
        .face-overlay--centered:not(.face-overlay--scanning) .face-overlay__landmark {
          background: #fff;
          box-shadow: 0 0 10px rgba(255,255,255,.72);
        }
        .face-overlay--scanning .face-overlay__landmark {
          background: #d2eb0b;
          box-shadow: 0 0 12px rgba(210,235,11,.78);
        }
      `}</style>
    </div>
  )
}
