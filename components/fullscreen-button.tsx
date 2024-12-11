'use client'

import { Maximize2, Minimize2 } from 'lucide-react'
import { useState } from 'react'

export function FullscreenButton() {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  return (
    <button
      onClick={toggleFullscreen}
      className="fixed top-6 right-6 p-3 bg-white/10 rounded-lg hover:bg-white/20"
    >
      {isFullscreen ? <Minimize2 size={32} color="white" /> : <Maximize2 size={32} color="white" />}
    </button>
  )
}

