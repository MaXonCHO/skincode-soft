import { useCallback, useEffect, useState } from 'react'
import { releaseCameraStream } from './hooks/useCameraStream'
import { AnimatePresence, motion } from 'framer-motion'
import { HomeScreen } from './screens/HomeScreen'
import { ScanScreen } from './screens/ScanScreen'
import { ParametersScreen } from './screens/ParametersScreen'
import { RecommendationsScreen } from './screens/RecommendationsScreen'
import { SkinAnalysisHomeScreen } from './screens/SkinAnalysisHomeScreen'
import { SkinAnalysisScanScreen } from './screens/SkinAnalysisScanScreen'
import { SkinAnalysisResultsScreen } from './screens/SkinAnalysisResultsScreen'
import { getRecommendations } from './utils/matching'
import type { ScoredProduct, Screen, SkinAnalysisResult, SkinProfile } from './types'

const pageTransition = {
  initial: { opacity: 0, scale: 0.992, filter: 'blur(5px)' },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, scale: 1.006, filter: 'blur(4px)' },
  transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] },
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [profile, setProfile] = useState<SkinProfile>({
    undertone: 'Neutral',
    skinType: 'Combination',
  })
  const [recommendations, setRecommendations] = useState<ScoredProduct[]>([])
  const [skinAnalysis, setSkinAnalysis] = useState<SkinAnalysisResult | null>(null)

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
    setSkinAnalysis(null)
  }, [])

  const handleSkinAnalysisComplete = useCallback((result: SkinAnalysisResult) => {
    setSkinAnalysis(result)
    setScreen('skin-results')
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
              <HomeScreen
                onStart={() => setScreen('scan')}
                onSkinAnalysis={() => setScreen('skin-home')}
              />
            </motion.div>
          )}
          {screen === 'skin-home' && (
            <motion.div key="skin-home" className="screen-wrapper" {...pageTransition}>
              <SkinAnalysisHomeScreen
                onStart={() => setScreen('skin-scan')}
                onFoundationFlow={() => setScreen('scan')}
              />
            </motion.div>
          )}
          {screen === 'scan' && (
            <motion.div key="scan" className="screen-wrapper" {...pageTransition}>
              <ScanScreen onComplete={() => setScreen('parameters')} />
            </motion.div>
          )}
          {screen === 'skin-scan' && (
            <motion.div key="skin-scan" className="screen-wrapper" {...pageTransition}>
              <SkinAnalysisScanScreen onComplete={handleSkinAnalysisComplete} />
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
          {screen === 'skin-results' && skinAnalysis && (
            <motion.div key="skin-results" className="screen-wrapper" {...pageTransition}>
              <SkinAnalysisResultsScreen
                result={skinAnalysis}
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
