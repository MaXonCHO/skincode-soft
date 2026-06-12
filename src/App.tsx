import { useCallback, useEffect, useState } from 'react'
import { releaseCameraStream } from './hooks/useCameraStream'
import { AnimatePresence, motion } from 'framer-motion'
import { HomeScreen } from './screens/HomeScreen'
import { ScanScreen } from './screens/ScanScreen'
import { ParametersScreen } from './screens/ParametersScreen'
import { RecommendationsScreen } from './screens/RecommendationsScreen'
import { getRecommendations } from './utils/matching'
import { getSharedProfile, setSharedProfile } from './utils/shareRecommendations'
import type { ScoredProduct, Screen, SkinProfile } from './types'

const pageTransition = {
  initial: { opacity: 0, scale: 0.992, filter: 'blur(5px)' },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, scale: 1.006, filter: 'blur(4px)' },
  transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
}

export default function App() {
  const sharedProfile = getSharedProfile()
  const [screen, setScreen] = useState<Screen>(sharedProfile ? 'recommendations' : 'home')
  const [profile, setProfile] = useState<SkinProfile>(
    sharedProfile ?? { undertone: 'Neutral', skinType: 'Combination' }
  )
  const [recommendations, setRecommendations] = useState<ScoredProduct[]>(
    sharedProfile ? getRecommendations(sharedProfile) : []
  )

  const handleParametersComplete = useCallback((newProfile: SkinProfile) => {
    setProfile(newProfile)
    setRecommendations(getRecommendations(newProfile))
    setSharedProfile(newProfile)
    setScreen('recommendations')
  }, [])

  const handleRestart = useCallback(() => {
    releaseCameraStream()
    setScreen('home')
    setProfile({ undertone: 'Neutral', skinType: 'Combination' })
    setRecommendations([])
    setSharedProfile(null)
  }, [])

  useEffect(() => {
    if (screen === 'home') {
      releaseCameraStream()
    }
  }, [screen])

  return (
    <div className="app-container">
      <div className="app-frame">
        <AnimatePresence mode="sync">
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
