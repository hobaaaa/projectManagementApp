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
import { tasks as taskUtils } from "@/utils/tasks";
import { SortableContext } from "@dnd-kit/sortable";
import { cn } from "@/lib/utils";
import { UniqueIdentifier } from "@dnd-kit/core";
import { TaskItem } from "./TaskItem";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { successBtnStyles } from "@/app/commonStyles";
import { Plus, X } from "lucide-react";
import { getLowestColumnPosition } from "@/utils/sort";
import { toast } from "sonner";
import { useAccessStore } from "@/stores/useAccessStore";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface Props {
  projectId: string;
  projectName: string;
  tasks: ITaskWithOptions[];
  column: IStatus;
  onColumnHide?: (columnId: string) => void;
  onColumnUpdate?: (column: IStatus) => void;
  onColumnDelete?: (columnId: string) => void;
  onTaskCreated?: (task: ITaskWithOptions) => void;
  hasMinRole: (role: Role) => boolean;
}

export const ColumnContainer = ({
  column,
  tasks: columnTasks,
  projectName,
  onColumnHide,
  onColumnUpdate,
  onColumnDelete,
  onTaskCreated,
  projectId,
  hasMinRole,
}: Props) => {
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const { user } = useCurrentUser();

  const userRole = useAccessStore((state) => state.roles[projectId]);

  const handleAddItem = async () => {
    if (!inputValue.trim() || isCreating || !user) return;

    try {
      setIsCreating(true);

      // Get lowest position as the new position and place it at the bottom
      const newPosition = getLowestColumnPosition(columnTasks);

      const task = await taskUtils.create({
        project_id: projectId,
        status_id: column.id,
        title: inputValue.trim(),
        description: "",
        created_by: user.id,
        statusPosition: newPosition,
      });

      toast.success("Task created successfully.");

      onTaskCreated?.({ ...task, assignees: [] });
      setInputValue("");
      setShowInput(false);
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Failed to create task. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddItem();
    } else if (e.key === "Escape") {
      setShowInput(false);
      setInputValue("");
    }
  };

  return (
    <div className="w-[350px] overflow-x-hidden h-full flex-shrink-0 bg-gray-100 dark:bg-gray-950 rounded-md border border-gray-200 dark:border-gray-800 flex flex-col">
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

          <ColumnMenuOptions
            projectId={projectId}
            column={column}
            onColumnHide={onColumnHide}
            userRole={userRole}
            onColumnDelete={onColumnDelete}
            onColumnUpdate={onColumnUpdate}
            hasMinRole={hasMinRole}
          />
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
      {hasMinRole("write") && (
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
                disabled={!inputValue.trim() || isCreating}
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
            <Button
              onClick={() => setShowInput(true)}
              className="w-full h-8 bg-transparent text-gray-500 hover:bg-gray-200 hover:dark:bg-gray-900 dark:text-gray-400 flex justify-start "
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
