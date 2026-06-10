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

export type Screen = 'home' | 'scan' | 'parameters' | 'recommendations'

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
