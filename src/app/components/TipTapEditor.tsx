'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TurndownService from 'turndown';

const turndownService = new TurndownService()

interface EditorProps {
  castMessage: Function;
  setOpen: Function;
  sendingCast: boolean;
  setSendingCast: Function;
}
const TipTapEditor = ({ castMessage, setOpen, setSendingCast, sendingCast }: EditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: '<p></p>',
  })

  const handleSubmit = async () => {
    setSendingCast(true);
    const html = editor?.getHTML()    
    const markdown = turndownService.turndown(html || "")
    const text = editor?.getText()    
    await castMessage(text, markdown)
  }
  return (
    <div>
      <div className="p-4 border border-gray-900 rounded-md">
        <EditorContent editor={editor} />
      </div>
      <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
        <button
          type="button"
          disabled={sendingCast}
          className="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
          onClick={() => handleSubmit()}
        >
          {sendingCast ? "Casting..." : "Cast"}
        </button>
        <button
          type="button"
          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
          onClick={() => setOpen(false)}
          data-autofocus
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default TipTapEditor