import { useEffect, useRef, useState, type TouchEvent, type MouseEvent } from 'react'
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
  const [containerWidth, setContainerWidth] = useState(0)

  const totalWidth = cardWidth + cardGap

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const update = () => setContainerWidth(el.offsetWidth)
    update()

    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const centerOffset = containerWidth / 2 - cardWidth / 2 - selectedIndex * totalWidth

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
          animate={{ x: centerOffset }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          {items.map((item, index) => {
            const distance = Math.abs(index - selectedIndex)
            const isCenter = index === selectedIndex
            const scale = isCenter ? 1 : distance === 1 ? 0.88 : 0.76
            const opacity = isCenter ? 1 : distance === 1 ? 0.55 : 0.3
            const translateY = isCenter ? 0 : distance === 1 ? 8 : 16

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
          overflow: hidden;
          padding: 12px 0 4px;
        }
        .podium-carousel__inner {
          display: flex;
          align-items: flex-end;
          will-change: transform;
        }
        .podium-carousel__item {
          flex-shrink: 0;
          cursor: pointer;
          transform-origin: bottom center;
        }
        .podium-carousel__dots {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 12px;
        }
        .podium-carousel__dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: 1px solid var(--border-color, #000);
          background: transparent;
          cursor: pointer;
          padding: 0;
          transition: all 0.3s ease;
        }
        .podium-carousel__dot--active {
          background: #000;
          width: 24px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  )
}
