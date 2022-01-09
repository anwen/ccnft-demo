import { Editor } from "../components/Editor"

export default function CreateDraft() {
  const account = 'testaccout'
  return (
    <div className="flex justify-center py-16 min-h-screen">
      <Editor account={account} />
    </div>
  )
}