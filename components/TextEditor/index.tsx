"use client";

import BulletList from "@tiptap/extension-bullet-list";
import Code from "@tiptap/extension-code";
import CodeBlock from "@tiptap/extension-code-block";
import Heading from "@tiptap/extension-heading";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Mention from "@tiptap/extension-mention";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Toolbar } from "./Toolbar/Toolbar";
import { useEffect } from "react";

interface Props {
  isEditable?: boolean;
  content: string;
  onChange?: (content: string) => void;
  resetKey?: number;
}
export const TextEditor = ({
  isEditable = false,
  content,
  resetKey = 0,
  onChange,
}: Props) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      ListItem,
      BulletList.configure({ HTMLAttributes: { class: "pl-8" } }),
      Code.configure({
        HTMLAttributes: {
          class: "rounded-xl px-3 py-1 bg-gray-100 dark:bg-gray-900 my-2",
        },
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class:
            "bg-gray-100 dark:bg-gray-900 rounded-sm p-4 border border-gray-200 dark:border-gray-800 my-2",
        },
      }),
      Heading.configure({ levels: [1, 2, 3] }),
      OrderedList.configure({ HTMLAttributes: { class: "pl-8" } }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        defaultAlignment: "left",
      }),
      Mention,
    ],
    content,
    editable: isEditable,
    editorProps: {
      attributes: {
        class: `prose prose-sm sm:prose lg:prose-lg xl:prose-xl px-2 pb-2 pt-3 border ${
          isEditable ? "border-t-0" : "border-0"
        } border-gray-200 dark:border-gray-800 rounded-b-sm ${
          isEditable ? "min-h-[180px]" : ""
        } w-full  focus:ring-0 focus:outline-none text-xs`,
      },
    },
    onUpdate({ editor }) {
      onChange?.(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && resetKey > 0) {
      editor.commands.setContent("");
    }
  }, [editor, resetKey]);

  useEffect(() => {
    if (isEditable) {
      editor?.setEditable(true);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditable]);

  return (
    <div className="w-full">
      {isEditable && (
        <div className="bg-slate-100 dark:bg-gray-900 overflow-x-auto border rounded-t-sm">
          <Toolbar editor={editor} />
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  );
};
