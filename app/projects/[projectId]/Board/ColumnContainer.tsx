"use client";
import React, { useState } from "react";
import { ColumnLabelColor } from "./ColumnLabelColor";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ColumnMenuOptions } from "./ColumnMenuOptions";
import { SortableContext } from "@dnd-kit/sortable";
import { cn } from "@/lib/utils";
import { UniqueIdentifier } from "@dnd-kit/core";
import { TaskItem } from "./TaskItem";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { successBtnStyles } from "@/app/commonStyles";
import { Plus, X } from "lucide-react";

interface Props {
  projectId: string;
  projectName: string;
  tasks: ITaskWithOptions[];
  column: IStatus;
}
export const ColumnContainer = ({
  column,
  tasks: columnTasks,
  projectName,
}: Props) => {
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const handleAddItem = () => {};

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddItem();
    } else if (e.key === "Escape") {
      setShowInput(false);
      setInputValue("");
    }
  };

  return (
    <div className="w-[350px] overflow-x-hidden h-full flex-shrink-0 bg-gray-100 dark:bg-gray-950 rounded-md border border-gray-200 dark:border-gray-800">
      <div className="p-2 space-y-1 flex-shrink-0">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ColumnLabelColor color={column.color} />
            <h1 className="text-sm font-bold">{column.label}</h1>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`px-2 h-4 rounded-full flex justify-center items-center text-[10px] ${
                      column.limit > 0 && columnTasks.length >= column.limit
                        ? "bg-red-200 dark:bg-red-950 text-red-700 dark:text-red-400"
                        : "bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-400"
                    }`}
                  >
                    {columnTasks.length}
                    {""}
                    {column.limit ? `/ ${column.limit}` : ""}
                  </div>
                </TooltipTrigger>
                {column.limit > 0 && columnTasks.length >= column.limit && (
                  <TooltipContent>
                    <p className="text-sm">
                      Column limit{""}
                      {columnTasks.length > column.limit
                        ? "exceeded"
                        : "reached"}
                    </p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>

          <ColumnMenuOptions column={column} />
        </div>
        <div className="text-sx text-gray-500 dark:text-gray-400">
          {column.description}
        </div>
      </div>
      {/* tasks list */}

      <SortableContext
        id={column.id}
        items={columnTasks.map((item) => ({
          ...item,
          id: item.id as UniqueIdentifier,
        }))}
      >
        <div className={cn("flex-1 overflow-y-auto space-y-2 p-2")}>
          {columnTasks.map((item, index) => (
            <TaskItem
              key={item.id}
              item={item}
              projectName={projectName}
              index={index}
            />
          ))}
        </div>
      </SortableContext>

      {/* Add task Section */}
      <div className="p-2 dark:border-gray-800">
        {showInput ? (
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter task title..."
              className="h-8"
              autoFocus
            />
            <Button
              onClick={handleAddItem}
              className={cn(successBtnStyles, "h-8 px-3")}
              disabled={!inputValue.trim()}
            >
              Add
            </Button>
            <Button
              onClick={() => {
                setShowInput(false);
                setInputValue("");
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <Button onClick={() => setShowInput(true)} className="w-full ">
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        )}
      </div>
    </div>
  );
};
