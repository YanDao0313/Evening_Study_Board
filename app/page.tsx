import { DateHeader } from '@/components/date-header'
import { SubjectList } from '@/components/subject-list'
import { Hitokoto } from '@/components/hitokoto'
import { FullscreenButton } from '@/components/fullscreen-button'
import Image from 'next/image'

export default function Page() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Image
        src="/wallhaven-ex55o8-zipped.jpg"
        alt="Cloudy sky background"
        fill
        style={{
          objectFit: 'cover',
          objectPosition: 'center',
        }}
        quality={100}
        priority
        className="brightness-50"
      />
      <div className="relative z-10 min-h-screen bg-black/40 flex items-center justify-center">
        <div className="w-full px-12">
          <div className="max-w-5xl mx-auto">
            <DateHeader />
            <SubjectList />
            <Hitokoto />
          </div>
        </div>
        <FullscreenButton />
      </div>
    </div>
  )
}

