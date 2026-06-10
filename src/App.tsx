import { useCallback, useEffect, useState } from 'react'
import { releaseCameraStream } from './hooks/useCameraStream'
import { AnimatePresence, motion } from 'framer-motion'
import { HomeScreen } from './screens/HomeScreen'
import { ScanScreen } from './screens/ScanScreen'
import { ParametersScreen } from './screens/ParametersScreen'
import { RecommendationsScreen } from './screens/RecommendationsScreen'
import { getRecommendations } from './utils/matching'
import type { ScoredProduct, Screen, SkinProfile } from './types'

const pageTransition = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.02 },
  transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [profile, setProfile] = useState<SkinProfile>({ undertone: 'Neutral', skinType: 'Combination' })
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
    if (screen === 'home' || screen === 'recommendations') {
      releaseCameraStream()
    }
  }, [screen])

  return (
    <div className="app-container">
      <div className="app-frame">
        <AnimatePresence mode="wait">
          {screen === 'home' && (
            <motion.div key="home" className="screen-wrapper" {...pageTransition}>
              <HomeScreen onStart={() => setScreen('scan')} />
            </motion.div>
          )}
          {screen === 'scan' && (
            <motion.div key="scan" className="screen-wrapper" {...pageTransition}>
              <ScanScreen onComplete={() => setScreen('parameters')} />
            </motion.div>
          )}
          {screen === 'parameters' && (
            <motion.div key="parameters" className="screen-wrapper" {...pageTransition}>
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
