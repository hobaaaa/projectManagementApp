"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Eye, Plus } from "lucide-react";
import { ColumnContainer } from "./ColumnContainer";
import { CreateOrEditCustomFieldOptionModal } from "@/components/CustomField/CreateCustomFieldOptionModal";
import { secondaryBtnStyles } from "@/app/commonStyles";

interface Props {
  projectId: string;
  projectName: string;
  statuses: IStatus[];
}
export const Board: React.FC<Props> = ({
  projectId,
  projectName,
  statuses,
}) => {
  const handleCreateColumn = async (data: Omit<ICustomFieldData, "id">) => {
    console.log(data);
  };
  return (
    <div className="h-[calc(100vh-200px)]">
      <div className="py-1">
        <Button
          variant="outline"
          size="sm"
          className="h-7 px-2 text-xs gap-1.5"
          onClick={() => {}}
        >
          <Eye className="w-4 h-4 mr-2" />
          Show hiddencolumns (0)
        </Button>
      </div>
      <div className="flex gap-1 w-full overflow-x-auto py-1">
        <div className={cn("flex gap-3", "h-[calc(100vh-175px)]")}>
          {statuses.map((status) => (
            <ColumnContainer
              key={status.id}
              column={status}
              tasks={[]}
              projectId={projectId}
              projectName={projectName}
            />
          ))}
        </div>
        <CreateOrEditCustomFieldOptionModal
          title="New Column"
          handleSubmit={handleCreateColumn}
          triggerBtn={
            <Button className={cn(secondaryBtnStyles, "w-8 h-8 p-2 mr-4")}>
              <Plus />
            </Button>
          }
        />
      </div>
    </div>
  );
};
