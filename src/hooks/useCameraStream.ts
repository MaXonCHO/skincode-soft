import { useEffect, useRef, useState } from 'react'

let sharedStream: MediaStream | null = null

async function acquireStream(): Promise<MediaStream> {
  if (sharedStream?.active) return sharedStream

  sharedStream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: 'user', width: { ideal: 1920 }, height: { ideal: 1080 } },
    audio: false,
  })

  return sharedStream
}

export function releaseCameraStream() {
  sharedStream?.getTracks().forEach((track) => track.stop())
  sharedStream = null
}

export function useCameraStream(active: boolean) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hasCamera, setHasCamera] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!active) return

    let cancelled = false

    async function start() {
      try {
        const stream = await acquireStream()
        if (cancelled) return
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
        setHasCamera(true)
        setError(false)
      } catch {
        if (!cancelled) {
          setHasCamera(false)
          setError(true)
        }
      }
    }

    start()

    return () => {
      cancelled = true
    }
  }, [active])

  useEffect(() => {
    if (!active) return
    if (sharedStream && videoRef.current && videoRef.current.srcObject !== sharedStream) {
      videoRef.current.srcObject = sharedStream
      setHasCamera(true)
    }
  })

  return { videoRef, hasCamera, error }
}
