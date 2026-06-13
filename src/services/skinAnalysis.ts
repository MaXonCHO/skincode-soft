import { skincareProducts } from '../data/skincareProducts'
import type { CareProduct, SkinAnalysisResult } from '../types'

const fallbackProducts = skincareProducts.filter((product) => (
  product.id === 'cleanser-basic-1' ||
  product.id === 'moisturizer-basic-1' ||
  product.id === 'spf-basic-2' ||
  product.id === 'active-basic-1'
))

export async function analyzeSkinImage(imageDataUrl: string): Promise<SkinAnalysisResult> {
  const response = await fetch('/api/skin-analysis', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image: imageDataUrl,
      products: skincareProducts,
    }),
  })

  if (!response.ok) {
    throw new Error(await response.text())
  }

  return normalizeAnalysis(await response.json())
}

export function getFallbackSkinAnalysis(): SkinAnalysisResult {
  return {
    score: 74,
    visibleInImage: [
      'Лицо видно достаточно хорошо для базовой визуальной оценки.',
      'Тон выглядит в целом ровным, с возможной лёгкой неоднородностью в отдельных зонах.',
      'Выраженные состояния кожи по текущему изображению надёжно оценить нельзя.',
    ],
    providedByUser: [
      'Пользователь не указал дополнительные жалобы или особенности кожи.',
    ],
    recommendations: [
      {
        title: 'Бережное очищение',
        text: 'Используйте мягкое очищающее средство утром или вечером, чтобы не усиливать ощущение сухости или стянутости.',
      },
      {
        title: 'Ежедневное увлажнение',
        text: 'Добавьте лёгкий увлажняющий крем, чтобы поддержать защитный барьер и визуальную гладкость кожи.',
      },
      {
        title: 'SPF каждый день',
        text: 'Регулярная защита SPF 30-50 поможет уменьшить риск неровного тона и потускнения кожи.',
      },
      {
        title: 'Мягкий актив',
        text: 'Ниацинамид можно рассмотреть как спокойный актив для визуального баланса тона и блеска.',
      },
    ],
    products: fallbackProducts,
    confidence: {
      level: 'Medium',
      explanation: 'Оценка снижена, если освещение, угол лица или разрешение снимка были неидеальными.',
    },
    summary: 'Кожа выглядит в целом сбалансированной, а самые сильные стороны — ровность и отсутствие резко выраженных визуальных проблем. Наибольший эффект дадут стабильный базовый уход, ежедневный SPF и мягкая работа с текстурой и тоном.',
  }
}

function normalizeAnalysis(value: unknown): SkinAnalysisResult {
  const record = isRecord(value) ? value : {}
  const products = normalizeProducts(record.products)

  return {
    score: clampScore(record.score),
    visibleInImage: normalizeStringList(record.visibleInImage),
    providedByUser: normalizeStringList(record.providedByUser),
    recommendations: normalizeRecommendations(record.recommendations),
    products: products.length ? products : fallbackProducts,
    confidence: normalizeConfidence(record.confidence),
    summary: typeof record.summary === 'string' && record.summary.trim()
      ? record.summary.trim()
      : getFallbackSkinAnalysis().summary,
  }
}

function normalizeProducts(value: unknown): CareProduct[] {
  if (!Array.isArray(value)) return []

  return value
    .map((item) => {
      if (!isRecord(item)) return null

      const matched = skincareProducts.find((product) => product.id === item.id)
      if (matched) {
        return {
          ...matched,
          reason: typeof item.reason === 'string' && item.reason.trim() ? item.reason.trim() : matched.reason,
        }
      }

      if (
        typeof item.brand === 'string' &&
        typeof item.name === 'string' &&
        typeof item.category === 'string' &&
        typeof item.tier === 'string'
      ) {
        return {
          id: typeof item.id === 'string' ? item.id : `${item.brand}-${item.name}`,
          category: normalizeCategory(item.category),
          tier: item.tier === 'Premium' ? 'Premium' : 'Basic',
          brand: item.brand.trim(),
          name: item.name.trim(),
          price: clampPrice(item.price),
          reason: typeof item.reason === 'string' ? item.reason.trim() : '',
        }
      }

      return null
    })
    .filter((product): product is CareProduct => Boolean(product))
    .slice(0, 8)
}

function normalizeRecommendations(value: unknown) {
  if (!Array.isArray(value)) return getFallbackSkinAnalysis().recommendations

  const recommendations = value
    .map((item) => {
      if (!isRecord(item)) return null
      if (typeof item.title !== 'string' || typeof item.text !== 'string') return null
      return { title: item.title.trim(), text: item.text.trim() }
    })
    .filter((item): item is { title: string; text: string } => Boolean(item?.title && item.text))

  return recommendations.length ? recommendations.slice(0, 6) : getFallbackSkinAnalysis().recommendations
}

function normalizeConfidence(value: unknown): SkinAnalysisResult['confidence'] {
  if (!isRecord(value)) return getFallbackSkinAnalysis().confidence

  const level = value.level === 'High' || value.level === 'Low' ? value.level : 'Medium'
  const explanation = typeof value.explanation === 'string' && value.explanation.trim()
    ? value.explanation.trim()
    : getFallbackSkinAnalysis().confidence.explanation

  return { level, explanation }
}

function normalizeStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return []

  return value
    .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    .map((item) => item.trim())
    .slice(0, 8)
}

function clampScore(value: unknown) {
  if (typeof value !== 'number' || Number.isNaN(value)) return getFallbackSkinAnalysis().score
  return Math.max(0, Math.min(100, Math.round(value)))
}

function clampPrice(value: unknown) {
  if (typeof value !== 'number' || Number.isNaN(value)) return 0
  return Math.max(0, Math.round(value))
}

function normalizeCategory(value: string): CareProduct['category'] {
  if (value === 'Cleanser' || value === 'Moisturizer' || value === 'SPF') return value
  return 'Active Treatment'
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

