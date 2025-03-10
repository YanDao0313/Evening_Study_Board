'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { BackgroundSwitcher, BackgroundType, BackgroundSettings } from './background-switcher'
import { FullscreenButton } from './fullscreen-button'

// 默认背景图片路径
const DEFAULT_BACKGROUND = '/wallhaven-ex55o8-zipped.jpg'

export function BackgroundWrapper() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [backgroundSettings, setBackgroundSettings] = useState<BackgroundSettings>({
    type: BackgroundType.DEFAULT
  })
  const [imageUrl, setImageUrl] = useState<string>(DEFAULT_BACKGROUND)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [fadeIn, setFadeIn] = useState<boolean>(true)
  const [error, setError] = useState<boolean>(false)
  const [loadAttempts, setLoadAttempts] = useState<number>(0)

  // 预加载图片
  const preloadImage = useCallback((url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image()
      img.src = url
      img.onload = () => resolve()
      img.onerror = () => reject()
    })
  }, [])

  // 处理背景设置变更
  const handleBackgroundChange = useCallback(async (settings: BackgroundSettings) => {
    setBackgroundSettings(settings)
    setError(false)
    
    const targetUrl = (settings.type === BackgroundType.DEFAULT) 
      ? DEFAULT_BACKGROUND 
      : (settings.customImageUrl || DEFAULT_BACKGROUND)
    
    // 如果URL没有变化且不是强制刷新，则不需要重新加载
    if (targetUrl === imageUrl && !settings.customImageUrl?.includes('t=')) {
      return
    }
    
    setIsLoading(true)
    setFadeIn(false)
    
    try {
      await preloadImage(targetUrl)
      
      // 短暂延迟后开始淡入新图片
      setTimeout(() => {
        setImageUrl(targetUrl)
        setFadeIn(true)
        setIsLoading(false)
        setLoadAttempts(0)
      }, 300)
    } catch (err) {
      console.error('Failed to load image:', err)
      setError(true)
      
      // 如果加载失败且尝试次数小于3，则重试
      if (loadAttempts < 3) {
        setLoadAttempts(prev => prev + 1)
        setTimeout(() => {
          handleBackgroundChange(settings)
        }, 1000)
      } else {
        setImageUrl(DEFAULT_BACKGROUND)
        setFadeIn(true)
        setIsLoading(false)
        setLoadAttempts(0)
      }
    }
  }, [imageUrl, loadAttempts, preloadImage])

  return (
    <>
      {/* 背景图片容器 - 固定定位确保始终填充视口 */}
      <div className="fixed inset-0 bg-black">
        <Image
          src={imageUrl}
          alt="Background image"
          fill
          unoptimized
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
          }}
          quality={100}
          priority
          className={`brightness-50 transition-opacity duration-700 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}
          onError={() => {
            console.error('Failed to load image, falling back to default')
            setError(true)
            setImageUrl(DEFAULT_BACKGROUND)
          }}
        />
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              <p className="mt-4 text-sm text-white/70">加载中...</p>
            </div>
          </div>
        )}
      </div>
      
      {/* 控制按钮容器 - 固定定位确保始终可见 */}
      <div className="fixed top-0 right-0 z-50 p-6 flex items-center space-x-4">
        <BackgroundSwitcher onBackgroundChange={handleBackgroundChange} />
        <FullscreenButton />
      </div>
      
      {/* 错误提示 - 固定定位确保始终可见 */}
      {error && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-red-500/80 text-white text-sm rounded-lg backdrop-blur-sm z-50">
          图片加载失败，已切换为默认背景
        </div>
      )}
    </>
  )
} 