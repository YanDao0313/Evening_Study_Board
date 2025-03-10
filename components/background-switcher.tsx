'use client'

import { useState, useEffect } from 'react'
import { Image as ImageIcon, Upload, RefreshCw, X } from 'lucide-react'

// 背景类型枚举
export enum BackgroundType {
  DEFAULT = 'default',
  BING = 'bing',
  CUSTOM = 'custom'
}

// 背景设置接口
export interface BackgroundSettings {
  type: BackgroundType
  customImageUrl?: string
  lastUpdated?: number
}

// 默认背景设置
const defaultSettings: BackgroundSettings = {
  type: BackgroundType.DEFAULT
}

// 从本地存储获取背景设置
const getStoredSettings = (): BackgroundSettings => {
  if (typeof window === 'undefined') return defaultSettings
  
  const stored = localStorage.getItem('background-settings')
  if (!stored) return defaultSettings
  
  try {
    return JSON.parse(stored) as BackgroundSettings
  } catch (e) {
    console.error('Failed to parse background settings', e)
    return defaultSettings
  }
}

// 保存背景设置到本地存储
const saveSettings = (settings: BackgroundSettings) => {
  if (typeof window === 'undefined') return
  localStorage.setItem('background-settings', JSON.stringify(settings))
}

// 获取Bing每日一图URL
const getBingDailyImageUrl = async (forceUpdate: boolean = false): Promise<string> => {
  try {
    // 只在强制更新时添加时间戳
    const timestamp = forceUpdate ? `?t=${new Date().getTime()}` : ''
    return `https://bing.ee123.net/img/4k${timestamp}`
  } catch (error) {
    console.error('Failed to fetch Bing daily image', error)
    return '/wallhaven-ex55o8-zipped.jpg'
  }
}

// 检查是否需要更新Bing图片
const shouldUpdateBingImage = (lastUpdated?: number): boolean => {
  if (!lastUpdated) return true
  
  const now = new Date()
  const lastUpdate = new Date(lastUpdated)
  
  // 如果不是同一天，或者当前时间在0:10之后而上次更新在0:10之前，则需要更新
  return (
    now.getDate() !== lastUpdate.getDate() ||
    (now.getHours() === 0 && now.getMinutes() >= 10 && 
     (lastUpdate.getHours() !== 0 || lastUpdate.getMinutes() < 10))
  )
}

