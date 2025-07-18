import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  ChevronDown,
} from "lucide-react";
import { Editor } from "@tiptap/react";
import { cn } from "@/lib/utils";

const AlignMenu = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null;
  const handleAlignLeft = () => {
    editor.chain().focus().setTextAlign("left").run();
  };
  const handleAlignCenter = () => {
    editor.chain().focus().setTextAlign("center").run();
  };
  const handleAlignRight = () => {
    editor.chain().focus().setTextAlign("right").run();
  };
  const handleAlignJustify = () => {
    editor.chain().focus().setTextAlign("justify").run();
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        title="Text align"
        className="p-1 rounded-sm flex items-center gap-0 hover:bg-slate-200 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-400"
      >
        <AlignJustify className="w-4 h-4" />
        <ChevronDown className="w-4 h-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={handleAlignLeft}
          className={cn(
            editor.isActive({ textAlign: "left" })
              ? "bg-slate-200 dark:bg-slate-700"
              : "bg-transparent"
          )}
        >
          <AlignLeft className="w-4 h-4 mr-2" />
          <span className="text-xs">Align Left</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleAlignCenter}
          className={cn(
            editor.isActive({ textAlign: "center" })
              ? "bg-slate-200 dark:bg-slate-700"
              : "bg-transparent"
          )}
        >
          <AlignCenter className="w-4 h-4 mr-2" />
          <span className="text-xs">Align Center</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleAlignRight}
          className={cn(
            editor.isActive({ textAlign: "right" })
              ? "bg-slate-200 dark:bg-slate-700"
              : "bg-transparent"
          )}
        >
          <AlignRight className="w-4 h-4 mr-2" />
          <span className="text-xs">Align Right</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleAlignJustify}
          className={cn(
            editor.isActive({ textAlign: "justify" })
              ? "bg-slate-200 dark:bg-slate-700"
              : "bg-transparent"
          )}
        >
          <AlignJustify className="w-4 h-4 mr-2" />{" "}
          <span className="text-xs">Align Justify</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AlignMenu;
