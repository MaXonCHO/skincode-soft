import { useCallback, useEffect, useState } from 'react'
import { releaseCameraStream } from './hooks/useCameraStream'
import { AnimatePresence, motion } from 'framer-motion'
import { HomeScreen } from './screens/HomeScreen'
import { ScanScreen } from './screens/ScanScreen'
import { ParametersScreen } from './screens/ParametersScreen'
import { RecommendationsScreen } from './screens/RecommendationsScreen'
import { CatalogScreen } from './screens/CatalogScreen'
import { getCatalogProfile } from './utils/catalog'
import { getRecommendations } from './utils/matching'
import type { ScoredProduct, Screen, SkinProfile } from './types'

const pageTransition = {
  initial: { opacity: 0, scale: 0.995, y: 8 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 1.003, y: -5 },
  transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] },
}

const scanPageTransition = {
  initial: { opacity: 0, scale: 0.998, y: 4 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 1, y: 0 },
  transition: { duration: 0.78, ease: [0.22, 1, 0.36, 1] },
}

const parametersPageTransition = {
  initial: { opacity: 0, scale: 1.002, y: 3 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 1, y: -3 },
  transition: { duration: 0.88, ease: [0.22, 1, 0.36, 1] },
}

export default function App() {
  const catalogProfile = getCatalogProfile()
  const [screen, setScreen] = useState<Screen>(catalogProfile ? 'catalog' : 'home')
  const [profile, setProfile] = useState<SkinProfile>({
    undertone: catalogProfile?.undertone ?? 'Neutral',
    skinType: catalogProfile?.skinType ?? 'Combination',
  })
  const [recommendations, setRecommendations] = useState<ScoredProduct[]>([])

  const handleParametersComplete = useCallback((newProfile: SkinProfile) => {
    setProfile(newProfile)
    setRecommendations(getRecommendations(newProfile))
    setScreen('recommendations')
  }, [])

  const handleRestart = useCallback(() => {
    releaseCameraStream()
    setScreen('home')
    setProfile({ undertone: 'Neutral', skinType: 'Combination' })
    setRecommendations([])
  }, [])

  useEffect(() => {
    if (screen === 'home') {
      releaseCameraStream()
    }
  }, [screen])

  return (
    <div className="app-container">
      <div className="app-frame">
        <AnimatePresence mode="sync" initial={false}>
          {screen === 'home' && (
            <motion.div key="home" className="screen-wrapper" {...pageTransition}>
              <HomeScreen onStart={() => setScreen('scan')} />
            </motion.div>
          )}
          {screen === 'scan' && (
            <motion.div key="scan" className="screen-wrapper" {...scanPageTransition}>
              <ScanScreen onComplete={() => setScreen('parameters')} />
            </motion.div>
          )}
          {screen === 'parameters' && (
            <motion.div key="parameters" className="screen-wrapper" {...parametersPageTransition}>
              <ParametersScreen onComplete={handleParametersComplete} />
            </motion.div>
          )}
          {screen === 'recommendations' && (
            <motion.div key="recommendations" className="screen-wrapper" {...pageTransition}>
              <RecommendationsScreen
                profile={profile}
                products={recommendations}
                onRestart={handleRestart}
              />
            </motion.div>
          )}
          {screen === 'catalog' && (
            <motion.div key="catalog" className="screen-wrapper" {...pageTransition}>
              <CatalogScreen profile={profile} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .screen-wrapper {
          position: absolute;
          inset: 0;
        }
      `}</style>
    </div>
  )
}
