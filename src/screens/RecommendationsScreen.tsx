import { useState } from 'react'
import { motion } from 'framer-motion'
import { Logo } from '../components/Logo'
import { PodiumCarousel } from '../components/PodiumCarousel'
import { formatPrice } from '../utils/matching'
import type { ScoredProduct, SkinProfile } from '../types'

interface RecommendationsScreenProps {
  profile: SkinProfile
  products: ScoredProduct[]
  onRestart: () => void
}

export function RecommendationsScreen({ profile, products, onRestart }: RecommendationsScreenProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  return (
    <div className="screen recommendations-screen beauty-gradient">
      <Logo />

      <motion.div
        className="recommendations-screen__header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="recommendations-screen__title">
          Вот оттенки, которые точно тебе подойдут
        </h2>

        <div className="recommendations-screen__profile glass">
          <div className="recommendations-screen__profile-item">
            <span className="recommendations-screen__profile-label">Подтон</span>
            <span className="recommendations-screen__profile-value">{profile.undertone}</span>
          </div>
          <div className="recommendations-screen__profile-divider" />
          <div className="recommendations-screen__profile-item">
            <span className="recommendations-screen__profile-label">Тип кожи</span>
            <span className="recommendations-screen__profile-value">{profile.skinType}</span>
          </div>
        </div>
      </motion.div>

      <div className="recommendations-screen__carousel">
        <PodiumCarousel
          items={products}
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
          cardWidth={300}
          cardGap={32}
          renderCard={(product, isCenter) => (
            <div className={`product-card ${isCenter ? 'product-card--center' : ''}`}>
              <div className="product-card__match">
                {product.matchScore}% Match
              </div>
              <div
                className="product-card__image"
                style={{ background: `linear-gradient(135deg, ${product.imageColor}, white)` }}
              >
                <div className="product-card__bottle" />
              </div>
              <div className="product-card__brand">{product.brand}</div>
              <div className="product-card__name">{product.name}</div>
              <div className="product-card__shade">{product.shade}</div>
              {isCenter && (
                <>
                  <div className="product-card__price">{formatPrice(product.price)}</div>
                  <p className="product-card__desc">{product.description}</p>
                  <div className="product-card__tags">
                    <span>{product.coverage}</span>
                    <span>{product.finish}</span>
                  </div>
                </>
              )}
            </div>
          )}
        />
      </div>

      <motion.button
        className="recommendations-screen__restart"
        onClick={onRestart}
        whileTap={{ scale: 0.97 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Начать заново
      </motion.button>

      <style>{`
        .recommendations-screen__header {
          text-align: center;
          padding: calc(var(--space-lg) + 40px) var(--space-lg) var(--space-sm);
        }
        .recommendations-screen__title {
          font-size: var(--font-lg);
          font-weight: 700;
          letter-spacing: 0.02em;
          margin-bottom: 28px;
          line-height: 1.2;
        }
        .recommendations-screen__profile {
          display: inline-flex;
          align-items: center;
          gap: 32px;
          padding: 16px 40px;
        }
        .recommendations-screen__profile-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .recommendations-screen__profile-label {
          font-size: 14px;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .recommendations-screen__profile-value {
          font-size: 22px;
          font-weight: 600;
        }
        .recommendations-screen__profile-divider {
          width: 1px;
          height: 40px;
          background: rgba(184, 160, 224, 0.3);
        }
        .recommendations-screen__carousel {
          flex: 1;
          display: flex;
          align-items: center;
          padding: 0 var(--space-md);
        }
        .product-card {
          background: rgba(255,255,255,0.75);
          border-radius: 28px;
          padding: 28px 24px;
          text-align: center;
          border: 1px solid rgba(255,255,255,0.9);
          position: relative;
        }
        .product-card--center {
          background: rgba(255,255,255,0.95);
          box-shadow: 0 20px 60px rgba(180, 160, 220, 0.2);
          padding: 32px 28px;
        }
        .product-card__match {
          position: absolute;
          top: 16px;
          right: 16px;
          background: linear-gradient(135deg, #b8a0e0, #e0a0c8);
          color: white;
          font-size: 14px;
          font-weight: 700;
          padding: 6px 14px;
          border-radius: 20px;
        }
        .product-card__image {
          width: 120px;
          height: 160px;
          border-radius: 16px;
          margin: 0 auto 20px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding-bottom: 16px;
        }
        .product-card--center .product-card__image {
          width: 140px;
          height: 180px;
        }
        .product-card__bottle {
          width: 48px;
          height: 100px;
          background: rgba(255,255,255,0.6);
          border-radius: 8px 8px 4px 4px;
          box-shadow: inset 0 -20px 30px rgba(0,0,0,0.05);
        }
        .product-card__brand {
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--text-secondary);
          margin-bottom: 4px;
        }
        .product-card__name {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 4px;
        }
        .product-card__shade {
          font-size: 15px;
          color: var(--text-secondary);
          margin-bottom: 12px;
        }
        .product-card__price {
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 12px;
          background: linear-gradient(135deg, #b8a0e0, #e0a0c8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .product-card__desc {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 16px;
        }
        .product-card__tags {
          display: flex;
          justify-content: center;
          gap: 10px;
        }
        .product-card__tags span {
          font-size: 12px;
          padding: 6px 14px;
          border-radius: 20px;
          background: rgba(184, 160, 224, 0.15);
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .recommendations-screen__restart {
          display: block;
          margin: 16px auto 40px;
          background: none;
          border: 2px solid rgba(184, 160, 224, 0.4);
          border-radius: 40px;
          padding: 16px 48px;
          font-family: inherit;
          font-size: 16px;
          font-weight: 500;
          color: var(--text-secondary);
          cursor: pointer;
          letter-spacing: 0.04em;
          transition: all 0.2s ease;
        }
        .recommendations-screen__restart:hover {
          border-color: #b8a0e0;
          color: var(--text-primary);
        }
      `}</style>
    </div>
  )
}
