import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";

interface Props {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ role: Role }>;
}
const InvitePage = async ({ params, searchParams }: Props) => {
  const supabase = await createClient();
  const { projectId } = await params;
  const { role } = await searchParams;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/invites/${projectId}?role=${role}`);
  }

  const { data: projectMember, error: memberCheckError } = await supabase
    .from("project_members")
    .select("*")
    .eq("project_id", projectId)
    .eq("user_id", user.id)
    .eq("invitationStatus", "invited")
    .single();

  if (memberCheckError || !projectMember) {
    notFound();
  }

  const { error: updateError } = await supabase
    .from("project_members")
    .update({
      invitationStatus: "accepted",
      joined_at: new Date().toISOString(),
    })
    .eq("project_id", projectId)
    .eq("user_id", user.id);

  if (updateError) throw updateError;

  redirect(`/projects/${projectId}`);
};

export default InvitePage;
