import { Separator } from "@/components/ui/separator";
import React from "react";
import { NewProjectForm } from "./NewProjectForm";

const NewProjectPage = () => {
  return (
    <div className="w-full md:w-[80%] mx-auto p-8">
      <h1 className="text-xl">Create New Project</h1>
      <Separator className="my-4" />
      <NewProjectForm />
    </div>
  );
};

export default NewProjectPage;
