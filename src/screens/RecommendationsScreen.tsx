import { useState } from 'react'
import { motion } from 'framer-motion'
import { Logo } from '../components/Logo'
import { PodiumCarousel } from '../components/PodiumCarousel'
import { SlideToScan } from '../components/SlideToScan'
import { useCameraStream } from '../hooks/useCameraStream'
import { formatPrice, formatProductTag, formatProfileValue } from '../utils/matching'
import type { ScoredProduct, SkinProfile } from '../types'
import productOne from '../../photo/product-1.png'
import productTwo from '../../photo/product-2.png'
import productThree from '../../photo/product-3.png'
import productFour from '../../photo/product-4.png'

const productImages = [productOne, productTwo, productThree, productFour]

interface RecommendationsScreenProps {
  profile: SkinProfile
  products: ScoredProduct[]
  onRestart: () => void
}

export function RecommendationsScreen({ profile, products, onRestart }: RecommendationsScreenProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const { videoRef, hasCamera } = useCameraStream(true)

  return (
    <div className="screen recommendations-screen beauty-gradient">
      <Logo />

      <div className="recommendations-screen__top">
        <motion.div
          className="recommendations-screen__header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="recommendations-screen__eyebrow">Персональная подборка завершена</span>
          <h2 className="recommendations-screen__title">
            Вот оттенки, которые<br />тебе подойдут
          </h2>
        </motion.div>

        <motion.div
          className="recommendations-screen__camera-card"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="recommendations-screen__camera">
            {hasCamera ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="recommendations-screen__video"
              />
            ) : (
              <div className="recommendations-screen__camera-fallback" />
            )}
          </div>
          <div className="recommendations-screen__profile">
            <div className="recommendations-screen__profile-item">
              <span className="recommendations-screen__profile-label">Подтон кожи</span>
              <strong>{formatProfileValue(profile.undertone)}</strong>
              <span>сбалансированный тон</span>
            </div>
            <div className="recommendations-screen__profile-item">
              <span className="recommendations-screen__profile-label">Тип кожи</span>
              <strong>{formatProfileValue(profile.skinType)}</strong>
              <span>персональный уход</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="recommendations-screen__carousel">
        <PodiumCarousel
          items={products}
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
          getItemLabel={(product) => `${product.brand} ${product.name}`}
          cardWidth={430}
          cardGap={36}
          renderCard={(product, isCenter) => (
            <div className={`product-card ${isCenter ? 'product-card--center' : ''}`}>
              <div className="product-card__main">
                <div className="product-card__identity">
                  <span className="product-card__brand">{product.brand}</span>
                  <h3 className="product-card__name">{product.name}</h3>
                  <span className="product-card__shade">{product.shade}</span>
                  <span className="product-card__price">{formatPrice(product.price)}</span>
                </div>
                <div className="product-card__jar-stage">
                  <span className="product-card__halo" style={{ background: product.imageColor }} />
                  <img
                    className="product-card__jar"
                    src={productImages[(Number(product.id) - 1) % productImages.length]}
                    alt={`${product.brand} ${product.name}`}
                    draggable={false}
                  />
                </div>
              </div>

              <div className="product-card__details">
                <div className="product-card__description">
                  <span>О тоне</span>
                  <p className="product-card__desc">{product.description}</p>
                  <div className="product-card__tags">
                    <span>{formatProductTag(product.coverage)}</span>
                    <span>{formatProductTag(product.finish)}</span>
                  </div>
                </div>
                <div
                  className="product-card__score"
                  role="img"
                  aria-label={`Совпадение тона ${product.matchScore} процентов`}
                >
                  <div
                    className="product-card__pie"
                    style={{ '--score': `${product.matchScore * 3.6}deg` } as React.CSSProperties}
                  >
                    <div><strong>{product.matchScore}%</strong><span>совпадение</span></div>
                  </div>
                  <span>Совпадение тона</span>
                </div>
              </div>
            </div>
          )}
        />
      </div>

      <motion.div
        className="recommendations-screen__restart"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <SlideToScan
          onComplete={onRestart}
          label="Проведите, чтобы начать заново →"
          completedLabel="Возвращаемся к началу..."
        />
      </motion.div>

      <style>{`
        .recommendations-screen {
          background:
            radial-gradient(circle at 8% 88%, rgba(114, 211, 157, 0.58), transparent 29%),
            radial-gradient(circle at 22% 12%, rgba(255, 123, 88, 0.52), transparent 31%),
            radial-gradient(circle at 55% 4%, rgba(255, 171, 79, 0.48), transparent 29%),
            radial-gradient(circle at 82% 18%, rgba(231, 123, 211, 0.5), transparent 34%),
            radial-gradient(circle at 88% 84%, rgba(151, 112, 230, 0.55), transparent 35%),
            #f8eef4;
        }
        .recommendations-screen::before {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(42px);
          pointer-events: none;
        }
        .recommendations-screen > .logo {
          display: none;
        }
        .recommendations-screen__top {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 1fr minmax(220px, 25vw);
          align-items: start;
          gap: clamp(30px, 5vw, 84px);
          padding: 20px var(--space-lg) 0;
        }
        .recommendations-screen__camera-card {
          width: 100%;
          max-width: 320px;
          justify-self: end;
          padding: 8px;
          border-radius: 25px;
          background: rgba(255, 255, 255, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.64);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.8), 0 18px 46px rgba(72, 45, 78, 0.16);
          backdrop-filter: blur(24px) saturate(145%);
          -webkit-backdrop-filter: blur(24px) saturate(145%);
        }
        .recommendations-screen__camera {
          position: relative;
          height: clamp(94px, 11vh, 124px);
          overflow: hidden;
          border-radius: 18px;
          background: linear-gradient(135deg, #d6a6bb, #8d79ae);
        }
        .recommendations-screen__video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scaleX(-1);
        }
        .recommendations-screen__camera-fallback {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(255,255,255,.4), transparent);
        }
        .recommendations-screen__header {
          align-self: center;
          text-align: left;
          padding-top: 10px;
        }
        .recommendations-screen__eyebrow {
          display: block;
          margin-bottom: 10px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .13em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, .78);
          text-shadow: 0 2px 18px rgba(66, 37, 72, .18);
        }
        .recommendations-screen__title {
          max-width: 760px;
          font-size: clamp(38px, 4.7vw, 76px);
          font-weight: 650;
          letter-spacing: -0.04em;
          line-height: .98;
          color: #fff;
          text-shadow: 0 4px 24px rgba(64, 35, 72, .2);
        }
        .recommendations-screen__profile {
          display: grid;
          grid-template-columns: 1fr;
          gap: 7px;
          padding-top: 7px;
        }
        .recommendations-screen__profile-item {
          display: flex;
          flex-direction: column;
          gap: 1px;
          padding: 8px 10px;
          min-width: 0;
          border-radius: 14px;
          background: rgba(255,255,255,.3);
          border: 1px solid rgba(255,255,255,.48);
        }
        .recommendations-screen__profile-label {
          font-size: 10px;
          color: rgba(20,20,20,.52);
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .recommendations-screen__profile-item strong {
          font-size: 13px;
          line-height: 1.15;
          overflow-wrap: anywhere;
        }
        .recommendations-screen__profile-item > span:last-child {
          font-size: 10px;
          color: rgba(20,20,20,.48);
          overflow-wrap: anywhere;
        }
        .recommendations-screen__carousel {
          flex: 1;
          display: flex;
          align-items: center;
          position: relative;
          z-index: 2;
          min-height: 0;
          padding: 34px var(--space-md) 0;
          overflow: visible;
          transform: translateY(20px);
        }
        .product-card {
          height: clamp(330px, 43vh, 410px);
          background: rgba(255,255,255,.34);
          backdrop-filter: blur(26px) saturate(140%);
          -webkit-backdrop-filter: blur(26px) saturate(140%);
          border-radius: 32px;
          padding: 24px;
          text-align: left;
          border: 1px solid rgba(255,255,255,.54);
          position: relative;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.86), 0 20px 50px rgba(62, 36, 72, .14);
        }
        .product-card--center {
          background: rgba(255,255,255,.44);
          border-color: rgba(255,255,255,.9);
          box-shadow: inset 0 1px 0 white, 0 26px 66px rgba(62, 36, 72, .2);
        }
        .product-card__main {
          display: grid;
          grid-template-columns: 48% 52%;
          height: 54%;
          position: relative;
        }
        .product-card__identity {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          position: relative;
          z-index: 3;
        }
        .product-card__brand {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: rgba(20,20,20,.5);
          margin-bottom: 7px;
        }
        .product-card__name {
          font-size: clamp(22px, 1.9vw, 30px);
          line-height: 1.04;
          font-weight: 650;
          letter-spacing: -.035em;
          margin-bottom: 8px;
        }
        .product-card__shade {
          font-size: 14px;
          color: rgba(20,20,20,.55);
        }
        .product-card__price {
          margin-top: 12px;
          font-size: 16px;
          font-weight: 650;
        }
        .product-card__jar-stage {
          position: relative;
        }
        .product-card__halo {
          position: absolute;
          width: 130px;
          height: 130px;
          border-radius: 50%;
          top: 28px;
          left: 50%;
          transform: translateX(-50%);
          filter: blur(24px);
          opacity: .76;
        }
        .product-card__jar {
          position: absolute;
          z-index: 2;
          width: 330px;
          height: 330px;
          object-fit: contain;
          left: 50%;
          top: -82px;
          transform: translateX(-50%) rotate(4deg);
          filter: drop-shadow(0 24px 18px rgba(42, 22, 48, .28));
          pointer-events: none;
        }
        .product-card--center .product-card__jar {
          width: 380px;
          height: 380px;
          top: -104px;
        }
        .product-card__details {
          position: relative;
          z-index: 4;
          height: 46%;
          display: grid;
          grid-template-columns: 1fr 118px;
          gap: 9px;
        }
        .product-card__description,
        .product-card__score {
          border-radius: 20px;
          background: rgba(255,255,255,.32);
          border: 1px solid rgba(255,255,255,.5);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.7);
        }
        .product-card__description {
          padding: 13px;
        }
        .product-card__description > span,
        .product-card__score > span {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: rgba(20,20,20,.48);
        }
        .product-card__desc {
          font-size: 13px;
          color: rgba(20,20,20,.68);
          line-height: 1.42;
          margin: 7px 0 10px;
        }
        .product-card__tags {
          display: flex;
          gap: 5px;
        }
        .product-card__tags span {
          font-size: 10px;
          padding: 4px 7px;
          border-radius: 20px;
          background: rgba(255,255,255,.36);
          color: rgba(20,20,20,.6);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .product-card__score {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 7px;
        }
        .product-card__pie {
          width: 76px;
          height: 76px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          position: relative;
          background: transparent;
          box-shadow: 0 9px 22px rgba(59,35,70,.16);
        }
        .product-card__pie::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 7px;
          background: conic-gradient(from 210deg, #ff7b58, #ee80c7, #9770e6, #72d39d var(--score), rgba(255,255,255,.38) 0);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
        }
        .product-card__pie > div {
          width: 59px;
          height: 59px;
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: transparent;
          position: relative;
          z-index: 1;
        }
        .product-card__pie strong {
          font-size: 17px;
          line-height: 1;
        }
        .product-card__pie span {
          margin-top: 2px;
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: .08em;
          color: rgba(20,20,20,.5);
        }
        .recommendations-screen__restart {
          position: absolute;
          z-index: 5;
          right: 18px;
          left: 50%;
          bottom: 14px;
          width: 420px;
          margin-left: -210px;
        }
        .recommendations-screen__restart .slide-to-scan {
          padding: 0;
          max-width: none;
        }
        .recommendations-screen .podium-carousel__dots {
          margin-top: 6px;
        }
        .recommendations-screen .podium-carousel__track {
          padding-top: 125px;
          margin-top: -105px;
        }
        @media (max-height: 720px) {
          .recommendations-screen__camera {
            height: 100px;
          }
          .recommendations-screen__profile {
            display: none;
          }
          .product-card {
            height: 335px;
          }
        }
      `}</style>
    </div>
  )
}
