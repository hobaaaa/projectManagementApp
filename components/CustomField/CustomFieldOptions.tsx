"use client";
import React, { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { OptionItem } from "./OptionItem";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  TouchSensor,
  useSensor,
  useSensors,
  MouseSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { Dialog } from "../ui/dialog";
import { useModalDialog } from "@/hooks/useModalDialog";
import { CustomFieldOptionOverlay } from "../DragOverlays/CustomFieldOptionOverlay";

interface Props {
  field: string;
  title?: string;
  description?: string;
  options: ICustomFieldData[];
  setOptions?: Dispatch<SetStateAction<ICustomFieldData[]>>;
  embeddedCreateOptionEle?: ReactNode;
  hiddenDescription?: boolean;
}

export const CustomFieldOptions = ({
  field,
  title,
  description,
  options,
  setOptions,
  embeddedCreateOptionEle,
  hiddenDescription,
}: Props) => {
  const { isModalOpen, openModal, closeModal } = useModalDialog();
  const [activeOption, setActiveOption] = useState<ICustomFieldData | null>(
    null
  );
  const [optionId, setOptionId] = useState<string | undefined>(undefined);
  const onDragStart = (e: DragStartEvent) => {
    if (e.active.data.current?.type === "option") {
      setActiveOption(e.active.data.current?.option);
    }
  };
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const onDragEnd = (e: DragEndEvent) => {
    setActiveOption(null);
    const { active, over } = e;
    if (!over) return;
    if (active.id !== over.id) {
      setOptions?.((prevOptions) => {
        const activeIndex = prevOptions.findIndex(
          (option) => option.id === active.id
        );
        const overIndex = prevOptions.findIndex(
          (option) => option.id === over.id
        );
        const reorderedItems = arrayMove(prevOptions, activeIndex, overIndex);

        return reorderedItems.map((item, index) => ({
          ...item,
          order: index,
        }));
      });
    }
  };

  const handleUpdateOption = (option: ICustomFieldData) => {
    setOptions?.((prevOptions) =>
      prevOptions.map((foundOption) =>
        foundOption.id === option.id ? option : foundOption
      )
    );
    closeModal();
    setOptionId(undefined);
  };

  const handleDeleteItem = (id: string) => {
    setOptions?.((prevOptions) => prevOptions.filter((item) => item.id !== id));
  };
  return (
    <>
      <Dialog
        open={isModalOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) closeModal();
        }}
      >
        <div>
          <div className="flex justify-between items-center">
            <h1 className="text-lg py-3">{title || "Options"}</h1>
            {embeddedCreateOptionEle}
          </div>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {description}
            </p>
          )}
          <div className="border rounded-sm">
            <DndContext
              sensors={sensors}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            >
              <SortableContext
                items={options.map((item) => item.id)}
                strategy={verticalListSortingStrategy}
              >
                {options.map((item) => (
                  <OptionItem
                    key={item.id}
                    item={item}
                    field={field}
                    selectedOptionId={optionId}
                    closeModal={closeModal}
                    openModal={openModal}
                    setOptionId={setOptionId}
                    deleteOption={handleDeleteItem}
                    updateOption={handleUpdateOption}
                  />
                ))}
              </SortableContext>

              {typeof window === "object" &&
                createPortal(
                  <DragOverlay>
                    {activeOption && (
                      <CustomFieldOptionOverlay
                        label={activeOption.label}
                        color={activeOption.color}
                        description={activeOption.description}
                        hiddenDescription={hiddenDescription}
                      />
                    )}
                  </DragOverlay>,
                  document.body
                )}
            </DndContext>
          </div>
        </div>
      </Dialog>
    </>
  );
};
