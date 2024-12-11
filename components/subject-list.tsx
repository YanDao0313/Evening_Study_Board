'use client'

import { useState, useEffect } from 'react'

interface Subject {
  name: string
  task: string
}

const initialSubjects: Subject[] = [
  { name: '语文', task: '这是一个可以展示晚自习任务的网站' },
  { name: '数学', task: '你可以点击各科的文本进行修改' },
  { name: '英语', task: '修改后的内容会保存在本地' },
  { name: '物理', task: '标题的日期与底部的一言会自动更新' },
  { name: '化学', task: '点击一言文本可以设置刷新间隔' },
  { name: '生物', task: 'Made by Kris Yan @ krisyan.dev' }
]

export function SubjectList() {
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editValue, setEditValue] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('subjects')
    if (saved) {
      setSubjects(JSON.parse(saved))
    }
  }, [])

  const handleEdit = (index: number) => {
    setEditingIndex(index)
    setEditValue(subjects[index].task)
  }

  const handleSave = (index: number) => {
    const newSubjects = [...subjects]
    newSubjects[index].task = editValue
    setSubjects(newSubjects)
    setEditingIndex(null)
    localStorage.setItem('subjects', JSON.stringify(newSubjects))
  }

  return (
    <div className="space-y-6 text-2xl">
      {subjects.map((subject, index) => (
        <div key={index} className="text-white flex items-center space-x-4 p-6 bg-white/5 backdrop-blur-sm rounded-lg">
          <span className="w-24 font-bold">{subject.name}：</span>
          {editingIndex === index ? (
            <div className="flex-1 flex space-x-2">
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="flex-1 bg-white/10 rounded px-4 py-2 text-white text-2xl"
                autoFocus
              />
              <button
                onClick={() => handleSave(index)}
                className="px-6 py-2 bg-white/20 rounded hover:bg-white/30 text-2xl"
              >
                保存
              </button>
            </div>
          ) : (
            <span
              onClick={() => handleEdit(index)}
              className="flex-1 cursor-pointer hover:text-gray-300"
            >
              {subject.task}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

