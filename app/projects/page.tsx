import { Projects } from "./Projects";
import { AccountDetails } from "./AccountDetails";
import { createClient } from "@/utils/supabase/server";
import { users } from "@/utils/users";
import { redirect } from "next/navigation";
import { projects } from "@/utils/projects";

const ProjectsPage = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const userData = await users.getUser(user.id);
  if (!userData) redirect("/login");

  const userProjects = await projects.getUserProjects(user.id);
  return (
    <div className="w-[90%] flex flex-col md:flex-row mx-auto p-8 gap-4">
      <div className="w-full md:w-72">
        <AccountDetails initialData={userData} />
      </div>
      <div className="flex-1">
        <Projects initialProjects={userProjects} />
      </div>
    </div>
  );
};

export default ProjectsPage;
