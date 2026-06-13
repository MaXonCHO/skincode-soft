export type Undertone = 'Warm' | 'Cool' | 'Neutral' | 'Olive'
export type SkinType = 'Dry' | 'Normal' | 'Oily' | 'Combination'
export type Coverage = 'Light' | 'Medium' | 'Full'
export type Finish = 'Matte' | 'Natural' | 'Dewy' | 'Satin'

export interface SkinProfile {
  undertone: Undertone
  skinType: SkinType
}

export interface Product {
  id: string
  brand: string
  name: string
  shade: string
  undertone: Undertone[]
  skinType: SkinType[]
  coverage: Coverage
  finish: Finish
  price: number
  description: string
  imageColor: string
}

export interface ScoredProduct extends Product {
  matchScore: number
}

export type SkinAnalysisConfidence = 'High' | 'Medium' | 'Low'

export type CareProductCategory = 'Cleanser' | 'Moisturizer' | 'SPF' | 'Active Treatment'

export interface CareProduct {
  id: string
  category: CareProductCategory
  tier: 'Basic' | 'Premium'
  brand: string
  name: string
  price: number
  reason: string
}

export interface SkinCareRecommendation {
  title: string
  text: string
}

export interface SkinAnalysisResult {
  score: number
  visibleInImage: string[]
  providedByUser: string[]
  recommendations: SkinCareRecommendation[]
  products: CareProduct[]
  confidence: {
    level: SkinAnalysisConfidence
    explanation: string
  }
  summary: string
}

export type Screen = 'home' | 'scan' | 'parameters' | 'recommendations' | 'skin-home' | 'skin-scan' | 'skin-results'

export interface UndertoneOption {
  id: Undertone
  label: string
  description: string
  color: string
  image: string
}

export interface SkinTypeOption {
  id: SkinType
  label: string
  description: string
  color: string
  image: string
}
