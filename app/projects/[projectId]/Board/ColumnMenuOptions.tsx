import { useModalDialog } from "@/hooks/useModalDialog";
import React, { useState } from "react";
import { columns } from "@/utils/columns";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, EyeOff, Pencil, Trash } from "lucide-react";
import { Icons } from "@/components/Icons";
import { CustomOptionForm } from "@/components/CustomField/CustomOptionForm";
import { Button } from "@/components/ui/button";
import { secondaryBtnStyles, successBtnStyles } from "@/app/commonStyles";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

interface Props {
  column: IStatus;
  onColumnUpdate?: (column: IStatus) => void;
  onColumnDelete?: (columnId: string) => void;
  onColumnHide?: (columnId: string) => void;
}
export const ColumnMenuOptions = ({
  column,
  onColumnUpdate,
  onColumnDelete,
  onColumnHide,
}: Props) => {
  const { isModalOpen, openModal, closeModal } = useModalDialog();
  const [limit, setLimit] = useState(column.limit);
  const [optionType, setOptionType] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenModal = (type: string) => {
    setOptionType(type);
    setTimeout(() => {
      openModal();
    }, 50); // Dropdown kapanması için küçük bir gecikme
  };

  const handleUpdateLimit = async () => {
    if (limit < 1 || limit === column.limit) return;

    try {
      setIsLoading(true);
      const updatedColumn = await columns.updateLimit(column.id, limit);
      onColumnUpdate?.(updatedColumn);
      toast.success("Column limit updated successfully.");
      closeModal();
    } catch (error) {
      console.error("Error updating limit:", error);
      toast.error("Failed to update limit. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateDetails = async (data: Omit<ICustomFieldData, "id">) => {
    try {
      setIsLoading(true);
      const updatedColumn = await columns.updateDetails(column.id, data);
      onColumnUpdate?.(updatedColumn);
      toast.success("Column details updated successfully.");
      closeModal();
    } catch (error) {
      console.error("Error updating details:", error);
      toast.error("Failed to update details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteColumn = async () => {
    try {
      setIsLoading(true);
      await columns.deleteColumn(column.id);
      onColumnDelete?.(column.id);
      toast.success("Column deleted successfully.");
      closeModal();
    } catch (error) {
      console.error("Error deleting column:", error);
      toast.error("Failed to delete column. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog
        open={isModalOpen}
        onOpenChange={(isOpen) => !isOpen && closeModal()}
      >
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none focus:ring-0">
            <Ellipsis />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-44">
            <DropdownMenuItem onClick={() => handleOpenModal("limit")}>
              <Icons.number className="w-3 h-3 mr-2 fill-gray-900 dark:fill-slate-50" />
              <span className="text-xs">Set Limit</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleOpenModal("details")}>
              <Pencil className="w-3 h-3 mr-2" />
              <span className="text-xs">Edit Details</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                onColumnHide?.(column.id);
              }}
            >
              <EyeOff className="w-3 h-3 mr-2" />
              <span className="text-xs">Hide from view</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-500"
              onClick={() => handleOpenModal("delete")}
            >
              <Trash className="w-3 h-3 mr-2" />
              <span className="text-xs">Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {optionType === "details" && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Option</DialogTitle>
            </DialogHeader>
            <CustomOptionForm
              color={column.color}
              description={column.description}
              label={column.label}
              onSubmit={handleUpdateDetails}
              submitBtnLabel="Update Option"
              cancelButton={
                <Button
                  className={cn(secondaryBtnStyles)}
                  onClick={closeModal}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              }
            />
          </DialogContent>
        )}

        {optionType === "limit" && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {column.limit === 0 ? "Set column limit" : "Edit column limit"}
              </DialogTitle>
            </DialogHeader>
            <Separator className="my-2" />
            <Label className="mb-0 pb-0">Column Limit</Label>
            <Input
              type="number"
              value={limit}
              onChange={(e) => setLimit(Number(e.currentTarget.value))}
              className="h-8"
            />
            <Label className="text-xs text-gray-500">
              A limit on the number of items in a column
            </Label>
            <Separator className="my-2" />
            <div className="flex justify-end gap-2">
              <Button
                className={cn(secondaryBtnStyles, "px-3 h-7")}
                onClick={() => {
                  closeModal();
                  setOptionType("");
                }}
              >
                Cancel
              </Button>
              <Button
                className={cn(successBtnStyles, "px-3 h-7")}
                onClick={handleUpdateLimit}
                disabled={isLoading || limit < 1 || limit === column.limit}
              >
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </div>
          </DialogContent>
        )}

        {optionType === "delete" && (
          <DialogContent className="max-w-96 gap-2">
            <DialogHeader>
              <DialogTitle>
                Are you sure you want to delete <br />{" "}
                {column.label.toUpperCase()} column
              </DialogTitle>
              <DialogDescription>
                This action cannot be undone
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                className={cn(secondaryBtnStyles, "bg-gray-50 px-3 h-7")}
                onClick={() => {
                  closeModal();
                  setOptionType("");
                  setLimit(column.limit);
                }}
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                className={cn(
                  "text-red-600 dark:text-red-300 px-3 h-7 hover:bg-red-800 dark:hover:bg-red-600 hover:text-white dark:hover:text-white"
                )}
                onClick={handleDeleteColumn}
                disabled={isLoading}
              >
                {isLoading ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};
