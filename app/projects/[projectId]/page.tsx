import { ProjectDetails } from "./ProjectDetails";
import { defaultStatuses } from "@/consts/default-options";
import React from "react";

const ProjectDetailsPage = () => {
  return (
    <ProjectDetails
      projectName={"Test Project"}
      projectId={"123"}
      statuses={defaultStatuses as IStatus[]}
    />
  );
};

export default ProjectDetailsPage;
