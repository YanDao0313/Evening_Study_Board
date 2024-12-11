import '@/app/globals.css'
import type { Metadata } from 'next'
import { notoSerifSC } from './fonts'

export const metadata: Metadata = {
  title: '晚自习建议',
  description: '每日晚自习任务展示',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh" className={notoSerifSC.className}>
      <body className="min-h-screen">{children}</body>
    </html>
  )
}

