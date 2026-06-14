import { catalogProducts } from '../data/catalog'
import type {
  CatalogMatch,
  CatalogShade,
  Coverage,
  Finish,
  ScoredProduct,
  SkinProfile,
  SkinType,
  Undertone,
} from '../types'

const targetUndertones: Record<Undertone, { a: number; b: number }> = {
  Warm: { a: 10, b: 25 },
  Cool: { a: 15, b: 8 },
  Neutral: { a: 8, b: 16 },
  Olive: { a: 5, b: 24 },
}

const validUndertones: Undertone[] = ['Warm', 'Cool', 'Neutral', 'Olive']
const validSkinTypes: SkinType[] = ['Dry', 'Normal', 'Oily', 'Combination']

export function getCatalogMatches(profile: SkinProfile): CatalogMatch[] {
  return catalogProducts
    .filter((product) => product.price > 0 && product.shades.length > 0)
    .map((product) => {
      const shade = getBestShade(product.shades, profile.undertone)
      const undertoneScore = getShadeScore(shade, profile.undertone)
      const skinTypeScore = getSkinTypeScore(product.skinType, profile.skinType)
      const finishScore = getFinishScore(product.finish, profile.skinType)
      const matchScore = Math.round(undertoneScore * .66 + skinTypeScore * .24 + finishScore * .1)

      return { ...product, shade, matchScore }
    })
    .filter((product) => product.matchScore >= 68)
    .sort((a, b) => b.matchScore - a.matchScore || a.price - b.price)
}

export function getPriceBandRecommendations(profile: SkinProfile): ScoredProduct[] {
  const matches = getCatalogMatches(profile)
  const bands = [
    [0, 1500],
    [1500, 5000],
    [5000, Number.POSITIVE_INFINITY],
  ]

  const selected = bands
    .map(([min, max]) => matches.find((product) => product.price >= min && product.price < max))
    .filter((product): product is CatalogMatch => Boolean(product))

  for (const product of matches) {
    if (selected.length >= 3) break
    if (!selected.some((item) => item.id === product.id)) selected.push(product)
  }

  return selected.slice(0, 3).map(toScoredProduct)
}

export function getCatalogUrl(profile: SkinProfile): string {
  const url = new URL(window.location.href)
  url.search = ''
  url.searchParams.set('catalog', '1')
  url.searchParams.set('undertone', profile.undertone)
  url.searchParams.set('skinType', profile.skinType)
  return url.toString()
}

export function getCatalogProfile(): SkinProfile | null {
  const params = new URLSearchParams(window.location.search)
  if (params.get('catalog') !== '1') return null

  const undertone = params.get('undertone')
  const skinType = params.get('skinType')
  if (!isUndertone(undertone) || !isSkinType(skinType)) return null

  return { undertone, skinType }
}

function getBestShade(shades: CatalogShade[], undertone: Undertone): CatalogShade {
  return shades.reduce((best, shade) =>
    getShadeScore(shade, undertone) > getShadeScore(best, undertone) ? shade : best
  )
}

function getShadeScore(shade: CatalogShade, undertone: Undertone): number {
  const target = targetUndertones[undertone]
  const distance = Math.hypot(shade.lab.a - target.a, shade.lab.b - target.b)
  return Math.max(45, Math.min(99, 99 - distance * 2.2))
}

function getSkinTypeScore(label: string, skinType: SkinType): number {
  const normalized = label.toLowerCase()
  if (normalized.includes('всех типов')) return 92

  const markers: Record<SkinType, string[]> = {
    Dry: ['сух'],
    Normal: ['норм'],
    Oily: ['жир'],
    Combination: ['комбинирован'],
  }

  return markers[skinType].some((marker) => normalized.includes(marker)) ? 99 : 62
}

function getFinishScore(finish: string, skinType: SkinType): number {
  const normalized = finish.toLowerCase()
  const preferred: Record<SkinType, string[]> = {
    Dry: ['влаж', 'сия', 'сатин', 'натураль'],
    Normal: ['натураль', 'сатин', 'сия', 'матов'],
    Oily: ['матов', 'пудров', 'натураль'],
    Combination: ['натураль', 'сатин', 'матов'],
  }
  return preferred[skinType].some((marker) => normalized.includes(marker)) ? 96 : 70
}

function toScoredProduct(product: CatalogMatch): ScoredProduct {
  return {
    id: product.id,
    brand: product.brand,
    name: product.name,
    shade: product.shade.name,
    undertone: [],
    skinType: [],
    coverage: textureToCoverage(product.texture),
    finish: catalogFinishToFinish(product.finish),
    price: product.price,
    description: `${capitalize(product.texture)} текстура и ${product.finish} финиш. Подходящий оттенок: ${product.shade.name}.`,
    imageColor: rgbToHex(product.shade.rgb),
    matchScore: product.matchScore,
  }
}

function textureToCoverage(texture: string): Coverage {
  if (texture.includes('спрей') || texture.includes('жид')) return 'Light'
  if (texture.includes('тверд') || texture.includes('мусс')) return 'Full'
  return 'Medium'
}

function catalogFinishToFinish(finish: string): Finish {
  if (finish.includes('матов') || finish.includes('пудров')) return 'Matte'
  if (finish.includes('влаж') || finish.includes('сия') || finish.includes('глянц')) return 'Dewy'
  if (finish.includes('сатин')) return 'Satin'
  return 'Natural'
}

function rgbToHex(rgb: CatalogShade['rgb']): string {
  return `#${[rgb.r, rgb.g, rgb.b].map((value) => value.toString(16).padStart(2, '0')).join('')}`
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function isUndertone(value: string | null): value is Undertone {
  return value !== null && validUndertones.includes(value as Undertone)
}

function isSkinType(value: string | null): value is SkinType {
  return value !== null && validSkinTypes.includes(value as SkinType)
}
