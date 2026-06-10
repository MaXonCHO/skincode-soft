import type { SkinTypeOption, UndertoneOption } from '../types'
import warmToneImage from '../../photo/warm-tone.png'
import coolToneImage from '../../photo/cool-tone.png'
import neutralToneImage from '../../photo/neutral-tone.png'
import oliveToneImage from '../../photo/olive-tone.png'
import drySkinImage from '../../photo/dry-skin.png'
import normalSkinImage from '../../photo/normal-skin.png'
import oilySkinImage from '../../photo/oily-skin.png'
import combinationSkinImage from '../../photo/combination-skin.png'

export const undertoneOptions: UndertoneOption[] = [
  {
    id: 'Warm',
    label: 'Warm',
    description: 'Золотистый, персиковый оттенок кожи',
    color: '#f5c9a0',
    image: warmToneImage,
  },
  {
    id: 'Cool',
    label: 'Cool',
    description: 'Розовый, голубоватый подтон',
    color: '#f0b8c8',
    image: coolToneImage,
  },
  {
    id: 'Neutral',
    label: 'Neutral',
    description: 'Сбалансированный тёпло-холодный тон',
    color: '#e8c4b0',
    image: neutralToneImage,
  },
  {
    id: 'Olive',
    label: 'Olive',
    description: 'Зеленоватый, оливковый подтон',
    color: '#c8b898',
    image: oliveToneImage,
  },
]

export const skinTypeOptions: SkinTypeOption[] = [
  {
    id: 'Dry',
    label: 'Dry',
    description: 'Склонна к шелушению, нуждается в увлажнении',
    color: '#e8d4f0',
    image: drySkinImage,
  },
  {
    id: 'Normal',
    label: 'Normal',
    description: 'Сбалансированная, без выраженных проблем',
    color: '#d4e8f0',
    image: normalSkinImage,
  },
  {
    id: 'Oily',
    label: 'Oily',
    description: 'Блеск в Т-зоне, расширенные поры',
    color: '#d4f0e8',
    image: oilySkinImage,
  },
  {
    id: 'Combination',
    label: 'Combination',
    description: 'Жирная Т-зона, сухие щёки',
    color: '#f0e8d4',
    image: combinationSkinImage,
  },
]
