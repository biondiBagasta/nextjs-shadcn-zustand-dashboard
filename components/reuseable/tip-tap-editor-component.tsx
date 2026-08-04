"use client"

import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

interface TipTapEditorProps {
  value: string
  onChange: (value: string) => void
}

export default function TipTapEditorComponent(props: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: props.value || "<p>Isi Konten</p>",
    immediatelyRender: false,

    onUpdate: ({ editor }) => {
      props.onChange(editor.getHTML())
    },
  })

  if (!editor) {
    return null
  }

  return (
    <div className="rounded-md border">
      <div className="flex items-center gap-1 border-b p-2">
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleBold().run()
          }
          className="rounded px-2 py-1 hover:bg-muted"
        >
          <strong>B</strong>
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleItalic().run()
          }
          className="rounded px-2 py-1 hover:bg-muted"
        >
          <em>I</em>
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleStrike().run()
          }
          className="rounded px-2 py-1 hover:bg-muted"
        >
          <s>S</s>
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleBulletList().run()
          }
          className="rounded px-2 py-1 hover:bg-muted"
        >
          •
        </button>
      </div>

      <EditorContent
        editor={editor}
        className="
          w-full
          [&_.ProseMirror]:min-h-50
          [&_.ProseMirror]:p-3
          [&_.ProseMirror]:text-foreground
          [&_.ProseMirror]:outline-none
          [&_.ProseMirror]:cursor-text
        "
      />
    </div>
  )
}