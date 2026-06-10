import type { SkinTypeOption, UndertoneOption } from '../types'

export const undertoneOptions: UndertoneOption[] = [
  {
    id: 'Warm',
    label: 'Warm',
    description: 'Золотистый, персиковый оттенок кожи',
    color: '#f5c9a0',
  },
  {
    id: 'Cool',
    label: 'Cool',
    description: 'Розовый, голубоватый подтон',
    color: '#f0b8c8',
  },
  {
    id: 'Neutral',
    label: 'Neutral',
    description: 'Сбалансированный тёпло-холодный тон',
    color: '#e8c4b0',
  },
  {
    id: 'Olive',
    label: 'Olive',
    description: 'Зеленоватый, оливковый подтон',
    color: '#c8b898',
  },
]

export const skinTypeOptions: SkinTypeOption[] = [
  {
    id: 'Dry',
    label: 'Dry',
    description: 'Склонна к шелушению, нуждается в увлажнении',
    color: '#e8d4f0',
  },
  {
    id: 'Normal',
    label: 'Normal',
    description: 'Сбалансированная, без выраженных проблем',
    color: '#d4e8f0',
  },
  {
    id: 'Oily',
    label: 'Oily',
    description: 'Блеск в Т-зоне, расширенные поры',
    color: '#d4f0e8',
  },
  {
    id: 'Combination',
    label: 'Combination',
    description: 'Жирная Т-зона, сухие щёки',
    color: '#f0e8d4',
  },
]
