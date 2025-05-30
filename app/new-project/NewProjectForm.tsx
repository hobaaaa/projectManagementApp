"use client";

import { TextEditor } from "@/components/TextEditor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import { CreateProjectModal } from "./CreateProjectModal";

export const NewProjectForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [readme, setReadme] = useState("");

  return (
    <div className="space-y-4">
      <div className="space-y-1 max-w-96">
        <Label className="text-xs">Project Name</Label>
        <Input
          placeholder="Name of project"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
        />
      </div>
      <div className="space-y-1 max-w-[28rem]">
        <Label className="text-xs">Short description</Label>
        <Textarea
          placeholder="A short description about this project"
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
          rows={8}
        />
      </div>
      <div className="space-y-1 max-w-[40rem]">
        <Label className="text-xs">README</Label>
        <TextEditor
          content={readme}
          onChange={(text) => setReadme(text)}
          isEditable
        />
      </div>
      <div className="flex">
        <CreateProjectModal
          projectDetails={{
            name,
            description,
            readme,
          }}
        />
      </div>
    </div>
  );
};
