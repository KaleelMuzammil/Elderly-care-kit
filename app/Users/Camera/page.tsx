'use client'
import { useEffect, useRef, useState } from 'react'
import NavBar from '../Navbar/page'

export default function Camera() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    let stream: MediaStream
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then(s => {
        stream = s
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play().catch(() => {})
        }
      })
      .catch(e => setErr(e.message))

    return () => stream?.getTracks().forEach(t => t.stop())
  }, [])

  return (
    <div>
      <div className="fixed top-0 left-0 right-0 z-50">
        <NavBar />
      </div>
      <div className="mt-16 p-4">
        <video ref={videoRef} autoPlay playsInline className="w-full max-w-3xl rounded-lg" />
        {err && <p className="text-red-600 mt-2">Camera error: {err}</p>}
      </div>
    </div>
  )
}
