import { memo } from "react";
import { Tiptap } from "./Tiptap";

interface EditorProps {
  account: string
}

// eslint-disable-next-line react/display-name
export const Editor = memo<EditorProps>(({ account}) => {
  return (
    <div style={{width: '720px'}}>
      <input placeholder="Give a title" type="text" className="border-0 outline-0 text-5xl"/>
      <div className="my-4">
        Account: {account}
      </div>
      <Tiptap />
    </div>
  )
})