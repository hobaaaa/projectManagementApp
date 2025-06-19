"use client";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TextEditor } from "@/components/TextEditor";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { secondaryBtnStyles } from "@/app/commonStyles";
import { toast } from "sonner";
import { projects } from "@/utils/projects";
import { Separator } from "@/components/ui/separator";
import { CloseProjectDialog } from "../../components/CloseProjectDialog";
import { DeleteProjectDialog } from "../../components/DeleteProjectDialog";

interface ProjectSettingsFormProps {
  project: IProject;
}

export const ProjectSettingsForm = ({ project }: ProjectSettingsFormProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: project.name,
    description: project.description,
    readme: project.readme,
  });

  const handleUpdateProject = async () => {
    try {
      setIsSaving(true);
      await projects.management.update(project.id, formData);
      toast.success("Project updated successfully.");
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseProject = async () => {
    try {
      setIsSaving(true);
      await projects.management.close(project.id);
      toast.success("Project closed successfully.");
    } catch (error) {
      console.error("Error closing project:", error);
      toast.error("Failed to close project. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProject = async () => {};

  return (
    <>
      <div className="space-y-4 max-w-2xl">
        <div className="space-y-2">
          <Label>Project Name</Label>
          <Input
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label>Project Description</Label>
          <Textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
          />
        </div>
        <div className="space-y-2">
          <Label>README</Label>
          <TextEditor
            content={formData.readme}
            onChange={(text: string) =>
              setFormData((prev) => ({ ...prev, readme: text }))
            }
            isEditable
          />
        </div>
        <Button
          onClick={handleUpdateProject}
          disabled={isSaving}
          className={cn(secondaryBtnStyles)}
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
      <div className="my-20">
        <h1 className="text-xl my-3">Danger Zone</h1>
        <div className="border border-red-500 rounded-md">
          <div className="flex justify-between items-center px-4 py-3">
            <div>
              <p className="text-sm font-medium">Close Project</p>
              <p className="text-sm text-gray-800 dark:text-gray-400">
                Closinga project will disable its workflows & remove it from the
                list of open projects.
              </p>
            </div>
            <Button
              className={cn(
                secondaryBtnStyles,
                "text-red-500 dark:text-red-400"
              )}
              onClick={() => setShowCloseDialog(true)}
            >
              Close This Project
            </Button>
          </div>
          <>
            <Separator className="my-2" />
            <div className="flex justify-between items-center px-4 py-3">
              <div>
                <p className="text-sm font-medium">Delete Project</p>
                <p className="text-sm text-gray-800 dark:text-gray-400">
                  Once you delete a project, there is no going back. Please be
                  certain.
                </p>
              </div>
              <Button
                className={cn(
                  secondaryBtnStyles,
                  "text-red-500 dark:text-red-400"
                )}
                onClick={() => setShowDeleteDialog(true)}
              >
                Delete This Project
              </Button>
            </div>
          </>
        </div>
      </div>
      <CloseProjectDialog
        open={showCloseDialog}
        onOpenChange={setShowCloseDialog}
        onConfirm={handleCloseProject}
      />
      <DeleteProjectDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteProject}
        projectName={project.name}
      />
    </>
  );
};
