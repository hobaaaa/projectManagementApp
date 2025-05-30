import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { LabelBadge } from "./LabelBadge";
import { defaultFieldColor } from "@/consts/colors";
import { Button } from "../ui/button";
import { secondaryBtnStyles } from "@/app/commonStyles";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { CreateOrEditLabelForm } from "./CreateOrEditLabelForm";

interface Props {
  labels: ICustomFieldData[];
  hiddenDescription?: boolean;
  onLabelUpdated?: (label: ICustomFieldData) => void;
  onLabelDeleted?: (lableId: string) => void;
  isLoading?: boolean;
}
export const LabelList = ({
  labels,
  hiddenDescription,
  onLabelUpdated,
  onLabelDeleted,
  isLoading,
}: Props) => {
  const [labelId, setLabelId] = useState("");
  const searchParams = useSearchParams();

  useEffect(() => {
    const labelIdFromParams = searchParams.get("labelId");
    if (labelIdFromParams) {
      setLabelId(labelIdFromParams);
    }
  }, [searchParams]);

  const handleUpdateLabel = async (data: ICustomFieldData) => {
    onLabelUpdated?.(data);
  };

  const handleDeleteLabel = (id: string) => {
    onLabelDeleted?.(id);
  };

  return (
    <div className="w-full rounded-md shadow-md">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {labels.map((label) => (
            <React.Fragment key={label.id}>
              <tr>
                <td className="p-4 whitespace-nowrap">
                  <LabelBadge
                    labelText={label.label || ""}
                    description={label.description || ""}
                    color={label.color || defaultFieldColor}
                  />
                </td>
                {!hiddenDescription && (
                  <td className="p-4 text-sm text-gray-500 dark:text-gray-400 truncate hidden md:block">
                    {label.description}
                  </td>
                )}
                <td className="p-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="relative inline-block text-left">
                    <div className="space-x-1 hidden lg:flex">
                      <Button
                        className={cn(
                          secondaryBtnStyles,
                          "text-xs h-8 rounded-sm"
                        )}
                        onClick={() => setLabelId(label.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        className={cn(
                          secondaryBtnStyles,
                          "text-xs text-red-600 dark:text-red-300 h-8 rounded-sm"
                        )}
                        onClick={() => handleDeleteLabel(label.id)}
                      >
                        Delete
                      </Button>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="lg:hidden">
                        <Ellipsis />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => setLabelId(label.id)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteLabel(label.id)}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
              {labelId === label.id && (
                <tr>
                  <td colSpan={4} className="p-4">
                    <CreateOrEditLabelForm
                      mode="edit"
                      data={label}
                      cancel={() => setLabelId("")}
                      save={handleUpdateLabel}
                      isSubmitting={isLoading}
                    />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};
