"use client";
import { deleteBtnStyles } from "@/app/commonStyles";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { useState } from "react";
interface ProjectActionsProps {
  project: IProject;
  tab: "active" | "closed" | "all";
  setProjectToClose?: (id: string) => void;
  setProjectToReopen?: (id: string) => void;
  setProjectToDelete?: (project: IProject) => void;
  projectToClose?: string | null;
  projectToReopen?: string | null;
  projectToDelete?: IProject | null;
  anyDialogOpen: boolean;
}
export const ProjectActions = ({
  project,
  tab,
  setProjectToClose,
  setProjectToReopen,
  setProjectToDelete,
  projectToClose,
  projectToReopen,
  projectToDelete,
}: ProjectActionsProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const anyDialogOpen =
    !!projectToClose || !!projectToReopen || !!projectToDelete;
  return (
    <div className="relative">
      {/* If both a Dialog and a DropdownMenu exist in the DOM at the same time,
      it can lead to accessibility conflicts (e.g., overlapping focus traps).
      This logic ensures that the dropdown is removed from the DOM whenever a Dialog is open, preventing such conflicts. */}
      {!anyDialogOpen && (
        <DropdownMenu
          open={dropdownOpen}
          // When the DropdownMenu closes (open === false), if an element inside it (e.g., a <button>) remains focused in the DOM,
          // it can trigger an aria-hidden warning.
          //
          // This block prevents that error by resetting focus in the next animation frame after the dropdown closes.
          //
          // requestAnimationFrame ensures this runs *after* the DOM update,
          // allowing us to safely blur the element and avoid accessibility issues.
          onOpenChange={(open) => {
            setDropdownOpen(open);
            if (!open) {
              requestAnimationFrame(() => {
                if (document.activeElement instanceof HTMLElement) {
                  document.activeElement.blur();
                }
              });
            }
          }}
        >
          <DropdownMenuTrigger className="font-bold">. . .</DropdownMenuTrigger>
          <DropdownMenuContent
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            onCloseAutoFocus={(e) => {
              e.preventDefault();
              setTimeout(() => {
                if (document.activeElement instanceof HTMLElement) {
                  document.activeElement.blur();
                }
              }, 0);
            }}
          >
            {tab === "closed" || (tab === "all" && project.closed) ? (
              <>
                <DropdownMenuItem
                  onClick={() => {
                    // Since setState operations in React are asynchronous,
                    // the DropdownMenu might still be present in the DOM
                    // when the Dialog starts opening—even if the dropdown is already "closed".
                    // This ensures the dropdown is manually closed *before* opening the Dialog,
                    // preventing any DOM overlap or accessibility issues during the transition.
                    setDropdownOpen(false);
                    setProjectToReopen?.(project.id);
                  }}
                >
                  ReOpen
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={cn(deleteBtnStyles)}
                  onClick={() => {
                    setDropdownOpen(false);
                    setProjectToDelete?.(project);
                  }}
                >
                  Delete Permanently
                </DropdownMenuItem>
              </>
            ) : (
              <>
                <DropdownMenuItem asChild>
                  <Link href={`/projects/${project.id}/settings`}>Edit</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={cn(deleteBtnStyles)}
                  onClick={() => {
                    setDropdownOpen(false);
                    setProjectToClose?.(project.id);
                  }}
                >
                  Close
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
