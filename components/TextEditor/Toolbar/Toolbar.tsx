import { Editor } from "@tiptap/react";
import {
  AtSign,
  Bold,
  Braces,
  Code,
  Italic,
  List,
  ListOrdered,
  Underline,
} from "lucide-react";

import React from "react";
import { ToolbarIconButton } from "./IconButton";
import { Separator } from "@/components/ui/separator";
import HeadingMenu from "./HeadingMenu";
import AlignMenu from "./AlignMenu";

export const Toolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null;
  const handleBold = () => {
    editor.chain().focus().toggleBold().run();
  };
  const handleItalic = () => {
    editor.chain().focus().toggleItalic().run();
  };
  const handleUnderline = () => {
    editor.chain().focus().toggleUnderline().run();
  };
  const handleCode = () => {
    editor.chain().focus().toggleCode().run();
  };
  const handleBulletList = () => {
    editor.chain().focus().toggleBulletList().run();
  };
  const handleOrderedList = () => {
    editor.chain().focus().toggleOrderedList().run();
  };
  const handleCodeBlock = () => {
    editor.chain().focus().toggleCodeBlock().run();
  };
  const handleAtSign = () => {
    editor.commands.insertContent("@");
  };

  return (
    <div className="flex item-center space-x-2 px-2">
      <HeadingMenu editor={editor} />
      <ToolbarIconButton
        onClick={handleBold}
        isActive={editor.isActive("bold")}
        title="Bold"
      >
        <Bold className="h-4 w-4" />
      </ToolbarIconButton>
      <ToolbarIconButton
        onClick={handleItalic}
        isActive={editor.isActive("italic")}
        title="Italic"
      >
        <Italic className="h-4 w-4" />
      </ToolbarIconButton>
      <ToolbarIconButton
        onClick={handleUnderline}
        isActive={editor.isActive("underline")}
        title="Underline"
      >
        <Underline className="h-4 w-4" />
      </ToolbarIconButton>

      <Separator orientation="vertical" className="h-7" />

      <ToolbarIconButton
        onClick={handleCode}
        isActive={editor.isActive("code")}
        title="Code"
      >
        <Code className="h-4 w-4" />
      </ToolbarIconButton>

      <Separator orientation="vertical" className="h-7" />
      <AlignMenu editor={editor} />
      <Separator orientation="vertical" className="h-7" />

      <ToolbarIconButton
        onClick={handleBulletList}
        isActive={editor.isActive("bulletList")}
        title="Bullet List"
      >
        <List className="h-4 w-4" />
      </ToolbarIconButton>
      <ToolbarIconButton
        onClick={handleOrderedList}
        isActive={editor.isActive("orderedList")}
        title="Ordered List"
      >
        <ListOrdered className="h-4 w-4" />
      </ToolbarIconButton>
      <ToolbarIconButton
        onClick={handleCodeBlock}
        isActive={editor.isActive("codeBlock")}
        title="Code Block"
      >
        <Braces className="h-4 w-4" />
      </ToolbarIconButton>
      <ToolbarIconButton
        onClick={handleAtSign}
        isActive={false}
        title="@ Mentions"
      >
        <AtSign className="h-4 w-4" />
      </ToolbarIconButton>
    </div>
  );
};
