import { useAuth0 } from "@auth0/auth0-react";

export function useIsAdmin() {
    const { user, isAuthenticated } = useAuth0();
    if (!isAuthenticated || !user) return false;

    const roles = user["https://nexus-esports.com/roles"] || [];
    return roles.includes("admin");
}