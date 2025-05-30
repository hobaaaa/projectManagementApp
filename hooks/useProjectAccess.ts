import { useEffect } from "react";
import { useAccessStore } from "@/stores/useAccessStore";
import { ProjectAction } from "@/consts";

interface UseProjectAccessProps {
  projectId: string;
}

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Hook to get access control info for a project
 *
 * @param {string} projectId the id of the project
 * @returns {object} an object with the following properties:
 *  - `can(action: ProjectAction)`: a function that returns true if the user has the given action permission
 *  - `hasMinRole(minRole: Role)`: a function that returns true if the user has at least the given role
 *  - `role`: the role of the user in the project
 *  - `isCreator`: a boolean indicating if the user is the creator of the project
 *  - `isLoading`: a boolean indicating if the access control info is still being loaded
 */
/*******  9d72412a-9237-4954-8db5-a671a4464d81  *******/ export const useProjectAccess =
  ({ projectId }: UseProjectAccessProps) => {
    const {
      permissions,
      roles,
      isCreator,
      fetchProjectAccess,
      requiresMinRole,
    } = useAccessStore();

    useEffect(() => {
      if (!permissions[projectId]) {
        fetchProjectAccess(projectId);
      }
    }, [projectId, permissions, fetchProjectAccess]);

    const can = (action: ProjectAction): boolean => {
      return permissions[projectId]?.[action] ?? false;
    };

    const hasMinRole = (minRole: Role): boolean => {
      return requiresMinRole(projectId, minRole);
    };

    return {
      can,
      hasMinRole,
      role: roles[projectId],
      isCreator: isCreator[projectId],
      isLoading: !permissions[projectId],
    };
  };
