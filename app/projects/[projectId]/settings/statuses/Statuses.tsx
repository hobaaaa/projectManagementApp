"use client";
import { primaryBtnStyles } from "@/app/commonStyles";
import { CreateOrEditCustomFieldOptionModal } from "@/components/CustomField/CreateCustomFieldOptionModal";
import { CustomFieldOptions } from "@/components/CustomField/CustomFieldOptions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { compareAndUpdateItems, hasChanges } from "@/utils/array-utils";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  projectId: string;
  items: ICustomFieldData[];
}

export const Statuses = ({ projectId, items: initialItems }: Props) => {
  const [items, setItems] = useState(initialItems);
  const [statuses, setStatuses] = useState(initialItems);
  const [isSaving, setIsSaving] = useState(false);
  const supabase = createClient();

  const hasUnsavedChanges = hasChanges(items, statuses);

  const handleSaveData = async () => {
    try {
      setIsSaving(true);
      const { itemsToAdd, itemsToDelete, itemsToUpdate } =
        compareAndUpdateItems(items, statuses);

      await Promise.all([
        //delete
        itemsToDelete.length > 0 &&
          supabase.from("statuses").delete().in("id", itemsToDelete),
        //update
        itemsToUpdate.length > 0 &&
          supabase.from("statuses").upsert(
            itemsToUpdate.map((item) => ({
              ...item,
              project_id: projectId,
              updated_at: new Date(),
            }))
          ),
        //add new items
        itemsToAdd.length > 0 &&
          supabase.from("statuses").insert(
            itemsToAdd.map((item) => ({
              ...item,
              project_id: projectId,
              updated_at: new Date(),
            }))
          ),
      ]);

      setItems(statuses);

      toast.success("Statuses updated successfully.");
    } catch (error) {
      console.error("Error updating statuses:", error);
      toast.error("Failed to update statuses. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-2">
        <CreateOrEditCustomFieldOptionModal
          title="Create New Status"
          triggerLabel="Create New Status Option"
          handleSubmit={(data) =>
            setStatuses((items) => [
              ...items,
              { id: crypto.randomUUID(), order: items.length, ...data },
            ])
          }
        />
      </div>
      <CustomFieldOptions
        field="status"
        options={statuses}
        setOptions={setStatuses}
      />

      <div className="flex flex-col gap-2 items-end py-4">
        {hasUnsavedChanges && (
          <span className="text-sm text-center text-green-500 w-32">
            unsaved
          </span>
        )}
        <Button
          onClick={handleSaveData}
          className={cn(primaryBtnStyles)}
          disabled={isSaving || !hasUnsavedChanges}
        >
          {isSaving ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </div>
  );
};
