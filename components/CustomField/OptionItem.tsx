"use client";
import { Ellipsis, GripVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { CustomFieldTagRenderer } from "../CustomFieldTagRenderer";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Dispatch, SetStateAction } from "react";
import { CustomOptionForm } from "./CustomOptionForm";
import { Button } from "../ui/button";
import { secondaryBtnStyles } from "@/app/commonStyles";
import { cn } from "@/lib/utils";

interface Props {
  field: string;
  item: ICustomFieldData;
  selectedOptionId: string | undefined;
  hiddenDescription?: boolean;
  openModal: () => void;
  closeModal: () => void;
  setOptionId: Dispatch<SetStateAction<string | undefined>>;
  deleteOption?: (id: string) => void;
  updateOption?: (option: ICustomFieldData) => void;
}

export const OptionItem = ({
  field,
  item,
  selectedOptionId,
  hiddenDescription,
  setOptionId,
  openModal,
  closeModal,
  deleteOption,
  updateOption,
}: Props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    data: {
      type: "option",
      option: item,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const handleUpdateOption = (updatedItem: ICustomFieldData) => {
    updateOption?.(updatedItem);
    closeModal();
    setOptionId(undefined);
  };

  const handleDeleteItem = (id: string) => {
    deleteOption?.(id);
  };

  const isModalOpen = selectedOptionId === item.id;

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="border bg-white dark:bg-slate-950 h-[60px]"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border bg-white dark:bg-slate-950 h-[60px]"
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex gap-4 items-center">
          <span {...attributes} {...listeners}>
            <GripVertical className="w-5 h-5 text-gray-400 dark:text-gray-600 cursor-grabbing" />
          </span>
          <CustomFieldTagRenderer
            color={item.color || ""}
            label={item.label || ""}
          />
          {!hiddenDescription && (
            <div className="hidden md:inline-block text-sm truncate">
              {item.description}
            </div>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Ellipsis className="w-5 h-5 text-gray-400 dark:text-gray-600" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => {
                setOptionId(item.id);
                openModal();
              }}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDeleteItem(item.id)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeModal();
            setOptionId(undefined);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update {field}</DialogTitle>
          </DialogHeader>
          <CustomOptionForm
            color={item.color}
            description={item.description}
            label={item.label}
            onSubmit={(data) => handleUpdateOption({ ...data, id: item.id })}
            submitBtnLabel="Update option"
            cancelButton={
              <Button
                className={cn(secondaryBtnStyles)}
                onClick={() => {
                  closeModal();
                  setOptionId(undefined);
                }}
              >
                Cancel
              </Button>
            }
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
