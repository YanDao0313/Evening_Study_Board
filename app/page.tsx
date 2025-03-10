import { DateHeader } from '@/components/date-header'
import { SubjectList } from '@/components/subject-list'
import { Hitokoto } from '@/components/hitokoto'
import { BackgroundWrapper } from '@/components/background-wrapper'

export default function Page() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <BackgroundWrapper />
      <div className="relative z-10 min-h-screen bg-black/40">
        {/* 内容滚动容器 */}
        <div className="h-screen overflow-y-auto auto-hide-scrollbar">
          <div className="flex items-center justify-center min-h-screen">
            <div className="w-full px-12 py-20">
              <div className="max-w-5xl mx-auto">
                <DateHeader />
                <SubjectList />
                <Hitokoto />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

