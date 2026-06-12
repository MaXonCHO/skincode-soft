import type { SkinProfile, SkinType, Undertone } from '../types'

const undertones: Undertone[] = ['Warm', 'Cool', 'Neutral', 'Olive']
const skinTypes: SkinType[] = ['Dry', 'Normal', 'Oily', 'Combination']

export function getSharedProfile(): SkinProfile | null {
  const params = new URLSearchParams(window.location.search)
  const undertone = params.get('undertone')
  const skinType = params.get('skinType')

  if (!isUndertone(undertone) || !isSkinType(skinType)) return null
  return { undertone, skinType }
}

export function getRecommendationsUrl(profile: SkinProfile): string {
  const url = new URL(window.location.href)
  url.searchParams.set('undertone', profile.undertone)
  url.searchParams.set('skinType', profile.skinType)
  return url.toString()
}

export function setSharedProfile(profile: SkinProfile | null) {
  const url = new URL(window.location.href)
  url.searchParams.delete('undertone')
  url.searchParams.delete('skinType')

  if (profile) {
    url.searchParams.set('undertone', profile.undertone)
    url.searchParams.set('skinType', profile.skinType)
  }

  window.history.replaceState({}, '', url)
}

function isUndertone(value: string | null): value is Undertone {
  return value !== null && undertones.includes(value as Undertone)
}

function isSkinType(value: string | null): value is SkinType {
  return value !== null && skinTypes.includes(value as SkinType)
}
