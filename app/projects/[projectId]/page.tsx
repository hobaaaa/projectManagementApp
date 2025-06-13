import { redirect } from "next/navigation";
import { ProjectDetails } from "./ProjectDetails";
import { createClient } from "@/utils/supabase/server";
interface Props {
  params: Promise<{ projectId: string }>;
}

const ProjectDetailsPage = async ({ params }: Props) => {
  const { projectId } = await params;
  const supabase = await createClient();

  const { data: project, error } = await supabase
    .from("projects")
    .select(
      `
      name, 
      statuses (
      id, 
      label, 
      description, 
      color, 
      order, 
      limit
      )
      `
    )
    .order("order", { referencedTable: "statuses" })
    .eq("id", projectId)
    .single();

  if (error || !project) redirect("/projects");
  return (
    <ProjectDetails
      projectName={project.name}
      projectId={projectId}
      statuses={project.statuses as IStatus[]}
    />
  );
};

export default ProjectDetailsPage;
