'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

interface HitokotoResponse {
  id: number
  hitokoto: string
  type: string
  from: string
  from_who: string | null
  creator: string
  creator_uid: number
  reviewer: number
  uuid: string
  created_at: string
}

const DEFAULT_INTERVAL = 60

export function Hitokoto() {
  const [quote, setQuote] = useState<string>(':D 一言获取中...')
  const [quoteFrom, setQuoteFrom] = useState<string>('')
  const [interval, setIntervalValue] = useState(DEFAULT_INTERVAL)
  const [showSettings, setShowSettings] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const timer = useRef<NodeJS.Timeout | null>(null)

  const fetchQuote = useCallback(async (): Promise<void> => {
    setIsLoading(true)
    try {
      const response = await fetch('https://v1.hitokoto.cn?c=i&c=k')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data: HitokotoResponse = await response.json()
      setQuote(data.hitokoto)
      setQuoteFrom(data.from)
    } catch {
      // 错误处理
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchQuote()
    timer.current = setInterval(() => {
      fetchQuote()
    }, interval * 1000)

    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [fetchQuote, interval])

  const handleIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInterval = parseInt(e.target.value, 10)
    if (newInterval >= 5 && newInterval <= 3600) {
      setIntervalValue(newInterval)
    }
  }

  return (
    <div className="mt-16 text-center relative">
      <div
        className={`cursor-pointer ${isLoading ? 'opacity-50' : ''}`}
        onClick={() => setShowSettings(!showSettings)}
      >
        <div className="flex justify-between items-center p-6 bg-white/5 backdrop-blur-sm rounded-lg">
          <span className="text-3xl text-white">{quote}</span>
          <span className="text-2xl text-white">——{quoteFrom}</span>
        </div>
      </div>
      {showSettings && (
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg text-white">
          <div className="flex items-center space-x-4">
            <label className="text-xl">
              更新间隔（秒）：
              <input
                type="number"
                value={interval}
                onChange={handleIntervalChange}
                className="ml-2 w-20 bg-white/20 rounded px-2 py-1"
                min="5"
                max="3600"
              />
            </label>
            <button
              onClick={() => setShowSettings(false)}
              className="px-4 py-2 bg-white/20 rounded hover:bg-white/30 text-xl"
            >
              确认
            </button>
          </div>
        </div>
      )}
    </div>
  )
}