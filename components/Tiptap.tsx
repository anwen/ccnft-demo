import { useEditor, EditorContent, BubbleMenu, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Paragraph } from "@tiptap/extension-paragraph"
import Placeholder from '@tiptap/extension-placeholder'
import { Heading } from '@tiptap/extension-heading'
import { useLocalStorageValue } from "@react-hookz/web"
import { CREATE_CACHE  } from "../constants"
import { BulletList } from "@tiptap/extension-bullet-list"
import { OrderedList } from "@tiptap/extension-ordered-list"
import { ListItem } from "@tiptap/extension-list-item"
import { Image } from "@tiptap/extension-image"
import { UploadImageDialog } from "./UploadImageDialog"
import { useState } from "react"
import TurndownService from 'turndown'
import MarkdownIt from 'markdown-it'

interface TiptapProps {
  initValue: string
}

const turndownService = new TurndownService('commonmark', { headingStyle: 'atx' })
const md = new MarkdownIt()

export const Tiptap = ({ initValue }: TiptapProps) => {
  const [openImageDialog, setOpenImageDialog] = useState(false)
  const [, setCache] = useLocalStorageValue<any>(CREATE_CACHE)
  const editor = useEditor({
    onUpdate: ({ editor : e }) => {
      const html = e.getHTML()
      const markdown = turndownService.turndown(html)
      setCache(markdown)
    },
    extensions: [
      BulletList,
      OrderedList,
      ListItem,
      Image,
      StarterKit,
      Paragraph,
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return 'What’s the title?'
          }

          return 'Can you add some further context?'
        },
      }),
      Heading.configure({
        levels: [1, 2],
      }),
    ],
    content: md.render(initValue ?? ''),
    editorProps: {
      attributes: {
        class: 'focus:outline-none text-lg py-4',
        style: 'min-height: 500px;'
      },
    },
  })

  const handleImage = (url) => {
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
    setOpenImageDialog(false)
  }

  return (
    <div>
      {editor && <BubbleMenu editor={editor} pluginKey={'menu'}>
        <MenuUI editor={editor} />
      </BubbleMenu>}
      <UploadImageDialog open={openImageDialog} close={() => setOpenImageDialog(false)} save={handleImage} />
      <EditorContent editor={editor} />
      <div className='fixed bottom-6 inset-x-0'>
        <div className="flex justify-center">
          <FixedMenuUI editor={editor} openImageDialog={() => setOpenImageDialog(true)} />
        </div>
      </div>
    </div>
  )
}

const FixedMenuUI = ({ editor, openImageDialog }: {editor: Editor, openImageDialog: () => void}) => {
  if (!editor) return null
  return (
    <div className=" justify-center bg-gray-100 rounded flex px-2 divide-x w-80">
      <div className="p-2 text-gray-800">
        <button
          onClick={(e) => { editor.chain().focus().toggleBulletList().run(); e.preventDefault() }}
          className={editor.isActive('bulletList') ? 'is-active' : ''}
        >
          Bullet list
        </button>
      </div>
      <div className="p-2 text-gray-800">
        <button
          onClick={(e) => {editor.chain().focus().toggleOrderedList().run(); e.preventDefault()}}
          className={editor.isActive('orderedList') ? 'is-active' : ''}
        >
          Order list
        </button>
      </div>
      <div className="p-2 text-gray-800">
        <button
          onClick={(e) => { e.preventDefault(); openImageDialog()}}
        >
          Image
        </button>
      </div>
    </div>
  )
}

const MenuUI = ({ editor }: {editor: Editor}) => {
  if (!editor) return null
  return (
    <div className="shadow-md bg-gray-100 rounded flex px-2 divide-x">
      <div className="p-2 text-gray-800">
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('h-1') ? 'is-active' : ''}
        >
          h1
        </button>
      </div>
      <div className="p-2 text-gray-800">
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('h-1') ? 'is-active' : ''}
        >
          h2
        </button>
      </div>
      <div className="p-2 text-gray-800">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'is-active' : ''}
        >
        bold
        </button>
      </div>
      <div className="p-2 text-gray-800">
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'is-active' : ''}
        >
        italic
        </button>
      </div>
    </div>
  )
}