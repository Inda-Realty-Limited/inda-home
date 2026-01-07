import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Not logged in -> redirect to login
        router.push("/auth/pro-login?redirect=" + encodeURIComponent(router.asPath));
      } else if (allowedRoles && user && !allowedRoles.includes(user.role as string)) {
        // Logged in but wrong role -> redirect to home
        router.push("/");
      }
    }
  }, [isAuthenticated, isLoading, user, allowedRoles, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#4ea8a1] animate-spin" />
      </div>
    );
  }

  // While redirecting or checking, renders nothing or loader. 
  // Once checks pass, render children.
  if (!isAuthenticated) return null;
  if (allowedRoles && user && !allowedRoles.includes(user.role as string)) return null;

  return <>{children}</>;
};
