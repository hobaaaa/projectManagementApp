import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis, LineChart, Settings } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Board } from "./Board";

interface ProjectDetailsProps {
  projectName: string;
  projectId: string;
  statuses: IStatus[];
}
export const ProjectDetails = ({
  projectName,
  projectId,
  statuses,
}: ProjectDetailsProps) => {
  return (
    <div className="w-full overflow-x-auto px-2 h-[calc(100vh-65px)]">
      <div className="w-full flex justify-between items-center gap-6 bg-white dark:bg-gray-950 border py-4 px-8 h-[65px]">
        <h1
          title="projectName"
          className="text-xl text-gray-600 dark:text-gray-400"
        >
          {projectName}
        </h1>
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none focus:ring-0">
              <Ellipsis className="text-gray-600 dark:text-gray-400" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-44">
              <Link href={`/projects/${projectId}/settings`}>
                <DropdownMenuItem className="text-gray-600 dark:text-gray-400">
                  <Settings className="w-3 h-3 mr-2" />
                  <span className="text-xs">Settings</span>
                </DropdownMenuItem>
              </Link>
              <Link href={`/projects/${projectId}/insights`}>
                <DropdownMenuItem className="text-gray-600 dark:text-gray-400">
                  <LineChart className="w-3 h-3 mr-2" />
                  <span className="text-xs">Insights</span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="h-[calc(100vh-130px)]">
        <Board
          projectId={projectId}
          projectName={projectName}
          statuses={statuses}
        />
      </div>
    </div>
  );
};
