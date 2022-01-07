import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {Paragraph} from "@tiptap/extension-paragraph";
import Placeholder from '@tiptap/extension-placeholder'
import { Heading} from '@tiptap/extension-heading';

export const Tiptap = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Paragraph.configure({
        HTMLAttributes: {
          class: 'text-neutral-800 text-lg min-h-full',
        },
      }),
      Placeholder.configure({
        placeholder: 'Write something …',
      }),
      Heading.configure({
        levels: [1, 2, 3],
      })
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'focus:outline-none text-lg',
      },
    },
  })

  return (
    <EditorContent editor={editor} />
  )
}