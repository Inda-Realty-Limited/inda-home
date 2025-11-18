import { useAuth } from "@/contexts/AuthContext";
import { env } from "@/config/env";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const OAuthCallback: React.FC = () => {
  const router = useRouter();
  const { setUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const { code, state, error: oauthError } = router.query;

      if (oauthError) {
        setError(typeof oauthError === "string" ? oauthError : "Authentication failed");
        setTimeout(() => router.push("/auth/signin"), 3000);
        return;
      }

      if (!code || typeof code !== "string") {
        setError("No authorization code received");
        setTimeout(() => router.push("/auth/signin"), 3000);
        return;
      }

      try {
        const response = await fetch(`${env.api.baseUrl}/auth/google/callback?code=${code}`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("OAuth authentication failed");
        }

        const data = await response.json();
        
        if (data.user) {
          setUser(data.user);
        }

        const returnTo = state && typeof state === "string" ? decodeURIComponent(state) : "/";
        setTimeout(() => router.push(returnTo), 500);
      } catch (err: any) {
        setError(err.message || "An error occurred during authentication");
        setTimeout(() => router.push("/auth/signin"), 3000);
      }
    };

    if (router.isReady) {
      handleCallback();
    }
  }, [router, router.isReady, router.query, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        {error ? (
          <div>
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-2xl font-bold text-red-600 mb-2">Authentication Failed</h1>
            <p className="text-gray-600">{error}</p>
            <p className="text-sm text-gray-500 mt-4">Redirecting to sign in...</p>
          </div>
        ) : (
          <div>
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#4EA8A1] border-r-transparent mb-4"></div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Completing Sign In</h1>
            <p className="text-gray-600">Please wait...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OAuthCallback;


