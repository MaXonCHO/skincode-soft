import { useEffect, useMemo, useState } from 'react'
import QRCode from 'qrcode'
import type { SkinProfile } from '../types'
import { getRecommendationsUrl } from '../utils/shareRecommendations'

interface RecommendationsQrCardProps {
  profile: SkinProfile
}

export function RecommendationsQrCard({ profile }: RecommendationsQrCardProps) {
  const url = useMemo(
    () => getRecommendationsUrl(profile),
    [profile.skinType, profile.undertone]
  )
  const [qrImage, setQrImage] = useState('')

  useEffect(() => {
    let active = true

    QRCode.toDataURL(url, {
      width: 280,
      margin: 1,
      color: { dark: '#171419', light: '#ffffff' },
      errorCorrectionLevel: 'M',
    }).then((image) => {
      if (active) setQrImage(image)
    })

    return () => {
      active = false
    }
  }, [url])

  return (
    <div className="recommendations-qr-card">
      <div className="recommendations-qr-card__code">
        {qrImage && <img src={qrImage} alt="QR-код полной подборки тональных средств" />}
      </div>
      <strong>Полная подборка</strong>
      <span>Отсканируйте, чтобы открыть на телефоне</span>

      <style>{`
        .recommendations-qr-card {
          flex: 0 0 178px;
          height: 242px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 12px;
          border: 1px solid rgba(255,255,255,.72);
          border-radius: 18px;
          background: rgba(255,255,255,.3);
          color: #fff;
          text-align: center;
          backdrop-filter: blur(20px) saturate(145%);
          -webkit-backdrop-filter: blur(20px) saturate(145%);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.58), 0 14px 34px rgba(0,0,0,.16);
        }
        .recommendations-qr-card__code {
          width: 132px;
          height: 132px;
          margin-bottom: 10px;
          padding: 7px;
          border-radius: 14px;
          background: #fff;
          box-shadow: 0 9px 24px rgba(0,0,0,.12);
        }
        .recommendations-qr-card__code img {
          width: 100%;
          height: 100%;
          display: block;
        }
        .recommendations-qr-card strong {
          font-size: 14px;
          line-height: 1.15;
        }
        .recommendations-qr-card span {
          margin-top: 4px;
          font-size: 10px;
          line-height: 1.25;
          color: rgba(255,255,255,.7);
        }
      `}</style>
    </div>
  )
}
