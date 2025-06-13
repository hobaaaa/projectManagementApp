import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import React from "react";
import { SettingsLayout } from "./SettingsLayout";
import { ProjectSettingsForm } from "./ProjectSettingsForm";

interface Props {
  params: Promise<{ projectId: string }>;
}
const SettingsPage = async ({ params }: Props) => {
  const { projectId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  if (error || !project) redirect("/projects");

  return (
    <SettingsLayout title="Project Settings">
      <ProjectSettingsForm project={project} />
    </SettingsLayout>
  );
};

export default SettingsPage;
