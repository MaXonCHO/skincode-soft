import { products } from '../data/products'
import type { ScoredProduct, SkinProfile } from '../types'

export function getRecommendations(profile: SkinProfile): ScoredProduct[] {
  return products
    .map((product) => ({
      ...product,
      matchScore: calculateMatchScore(product.undertone, product.skinType, profile),
    }))
    .filter((p) => p.matchScore >= 70)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5)
}

function calculateMatchScore(
  productUndertones: string[],
  productSkinTypes: string[],
  profile: SkinProfile
): number {
  const undertoneMatch = productUndertones.includes(profile.undertone) ? 50 : 15
  const skinTypeMatch = productSkinTypes.includes(profile.skinType) ? 50 : 20
  const bonus = productUndertones.includes(profile.undertone) &&
    productSkinTypes.includes(profile.skinType)
    ? 6
    : 0

  return Math.min(99, undertoneMatch + skinTypeMatch + bonus)
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(price)
}
