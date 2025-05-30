"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Edit, ExternalLink } from "lucide-react";
import Link from "next/link";
import React from "react";

interface ProfileViewProps {
  user: IUser;
  isOwnProfile: boolean;
}
export const ProfileView = ({ user, isOwnProfile }: ProfileViewProps) => {
  return (
    <div className="w-[24rem] md:w-[36rem] mx-auto px-6 pb-4">
      <div className="flex justify-between items-center py-6">
        <h1 className="text-2xl">{user.name}</h1>
        {isOwnProfile && (
          <Button variant="outline" asChild>
            <Link href="/profile" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Link>
          </Button>
        )}
      </div>
      <Avatar>
        <AvatarImage src={user.avatar} />
        <AvatarFallback>
          {user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()}
        </AvatarFallback>
      </Avatar>
      {user.description && (
        <div>
          <h2 className="text-lg pt-6 pb-2 font-bold">Bio</h2>
          <p className="text-lg text-muted-foreground">{user.description}</p>
        </div>
      )}

      {user.links && user.links.length > 0 && (
        <div>
          <h2 className="text-lg pt-6 pb-2 font-bold">Links</h2>
          <div className="flex flex-col gap-2">
            {user.links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {link.label} <ExternalLink className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
