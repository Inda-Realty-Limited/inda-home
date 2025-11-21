import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const OAuthCallback: React.FC = () => {
  const router = useRouter();
  const { checkSession } = useAuth();

  useEffect(() => {
    const verifySession = async () => {
      try {
        await checkSession();
        router.push("/");
      } catch (error) {
        router.push("/auth/signin");
      }
    };

    verifySession();
  }, [checkSession, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#4EA8A1] border-r-transparent mb-4"></div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Completing Sign In
        </h1>
        <p className="text-gray-600">Please wait...</p>
      </div>
    </div>
  );
};

export default OAuthCallback;


