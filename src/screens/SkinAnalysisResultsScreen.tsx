import { motion } from 'framer-motion'
import { formatPrice } from '../utils/matching'
import type { CareProductCategory, SkinAnalysisResult } from '../types'

interface SkinAnalysisResultsScreenProps {
  result: SkinAnalysisResult
  onRestart: () => void
}

const categoryLabels: Record<CareProductCategory, string> = {
  Cleanser: 'Очищение',
  Moisturizer: 'Увлажнение',
  SPF: 'SPF',
  'Active Treatment': 'Активный уход',
}

const confidenceLabels = {
  High: 'Высокая',
  Medium: 'Средняя',
  Low: 'Низкая',
}

export function SkinAnalysisResultsScreen({ result, onRestart }: SkinAnalysisResultsScreenProps) {
  return (
    <div className="screen skin-results">
      <div className="skin-results__shell">
        <motion.header
          className="skin-results__header"
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: .7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <span className="skin-results__eyebrow">Анализ завершён</span>
            <h2 className="skin-results__title">Состояние кожи и персональный уход</h2>
          </div>
          <motion.button
            className="btn-primary skin-results__restart"
            onClick={onRestart}
            whileTap={{ scale: .97 }}
          >
            Начать заново
          </motion.button>
        </motion.header>

        <main className="skin-results__grid">
          <motion.section
            className="skin-results__score-panel"
            initial={{ opacity: 0, scale: .96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: .75, delay: .08, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="skin-results__score-ring"
              style={{ '--score': `${result.score * 3.6}deg` } as React.CSSProperties}
              aria-label={`Оценка состояния кожи ${result.score} из 100`}
            >
              <strong>{result.score}</strong>
              <span>из 100</span>
            </div>
            <div className="skin-results__score-copy">
              <span>Итоговая оценка</span>
              <p>{result.summary}</p>
            </div>
            <div className="skin-results__confidence">
              <span>Уверенность: {confidenceLabels[result.confidence.level]}</span>
              <p>{result.confidence.explanation}</p>
            </div>
          </motion.section>

          <motion.section
            className="skin-results__evidence"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .75, delay: .14, ease: [0.22, 1, 0.36, 1] }}
          >
            <EvidenceBlock title="Что видно на фото" items={result.visibleInImage} />
            <EvidenceBlock title="Что предоставил пользователь" items={result.providedByUser} />
          </motion.section>

          <motion.section
            className="skin-results__recommendations"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .75, delay: .2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="skin-results__section-head">
              <span>Рекомендации</span>
              <strong>Высокоэффективные шаги</strong>
            </div>
            <div className="skin-results__recommendation-list">
              {result.recommendations.map((recommendation, index) => (
                <article className="skin-results__recommendation" key={`${recommendation.title}-${index}`}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h3>{recommendation.title}</h3>
                    <p>{recommendation.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </motion.section>

          <motion.section
            className="skin-results__products"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .75, delay: .26, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="skin-results__section-head">
              <span>Уходовые средства</span>
              <strong>Подборка под рекомендации</strong>
            </div>
            <div className="skin-results__product-grid">
              {result.products.map((product) => (
                <article className="skin-product-card" key={product.id}>
                  <div className="skin-product-card__top">
                    <span>{categoryLabels[product.category]}</span>
                    <i>{product.tier === 'Premium' ? 'Premium' : 'Basic'}</i>
                  </div>
                  <strong className="skin-product-card__brand">{product.brand}</strong>
                  <h3>{product.name}</h3>
                  <p>{product.reason}</p>
                  <b>{formatPrice(product.price)}</b>
                </article>
              ))}
            </div>
          </motion.section>
        </main>
      </div>

      <style>{`
        .skin-results {
          background:
            radial-gradient(ellipse at 18% 0%, rgba(210,235,11,.22), transparent 34%),
            radial-gradient(ellipse at 100% 72%, rgba(249,168,212,.18), transparent 36%),
            #fff;
          color: #171419;
          overflow-y: auto;
        }
        .skin-results__shell {
          width: min(100%, 1440px);
          min-height: 100%;
          margin: 0 auto;
          padding: clamp(22px, 3.4vw, 48px);
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .skin-results__header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 24px;
        }
        .skin-results__eyebrow,
        .skin-results__section-head span {
          display: block;
          margin-bottom: 8px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .14em;
          text-transform: uppercase;
          color: rgba(23,20,25,.48);
        }
        .skin-results__title {
          max-width: 820px;
          font-size: clamp(34px, 4.1vw, 68px);
          line-height: 1;
          font-weight: 680;
          letter-spacing: -0.02em;
        }
        .skin-results__restart {
          flex: 0 0 auto;
          color: #171419;
          border-color: rgba(23,20,25,.72);
          background: rgba(255,255,255,.36);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.82), 0 14px 34px rgba(72,45,78,.1);
        }
        .skin-results__grid {
          flex: 1;
          min-height: 0;
          display: grid;
          grid-template-columns: minmax(280px, .86fr) minmax(420px, 1.28fr);
          grid-template-rows: auto 1fr;
          gap: 18px;
        }
        .skin-results__score-panel,
        .skin-results__evidence,
        .skin-results__recommendations,
        .skin-results__products {
          border-radius: 28px;
          background: rgba(255,255,255,.44);
          border: 1px solid rgba(255,255,255,.72);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.86), 0 18px 48px rgba(62,36,72,.12);
          backdrop-filter: blur(24px) saturate(145%);
          -webkit-backdrop-filter: blur(24px) saturate(145%);
        }
        .skin-results__score-panel {
          padding: clamp(20px, 2.3vw, 34px);
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 20px;
          align-items: center;
        }
        .skin-results__score-ring {
          width: clamp(138px, 14vw, 190px);
          aspect-ratio: 1;
          border-radius: 50%;
          display: grid;
          place-items: center;
          align-content: center;
          position: relative;
          background: rgba(255,255,255,.4);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.9), 0 20px 44px rgba(62,36,72,.12);
        }
        .skin-results__score-ring::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 11px;
          background: conic-gradient(from 210deg, #d2eb0b var(--score), rgba(23,20,25,.1) 0);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
        }
        .skin-results__score-ring strong {
          font-size: clamp(46px, 5vw, 72px);
          line-height: .9;
          position: relative;
          z-index: 1;
        }
        .skin-results__score-ring span {
          font-size: 13px;
          color: rgba(23,20,25,.48);
          position: relative;
          z-index: 1;
        }
        .skin-results__score-copy span,
        .skin-results__confidence span {
          display: block;
          margin-bottom: 8px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .12em;
          text-transform: uppercase;
          color: rgba(23,20,25,.48);
        }
        .skin-results__score-copy p,
        .skin-results__confidence p {
          font-size: clamp(15px, 1.2vw, 18px);
          line-height: 1.5;
          color: rgba(23,20,25,.68);
        }
        .skin-results__confidence {
          grid-column: 1 / -1;
          padding-top: 18px;
          border-top: 1px solid rgba(23,20,25,.08);
        }
        .skin-results__evidence {
          padding: clamp(18px, 2vw, 26px);
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        .skin-evidence {
          min-width: 0;
          padding: 16px;
          border-radius: 20px;
          background: rgba(255,255,255,.3);
          border: 1px solid rgba(255,255,255,.56);
        }
        .skin-evidence h3 {
          margin-bottom: 12px;
          font-size: 15px;
          letter-spacing: .01em;
        }
        .skin-evidence li {
          list-style: none;
          position: relative;
          padding-left: 16px;
          margin-bottom: 9px;
          font-size: 13px;
          line-height: 1.43;
          color: rgba(23,20,25,.68);
        }
        .skin-evidence li::before {
          content: '';
          position: absolute;
          left: 0;
          top: .62em;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #d2eb0b;
        }
        .skin-results__recommendations,
        .skin-results__products {
          padding: clamp(18px, 2vw, 28px);
        }
        .skin-results__products {
          grid-column: 1 / -1;
        }
        .skin-results__section-head {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 16px;
        }
        .skin-results__section-head strong {
          font-size: clamp(20px, 1.8vw, 28px);
          line-height: 1.1;
        }
        .skin-results__recommendation-list {
          display: grid;
          gap: 10px;
        }
        .skin-results__recommendation {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 13px;
          padding: 14px;
          border-radius: 18px;
          background: rgba(255,255,255,.32);
          border: 1px solid rgba(255,255,255,.54);
        }
        .skin-results__recommendation > span {
          font-size: 12px;
          font-weight: 700;
          color: #93a600;
        }
        .skin-results__recommendation h3 {
          font-size: 16px;
          margin-bottom: 5px;
        }
        .skin-results__recommendation p {
          font-size: 13px;
          line-height: 1.45;
          color: rgba(23,20,25,.68);
        }
        .skin-results__product-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
        }
        .skin-product-card {
          min-width: 0;
          min-height: 214px;
          padding: 16px;
          border-radius: 22px;
          background: rgba(255,255,255,.36);
          border: 1px solid rgba(255,255,255,.56);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.72);
          display: flex;
          flex-direction: column;
        }
        .skin-product-card__top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 14px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .1em;
          text-transform: uppercase;
          color: rgba(23,20,25,.48);
        }
        .skin-product-card__top i {
          font-style: normal;
          padding: 4px 7px;
          border-radius: 999px;
          background: rgba(210,235,11,.22);
          color: rgba(23,20,25,.66);
        }
        .skin-product-card__brand {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: .12em;
          color: rgba(23,20,25,.54);
          margin-bottom: 6px;
        }
        .skin-product-card h3 {
          font-size: clamp(17px, 1.4vw, 22px);
          line-height: 1.05;
          margin-bottom: 10px;
        }
        .skin-product-card p {
          font-size: 13px;
          line-height: 1.42;
          color: rgba(23,20,25,.66);
          margin-bottom: 14px;
        }
        .skin-product-card b {
          margin-top: auto;
          font-size: 17px;
        }
        @media (max-width: 1100px) {
          .skin-results__grid {
            grid-template-columns: 1fr;
          }
          .skin-results__products {
            grid-column: auto;
          }
          .skin-results__product-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (orientation: portrait), (max-width: 760px) {
          .skin-results__header {
            display: grid;
          }
          .skin-results__restart {
            width: 100%;
          }
          .skin-results__score-panel,
          .skin-results__evidence {
            grid-template-columns: 1fr;
          }
          .skin-results__product-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}

function EvidenceBlock({ title, items }: { title: string; items: string[] }) {
  const safeItems = items.length ? items : ['Нет дополнительных данных для отображения.']

  return (
    <section className="skin-evidence">
      <h3>{title}</h3>
      <ul>
        {safeItems.map((item, index) => (
          <li key={`${title}-${index}`}>{item}</li>
        ))}
      </ul>
    </section>
  )
}

