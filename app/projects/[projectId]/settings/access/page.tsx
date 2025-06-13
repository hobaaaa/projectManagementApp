import { createClient } from "@/utils/supabase/server";
import { SettingsLayout } from "../SettingsLayout";
import { AccessContainer } from "./AccessContainer";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{
    projectId: string;
  }>;
}
const AccessPage = async ({ params }: Props) => {
  const { projectId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [
    { data: project, error: projectError },
    { data: members, error: membersError },
  ] = await Promise.all([
    supabase.from("projects").select("*").eq("id", projectId).single(),
    supabase
      .from("project_members")
      .select("*, user:users (id,name,email,avatar)")
      .eq("project_id", projectId),
  ]);

  if (projectError || membersError || !project) redirect("/projects");

  const isCreator = project.created_by === user.id;
  const currentMember = members?.find((m) => m.user_id === user.id);
  const currentUserRole = isCreator ? "owner" : currentMember?.role || "read";

  return (
    <SettingsLayout title="Who has access">
      <AccessContainer
        projectId={projectId}
        projectName={project.name}
        initialMembers={members || []}
        currentUserId={user.id}
        currentUserRole={currentUserRole}
        createdBy={project.created_by}
      />
    </SettingsLayout>
  );
};

export default AccessPage;
