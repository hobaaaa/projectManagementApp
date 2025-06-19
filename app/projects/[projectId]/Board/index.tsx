"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Eye, Plus } from "lucide-react";
import { ColumnContainer } from "./ColumnContainer";
import { columns as columnsUtils } from "@/utils/columns";
import { CreateOrEditCustomFieldOptionModal } from "@/components/CustomField/CreateCustomFieldOptionModal";
import { secondaryBtnStyles } from "@/app/commonStyles";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useProjectQueries } from "@/hooks/useProjectQueries";
import { getColumnSortedTasks, sortTasks } from "@/utils/sort";
import { DndContext, DragOverlay, DragStartEvent } from "@dnd-kit/core";
import { TaskItem } from "./TaskItem";
import { createPortal } from "react-dom";
import { TaskDetailsProvider } from "./TaskDetailsContext";

interface Props {
  projectId: string;
  projectName: string;
  statuses: IStatus[];
  hasMinRole: (role: Role) => boolean;
}
export const Board: React.FC<Props> = ({
  projectId,
  projectName,
  statuses,
  hasMinRole,
}) => {
  const [columns, setColumns] = useState(statuses);
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const { projectTasks, reloadProjectTasks } = useProjectQueries(projectId);

  const [tasks, setTasks] = useState<ITaskWithOptions[]>(projectTasks || []);

  const [activeTask, setActiveTask] = useState<ITaskWithOptions | null>(null);

  useEffect(() => {
    setTasks(projectTasks || []);
  }, [projectTasks]);

  const sortedTasks = sortTasks(tasks);

  const getColumnTasks = (statusId: string) => {
    return getColumnSortedTasks(sortedTasks, statusId);
  };

  const handleCreateColumn = async (data: Omit<ICustomFieldData, "id">) => {
    try {
      setIsLoading(true);
      const newColumn = await columnsUtils.createColumn(projectId, data);
      setColumns((prev) => [...prev, newColumn]);
      toast.success("Column created successfully.");
    } catch (error) {
      console.error("Error creating column:", error);
      toast.error("Failed to create column. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskCreated = (newTask: ITaskWithOptions) => {
    setTasks((prev) => [...prev, newTask]);
  };

  const handleColumnHide = (columnId: string) => {
    setHiddenColumns((prev) => new Set([...prev, columnId]));
  };

  const handleColumnUpdate = (updatedColumn: IStatus) => {
    setColumns((prev) =>
      prev.map((status) =>
        status.id === updatedColumn.id ? updatedColumn : status
      )
    );
  };

  const handleColumnDelete = (columnId: string) => {
    setColumns((prev) => prev.filter((status) => status.id !== columnId));
  };

  const handleShowHiddenColumns = () => {
    setHiddenColumns(new Set());
  };
  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "task") {
      setActiveTask(event.active.data.current?.task);
      return;
    }
  };

  const handleTaskUpdate = async (
    taskId: string,
    updates: Partial<ITaskWithOptions>
  ) => {
    try {
      if ("labels" in updates || "size" in updates || "priority" in updates) {
        await reloadProjectTasks();
      } else {
        setTasks((prev) =>
          prev.map((task) =>
            task.id === taskId
              ? { ...task, ...(updates as Partial<ITaskWithOptions>) }
              : task
          )
        );
      }
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task. Please try again.");
    }
  };
  const visibleColumns = columns.filter(
    (column) => !hiddenColumns.has(column.id)
  );

  return (
    <TaskDetailsProvider onTaskUpdate={handleTaskUpdate}>
      <div className="h-[calc(100vh-200px)]">
        <div className="py-1">
          {hiddenColumns.size > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs gap-1.5"
              onClick={handleShowHiddenColumns}
            >
              <Eye className="w-4 h-4 mr-2" />
              Show hiddencolumns ({hiddenColumns.size})
            </Button>
          )}
        </div>
        <div className="flex gap-1 w-full overflow-x-auto py-1">
          <div
            className={cn(
              "flex gap-3",
              hiddenColumns.size > 0
                ? "h-[calc(100vh-175px)]"
                : "h-[calc(100vh-155px)]"
            )}
          >
            <DndContext onDragStart={handleDragStart}>
              {visibleColumns.map((status) => (
                <ColumnContainer
                  key={status.id}
                  column={status}
                  tasks={getColumnTasks(status.id)}
                  projectId={projectId}
                  projectName={projectName}
                  onColumnHide={handleColumnHide}
                  onColumnUpdate={handleColumnUpdate}
                  onColumnDelete={handleColumnDelete}
                  onTaskCreated={handleTaskCreated}
                  hasMinRole={hasMinRole}
                />
              ))}

              {typeof document !== "undefined" &&
                createPortal(
                  <DragOverlay>
                    {activeTask && (
                      <TaskItem
                        item={activeTask}
                        projectName={projectName}
                        index={0}
                      />
                    )}
                  </DragOverlay>,
                  document.body
                )}
            </DndContext>
          </div>
          <CreateOrEditCustomFieldOptionModal
            title="New Column"
            handleSubmit={handleCreateColumn}
            triggerBtn={
              <Button
                className={cn(secondaryBtnStyles, "w-8 h-8 p-2 mr-4")}
                disabled={isLoading}
              >
                <Plus />
              </Button>
            }
          />
        </div>
      </div>
    </TaskDetailsProvider>
  );
};
