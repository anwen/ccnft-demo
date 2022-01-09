import { useEditor, EditorContent, BubbleMenu, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Paragraph } from "@tiptap/extension-paragraph"
import Placeholder from '@tiptap/extension-placeholder'
import { Heading } from '@tiptap/extension-heading'

export const Tiptap = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Paragraph.configure({
        HTMLAttributes: {
          class: 'text-neutral-800 text-lg min-h-full mb-2',
        },
      }),
      Placeholder.configure({
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return 'What’s the title?'
          }

          return 'Can you add some further context?'
        },
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'focus:outline-none text-lg py-4',
        style: 'min-height: 500px;'
      },
    },
  })

  return (
    <>
      {editor && <BubbleMenu editor={editor} pluginKey={'menu'}>
        <MenuUI editor={editor} />
      </BubbleMenu>}
      <EditorContent editor={editor} />
    </>
  )
}

const MenuUI = ({ editor }: {editor: Editor}) => {
  return (
    <div className="shadow-md bg-white rounded flex px-2">
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
      <div className="p-2 text-gray-800">
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? 'is-active' : ''}
        >
        strike
        </button>  
      </div>
    </div>
  )
}