import { motion } from 'framer-motion'
import type { FaceBox } from '../hooks/useFaceDetection'

const STEPS = [
  { key: 'tone', label: 'Тон кожи', value: 'Равномерный', side: 'left', x: .2, y: .25 },
  { key: 'undertone', label: 'Подтон', value: 'Нейтральный', side: 'right', x: .8, y: .32 },
  { key: 'texture', label: 'Текстура', value: 'Гладкая', side: 'left', x: .18, y: .68 },
  { key: 'type', label: 'Тип кожи', value: 'Комбинированная', side: 'right', x: .82, y: .72 },
] as const

interface AnalysisProgressProps {
  currentStep: number
  faceBox: FaceBox | null
}

export function AnalysisProgress({ currentStep, faceBox }: AnalysisProgressProps) {
  if (!faceBox) return null

  return (
    <div className="analysis-progress" role="status" aria-live="polite">
      {STEPS.map((step, index) => {
        if (index > currentStep) return null

        const left = clamp(faceBox.left + faceBox.width * step.x, 18, 82)
        const top = clamp(faceBox.top + faceBox.height * step.y, 20, 78)

        return (
          <motion.div
            key={step.key}
            className="analysis-callout-point"
            initial={{ left: `${left}%`, top: `${top}%`, opacity: 0 }}
            animate={{ left: `${left}%`, top: `${top}%`, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              left: { type: 'spring', stiffness: 90, damping: 20, mass: .9 },
              top: { type: 'spring', stiffness: 90, damping: 20, mass: .9 },
              opacity: { duration: .2 },
            }}
          >
            <motion.span
              className={`analysis-callout__line analysis-callout__line--${step.side}`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: .38, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.div
              className={`analysis-callout analysis-callout--${step.side}`}
              initial={{ opacity: 0, scale: .2 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: .22, type: 'spring', stiffness: 180, damping: 22 }}
            >
              <span className="analysis-callout__index">0{index + 1}</span>
              <span className="analysis-callout__copy">
                <small>{step.label}</small>
                <strong>{step.value}</strong>
              </span>
            </motion.div>
            <motion.span
              className="analysis-callout__anchor"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.5, 1] }}
              transition={{ duration: .42 }}
            />
          </motion.div>
        )
      })}

      <style>{`
        .analysis-progress {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .analysis-callout-point {
          position: absolute;
          z-index: 4;
          width: 0;
          height: 0;
        }
        .analysis-callout {
          position: absolute;
          top: 0;
          min-width: 150px;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 10px 13px;
          border: 1px solid rgba(255,255,255,.54);
          border-radius: 15px;
          background: rgba(255,255,255,.26);
          color: #fff;
          backdrop-filter: blur(20px) saturate(150%);
          box-shadow: 0 12px 30px rgba(0,0,0,.14), inset 0 1px 0 rgba(255,255,255,.58);
        }
        .analysis-callout--left {
          right: 44px;
          translate: 0 -50%;
          transform-origin: right center;
        }
        .analysis-callout--right {
          left: 44px;
          translate: 0 -50%;
          transform-origin: left center;
        }
        .analysis-callout__line {
          position: absolute;
          top: 0;
          width: 44px;
          height: 1px;
          background: linear-gradient(90deg, rgba(255,255,255,.22), rgba(255,255,255,.92));
        }
        .analysis-callout__line--left {
          right: 0;
          transform-origin: right center;
        }
        .analysis-callout__line--right {
          left: 0;
          transform-origin: left center;
        }
        .analysis-callout__anchor {
          position: absolute;
          left: 0;
          top: 0;
          width: 7px;
          height: 7px;
          border: 1px solid rgba(255,255,255,.95);
          border-radius: 50%;
          background: transparent;
          box-shadow: 0 0 9px rgba(255,255,255,.66);
          margin: -3.5px 0 0 -3.5px;
        }
        .analysis-callout__index {
          font-size: 10px;
          font-weight: 700;
          color: rgba(255,255,255,.92);
          letter-spacing: .08em;
        }
        .analysis-callout__copy {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .analysis-callout__copy small {
          font-size: 9px;
          color: rgba(255,255,255,.68);
          letter-spacing: .1em;
          text-transform: uppercase;
        }
        .analysis-callout__copy strong {
          font-size: 13px;
          font-weight: 600;
        }
      `}</style>
    </div>
  )
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}
