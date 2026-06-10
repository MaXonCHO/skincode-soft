import { useRef, useState, type TouchEvent, type MouseEvent } from 'react'
import { motion } from 'framer-motion'

interface PodiumCarouselProps<T> {
  items: T[]
  selectedIndex: number
  onSelect: (index: number) => void
  renderCard: (item: T, isCenter: boolean) => React.ReactNode
  cardWidth?: number
  cardGap?: number
}

export function PodiumCarousel<T>({
  items,
  selectedIndex,
  onSelect,
  renderCard,
  cardWidth = 220,
  cardGap = 24,
}: PodiumCarouselProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null)
  const dragStartX = useRef(0)
  const [isDragging, setIsDragging] = useState(false)

  const totalWidth = cardWidth + cardGap

  const handleDragEnd = (deltaX: number) => {
    const threshold = cardWidth * 0.25
    if (deltaX < -threshold && selectedIndex < items.length - 1) {
      onSelect(selectedIndex + 1)
    } else if (deltaX > threshold && selectedIndex > 0) {
      onSelect(selectedIndex - 1)
    }
  }

  const onTouchStart = (e: TouchEvent) => {
    dragStartX.current = e.touches[0].clientX
    setIsDragging(true)
  }

  const onTouchEnd = (e: TouchEvent) => {
    if (!isDragging) return
    const deltaX = e.changedTouches[0].clientX - dragStartX.current
    handleDragEnd(deltaX)
    setIsDragging(false)
  }

  const onMouseDown = (e: MouseEvent) => {
    dragStartX.current = e.clientX
    setIsDragging(true)
  }

  const onMouseUp = (e: MouseEvent) => {
    if (!isDragging) return
    const deltaX = e.clientX - dragStartX.current
    handleDragEnd(deltaX)
    setIsDragging(false)
  }

  const offset = -(selectedIndex * totalWidth)

  return (
    <div
      ref={containerRef}
      className="podium-carousel"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={() => setIsDragging(false)}
    >
      <div className="podium-carousel__track">
        <motion.div
          className="podium-carousel__inner"
          animate={{ x: offset }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {items.map((item, index) => {
            const distance = Math.abs(index - selectedIndex)
            const isCenter = index === selectedIndex
            const scale = isCenter ? 1 : distance === 1 ? 0.82 : 0.68
            const opacity = isCenter ? 1 : distance === 1 ? 0.7 : 0.4
            const translateY = isCenter ? 0 : distance === 1 ? 16 : 32

            return (
              <motion.div
                key={index}
                className="podium-carousel__item"
                style={{ width: cardWidth, marginRight: cardGap }}
                animate={{ scale, opacity, y: translateY }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                onClick={() => onSelect(index)}
              >
                {renderCard(item, isCenter)}
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      <div className="podium-carousel__dots">
        {items.map((_, index) => (
          <button
            key={index}
            className={`podium-carousel__dot ${index === selectedIndex ? 'podium-carousel__dot--active' : ''}`}
            onClick={() => onSelect(index)}
            aria-label={`Выбрать ${index + 1}`}
          />
        ))}
      </div>

      <style>{`
        .podium-carousel {
          width: 100%;
          overflow: hidden;
          touch-action: pan-y;
        }
        .podium-carousel__track {
          display: flex;
          justify-content: center;
          overflow: visible;
          padding: 20px 0 8px;
        }
        .podium-carousel__inner {
          display: flex;
          align-items: flex-end;
        }
        .podium-carousel__item {
          flex-shrink: 0;
          cursor: pointer;
          transform-origin: bottom center;
        }
        .podium-carousel__dots {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 16px;
        }
        .podium-carousel__dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          border: none;
          background: rgba(180, 160, 220, 0.3);
          cursor: pointer;
          padding: 0;
          transition: all 0.3s ease;
        }
        .podium-carousel__dot--active {
          background: linear-gradient(135deg, #b8a0e0, #e0a0c8);
          width: 28px;
          border-radius: 5px;
        }
      `}</style>
    </div>
  )
}
