import logoImage from '../../photo/logo.png'

interface LogoProps {
  variant?: 'default' | 'light'
}

export function Logo({ variant = 'default' }: LogoProps) {
  return (
    <img
      src={logoImage}
      alt="SkinCode"
      className={`logo ${variant === 'light' ? 'logo--light' : ''}`}
    />
  )
}
