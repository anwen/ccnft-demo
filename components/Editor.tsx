import { memo } from "react"
import { Tiptap } from "./Tiptap"
import TextareaAutosize from 'react-textarea-autosize'

interface EditorProps {
  account: string
}

export const Editor = memo<EditorProps>(({ account }) => {
  return (
    <div style={{ width: '720px' }}>
      <div>
        <span className="ml-2 bg-gray-200 text-gray-500 rounded-full inline-block p-1 px-2 text-sm">+ Add Image</span>
      </div>
      <div className="pt-12">
        <TextareaAutosize placeholder="Give a title" className="border-0 outline-0 text-5xl w-full resize-none" />
      </div>
      <div className="my-6 text-gray-800 flex items-center">
        <div className="w-8 h-8 rounded-full inline-flex items-center justify-center bg-gray-200 text-gray-400">
          <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
            className="w-4 h-4" viewBox="0 0 24 24">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <span className="ml-2 text-gray-800">Author</span>
        <span className="ml-2 bg-gray-200 text-gray-500 rounded-full inline-block p-1 px-2 text-sm">0xEddsad</span>
      </div>
      <Tiptap />
    </div>
  )
})

Editor.displayName = 'Editor'