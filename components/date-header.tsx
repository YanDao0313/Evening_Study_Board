'use client'

import { useEffect, useState } from 'react'

export function DateHeader() {
  const [dateString, setDateString] = useState('')
  
  useEffect(() => {
    const date = new Date()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const weekDay = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()]
    setDateString(`${month}.${day}星期${weekDay} 晚自习建议`)
  }, [])

  return (
    <h1 className="text-6xl mb-12 text-center font-bold text-white">
      {dateString}
    </h1>
  )
}

