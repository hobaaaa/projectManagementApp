"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { secondaryBtnStyles, successBtnStyles } from "../commonStyles";
import { useModalDialog } from "@/hooks/useModalDialog";
import { CustomFieldOptions } from "@/components/CustomField/CustomFieldOptions";
import { CreateOrEditCustomFieldOptionModal } from "@/components/CustomField/CreateCustomFieldOptionModal";
import {
  defaultPriorities,
  defaultSizes,
  defaultStatuses,
  defaultLabels,
} from "@/consts/default-options";
import { Plus } from "lucide-react";
import { CreateOrEditLabelForm } from "@/components/Label/CreateOrEditLabelForm";
import { LabelList } from "@/components/Label/LabelList";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { projects } from "@/utils/projects";
import { useRouter } from "next/navigation";

interface Props {
  projectDetails: {
    name: string;
    description: string;
    readme: string;
  };
}
export const CreateProjectModal = ({ projectDetails }: Props) => {
  const { isModalOpen, openModal, closeModal } = useModalDialog();
  const router = useRouter();
  const [statuses, setStatuses] = useState(defaultStatuses);
  const [sizes, setSizes] = useState(defaultSizes);
  const [priorities, setPriorities] = useState(defaultPriorities);
  const [labels, setLabels] = useState(defaultLabels);
  const [showNewLabelCard, setShowNewLabelCard] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [skipDefaultOptions, setSkipDefaultOptions] = useState(false);

  const handleAddNewOptionItem = (
    data: Omit<ICustomFieldData, "id">,
    state: CustomFieldDBTableName
  ) => {
    switch (state) {
      case "statuses":
        setStatuses([...statuses, { id: crypto.randomUUID(), ...data }]);
        break;
      case "sizes":
        setSizes([...sizes, { id: crypto.randomUUID(), ...data }]);
        break;
      case "priorities":
        setPriorities([...priorities, { id: crypto.randomUUID(), ...data }]);
        break;
      default:
        break;
    }
  };

  const handleAddNewLabelItem = (data: ICustomFieldData) => {
    setLabels([...labels, data]);
    setShowNewLabelCard(false);
  };

  const handleRemoveLabelItem = (id: string) => {
    setLabels(labels.filter((item) => item.id !== id));
  };

  const handleCreateProject = async () => {
    try {
      setIsCreating(true);
      const supabase = createClient();

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const projectData = {
        ...projectDetails,
        ...(skipDefaultOptions
          ? {}
          : {
              statuses,
              sizes,
              priorities,
              labels,
            }),
      };

      const project = await projects.management.create(
        projectData as ProjectWithOptions,
        session.user.id
      );
      toast.success("Project created successfully.");
      closeModal();
      router.push(`/projects/${project.id}`);
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create project. Please try again."
      );
    } finally {
      setIsCreating(false);
    }
  };

  const AddNewOptionBtn = (
    <Button className={cn(secondaryBtnStyles, "h-7 px-2 rounded-sm mr-2")}>
      <Plus className="w-4 h-4 mr-1" />
      New
    </Button>
  );

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogTrigger
        onClick={openModal}
        className={cn(
          successBtnStyles,
          "w-28 flex items-center justify-center",
          "disabled:cursor-not-allowed disabled:opacity-40"
        )}
        disabled={!projectDetails.name}
      >
        Continue
      </DialogTrigger>
      <DialogContent className="md:min-w-[90%] lg:min-w-[70%] max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>{projectDetails.name}</DialogTitle>
        </DialogHeader>

        <DialogDescription>
          Customize default options for your project.
        </DialogDescription>
        <Separator />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto p-2">
          {/* 
      The CustomFieldOptions component is used to manage the options for a specific custom field (e.g., "status", "priority").

      Props:
      - field: The custom field key (e.g., "status")
      - title: Optional heading for the section
      - description: Optional helper text or explanation
      - options: List of selectable values for the custom field (e.g., ["In Progress", "Done", ...]) */}
          <CustomFieldOptions
            field="size"
            title="Sizes"
            options={sizes}
            setOptions={setSizes}
            hiddenDescription
            embeddedCreateOptionEle={
              <CreateOrEditCustomFieldOptionModal
                title="Create new size option"
                handleSubmit={(data) => handleAddNewOptionItem(data, "sizes")}
                triggerBtn={AddNewOptionBtn}
              />
            }
          />
          <CustomFieldOptions
            field="priority"
            title="Priorities"
            options={priorities}
            setOptions={setPriorities}
            hiddenDescription
            embeddedCreateOptionEle={
              <CreateOrEditCustomFieldOptionModal
                title="Create new priority option"
                handleSubmit={(data) => {
                  handleAddNewOptionItem(data, "priorities");
                }}
                triggerBtn={AddNewOptionBtn}
              />
            }
          />
          <CustomFieldOptions
            field="status"
            title="Columns"
            options={statuses}
            setOptions={setStatuses}
            hiddenDescription
            embeddedCreateOptionEle={
              <CreateOrEditCustomFieldOptionModal
                title="Create new status option"
                handleSubmit={(data) => {
                  handleAddNewOptionItem(data, "statuses");
                }}
                triggerBtn={AddNewOptionBtn}
              />
            }
          />
          <div>
            <div className="flex justify-between items-center">
              <h1 className="text-lg py-3">Labels</h1>
              <Button
                onClick={() => setShowNewLabelCard(true)}
                className={cn(secondaryBtnStyles, "h-7 px-2 rounded-sm mr-2")}
              >
                <Plus className="w-4 h-4 mr-1" />
                New
              </Button>
            </div>
            {showNewLabelCard && (
              <CreateOrEditLabelForm
                save={(data) => handleAddNewLabelItem(data)}
                cancel={() => setShowNewLabelCard(false)}
              />
            )}
            <div className="rounded border">
              <LabelList
                labels={labels}
                hiddenDescription
                onLabelDeleted={handleRemoveLabelItem}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Checkbox
            checked={skipDefaultOptions}
            onClick={() => setSkipDefaultOptions(!skipDefaultOptions)}
          />
          <Label>Skip Default options. I will create my own options</Label>
        </div>
        <DialogFooter>
          <div className="flex justify-end">
            <Button
              onClick={handleCreateProject}
              className={cn(successBtnStyles, "w-28")}
              disabled={isCreating}
            >
              {isCreating ? "Creating ..." : "Create"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
