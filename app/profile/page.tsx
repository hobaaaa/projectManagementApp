import { createClient } from "@/utils/supabase/server";
import { users } from "@/utils/users";
import { redirect } from "next/navigation";
import React from "react";
import { ProfileForm } from "./ProfileForm";

const PublicProfilePage = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const userData = await users.getUser(user.id);

  if (!userData) {
    redirect("/login");
  }

  return <ProfileForm initialData={userData} />;
};

export default PublicProfilePage;
