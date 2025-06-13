"use client";
import { Input } from "@/components/ui/input";
import { Loader2, User } from "lucide-react";
import { RoleSelect } from "./RoleSelect";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { successBtnStyles } from "@/app/commonStyles";
import { useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { toast } from "sonner";
import { createClient } from "@/utils/supabase/client";

interface Props {
  projectName: string;
  projectId: string;
  onMemberAdded?: (member: MemberWithUser) => void;
  currentUserRole: Role;
  createdBy: string;
  members: MemberWithUser[];
}
export const InviteUsers = ({
  projectId,
  projectName,
  onMemberAdded,
  currentUserRole,
  createdBy,
  members,
}: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResult, setSearchResult] = useState<IUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [role, setRole] = useState<Role>("read");
  const [isInviting, setIsInviting] = useState(false);

  const supabase = createClient();

  const debouncedSearch = useDebounce(async (term: string) => {
    if (term.length < 2) {
      setSearchResult([]);
      return;
    }

    setIsSearching(true);

    try {
      const excludedMembers = [
        ...members.map((member) => member.user_id),
        createdBy,
      ];

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .ilike("name", `%${term}%`)
        .not("id", "in", `(${excludedMembers.join(",")})`)
        .limit(5);

      if (error) throw error;

      setSearchResult((data as IUser[]) || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to search users. Please try again.");
    } finally {
      setIsSearching(false);
    }
  }, 1000);

  const handleInviteUser = async () => {
    if (!selectedUser) return;

    try {
      setIsInviting(true);

      const memberDetails = {
        id: crypto.randomUUID(),
        project_id: projectId,
        user_id: selectedUser.id,
        role,
        invitationStatus: "invited",
        invited_at: new Date(),
      };

      const { error: memberError } = await supabase
        .from("project_members")
        .insert(memberDetails);

      if (memberError) throw memberError;

      //send invitation email
    } catch (error) {
      console.error("Error inviting user:", error);
      toast.error("Failed to send invitation. Please try again.");
    } finally {
      setIsInviting(false);
    }
  };

  if (currentUserRole !== "admin" && currentUserRole !== "owner") return null;

  return (
    <div className="py-8">
      <h1 className="text-xl mb-4">Invite Users</h1>
      <div className="flex items-center gap-2">
        <div className="relative ml-auto flex-1">
          <User className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
          {isSearching && (
            <Loader2 className="absolute right-2.5 top-2 w-4 h-4 animate-spin" />
          )}
          <Input
            placeholder="Search by name..."
            className="w-full rounded-sm bg-background pl-8 h-8"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              debouncedSearch(e.target.value);
            }}
          />
          {searchResult.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-background -border rounded-sm shadow-lg z-10">
              {searchResult.map((user) => (
                <div
                  key={user.id}
                  className="p-2 hover:bg-muted cursor-pointer"
                  onClick={() => {
                    setSelectedUser(user);
                    setSearchTerm(user.name);
                    setSearchResult([]);
                  }}
                >
                  {user.name}
                </div>
              ))}
            </div>
          )}
        </div>
        <RoleSelect value={role} onValueChange={() => {}} />
        <Button
          onClick={handleInviteUser}
          disabled={!selectedUser || isInviting}
          className={cn(successBtnStyles, "px-3")}
        >
          Invite
        </Button>
      </div>
    </div>
  );
};