export function BackgroundSwitcher({ 
  onBackgroundChange 
}: { 
  onBackgroundChange: (settings: BackgroundSettings) => void 
}) {
  const [settings, setSettings] = useState<BackgroundSettings>(defaultSettings)
  const [isOpen, setIsOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [lastUpdateAttempt, setLastUpdateAttempt] = useState<number>(0)

  // 初始化时从本地存储加载设置
  useEffect(() => {
    const storedSettings = getStoredSettings()
    setSettings(storedSettings)
    
    // 如果是Bing背景且需要更新，自动更新
    if (storedSettings.type === BackgroundType.BING && shouldUpdateBingImage(storedSettings.lastUpdated)) {
      const now = Date.now()
      // 确保两次更新间隔至少1分钟
      if (now - lastUpdateAttempt > 60000) {
        handleTypeChange(BackgroundType.BING)
        setLastUpdateAttempt(now)
      }
    } else {
      onBackgroundChange(storedSettings)
    }
  }, [onBackgroundChange, lastUpdateAttempt])

  // 处理背景类型变更
  const handleTypeChange = async (type: BackgroundType, forceUpdate: boolean = false) => {
    if (isUpdating) return
    
    setIsUpdating(true)
    let newSettings: BackgroundSettings = { ...settings, type }
    
    // 如果选择Bing每日一图，获取图片URL
    if (type === BackgroundType.BING) {
      try {
        const bingUrl = await getBingDailyImageUrl(forceUpdate)
        newSettings = {
          ...newSettings,
          customImageUrl: bingUrl,
          lastUpdated: new Date().getTime()
        }
      } catch (error) {
        console.error('Failed to get Bing image', error)
      }
    }
    
    setSettings(newSettings)
    saveSettings(newSettings)
    onBackgroundChange(newSettings)
    setIsUpdating(false)
  }

  // 处理本地图片上传
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    // 检查文件大小（最大10MB）
    if (file.size > 10 * 1024 * 1024) {
      alert('图片大小不能超过10MB')
      return
    }
    
    const reader = new FileReader()
    reader.onload = (e) => {
      const customImageUrl = e.target?.result as string
      const newSettings: BackgroundSettings = {
        type: BackgroundType.CUSTOM,
        customImageUrl
      }
      
      setSettings(newSettings)
      saveSettings(newSettings)
      onBackgroundChange(newSettings)
    }
    
    reader.readAsDataURL(file)
  }

  // 点击外部关闭面板
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const panel = document.getElementById('background-panel')
      const button = document.getElementById('background-button')
      
      if (isOpen && panel && button && !panel.contains(target) && !button.contains(target)) {
        setIsOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative">
      <button 
        id="background-button"
        onClick={() => setIsOpen(!isOpen)} 
        className="p-3 bg-black/30 backdrop-blur-md rounded-lg hover:bg-black/40 transition-all duration-300 shadow-lg group"
        title="更换背景"
      >
        <ImageIcon size={24} className="text-white/80 group-hover:text-white transition-colors" />
      </button>
      
      {isOpen && (
        <div 
          id="background-panel"
          className="absolute right-0 mt-2 w-72 bg-black/70 backdrop-blur-md rounded-lg shadow-xl p-5 text-white border border-white/10"
          style={{ 
            animation: 'fadeIn 0.2s ease-out',
            transformOrigin: 'top right'
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">背景设置</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
              title="关闭"
            >
              <X size={16} className="text-white/80 hover:text-white transition-colors" />
            </button>
          </div>
          
          <div className="space-y-1">
            <label className="flex items-center space-x-3 p-2.5 rounded-md hover:bg-white/10 transition-colors cursor-pointer">
              <input 
                type="radio" 
                checked={settings.type === BackgroundType.DEFAULT}
                onChange={() => handleTypeChange(BackgroundType.DEFAULT)}
                className="w-4 h-4 accent-white"
              />
              <span className="text-sm text-white/90">默认背景</span>
            </label>
            
            <label className="flex items-center space-x-3 p-2.5 rounded-md hover:bg-white/10 transition-colors cursor-pointer">
              <input 
                type="radio" 
                checked={settings.type === BackgroundType.BING}
                onChange={() => handleTypeChange(BackgroundType.BING)}
                className="w-4 h-4 accent-white"
              />
              <span className="text-sm text-white/90">Bing每日一图</span>
            </label>
            
            <label className="flex items-center space-x-3 p-2.5 rounded-md hover:bg-white/10 transition-colors cursor-pointer">
              <input 
                type="radio" 
                checked={settings.type === BackgroundType.CUSTOM}
                onChange={() => handleTypeChange(BackgroundType.CUSTOM)}
                className="w-4 h-4 accent-white"
              />
              <span className="text-sm text-white/90">自定义背景</span>
            </label>
          </div>
          
          {settings.type === BackgroundType.CUSTOM && (
            <div className="mt-4 border-t border-white/10 pt-4">
              <label className="block mb-2 text-sm text-white/70">上传图片</label>
              <button 
                onClick={() => document.getElementById('image-upload')?.click()}
                className="w-full py-2 px-4 bg-white/10 hover:bg-white/20 rounded-md flex items-center justify-center transition-colors text-sm font-medium"
              >
                <Upload className="mr-2 h-4 w-4" />
                <span>选择图片</span>
              </button>
              <p className="mt-2 text-xs text-white/50 text-center">
                支持jpg、png格式，最大10MB
              </p>
              <input
                id="image-upload"
                type="file"
                accept="image/jpeg,image/png"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          )}
          
          {settings.type === BackgroundType.BING && (
            <div className="mt-4 border-t border-white/10 pt-4">
              <button 
                onClick={() => handleTypeChange(BackgroundType.BING, true)}
                disabled={isUpdating}
                className={`w-full py-2 px-4 bg-white/10 hover:bg-white/20 rounded-md flex items-center justify-center transition-colors text-sm font-medium ${
                  isUpdating ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isUpdating ? 'animate-spin' : ''}`} />
                <span>{isUpdating ? '更新中...' : '刷新图片'}</span>
              </button>
              <p className="mt-2 text-xs text-white/50 text-center">
                每日0:10自动更新 · 图片来源: Bing每日一图
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
} 