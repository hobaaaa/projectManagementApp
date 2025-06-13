import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import React from "react";
import { SettingsLayout } from "../SettingsLayout";
import { Statuses } from "./Statuses";

interface Props {
  params: Promise<{
    projectId: string;
  }>;
}
const StatusesPage = async ({ params }: Props) => {
  const { projectId } = await params;
  const supabase = await createClient();

  const { data: statuses, error } = await supabase
    .from("statuses")
    .select("*")
    .eq("project_id", projectId)
    .order("order", { ascending: true });

  if (error) {
    console.error("Error loading statuses: ", error);
    redirect("/projects");
  }

  return (
    <SettingsLayout title="Status Settings">
      <Statuses projectId={projectId} items={statuses || []} />
    </SettingsLayout>
  );
};

export default StatusesPage;
