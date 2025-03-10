'use client'

import { Maximize2, Minimize2 } from 'lucide-react'
import { useState, useEffect } from 'react'

export function FullscreenButton() {
  const [isFullscreen, setIsFullscreen] = useState(false)

  // 监听全屏状态变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error)
    }
  }

  return (
    <button
      onClick={toggleFullscreen}
      className="p-3 bg-black/30 backdrop-blur-md rounded-lg hover:bg-black/40 transition-all duration-300 shadow-lg group"
      title={isFullscreen ? "退出全屏" : "进入全屏"}
    >
      {isFullscreen ? (
        <Minimize2 size={24} className="text-white/80 group-hover:text-white transition-colors" />
      ) : (
        <Maximize2 size={24} className="text-white/80 group-hover:text-white transition-colors" />
      )}
    </button>
  )
}

