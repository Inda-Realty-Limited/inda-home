import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const decodeBase64Url = (value: string): string => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  if (typeof window !== "undefined" && typeof window.atob === "function") {
    return window.atob(normalized + padding);
  }
  return Buffer.from(normalized + padding, "base64").toString("utf-8");
};

const getSafeReturnTo = (returnTo?: string | string[]) => {
  if (!returnTo || Array.isArray(returnTo)) {
    return "/";
  }
  try {
    const decoded = decodeURIComponent(returnTo);
    return decoded.startsWith("/") ? decoded : "/";
  } catch {
    return "/";
  }
};

const OAuthCallback: React.FC = () => {
  const router = useRouter();
  const { setUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const { error: oauthError, token, user, returnTo } = router.query;

    if (oauthError) {
      setError(typeof oauthError === "string" ? oauthError : "Authentication failed");
      setTimeout(() => router.push("/auth/signin"), 3000);
      return;
    }

    if (typeof token !== "string" || typeof user !== "string") {
      setError("Missing authentication payload");
      setTimeout(() => router.push("/auth/signin"), 3000);
      return;
    }

    try {
      const userJson = decodeBase64Url(user);
      const parsedUser = JSON.parse(userJson);
      setUser(parsedUser, token);

      const destination = getSafeReturnTo(returnTo);
      setTimeout(() => router.push(destination), 500);
    } catch (err: any) {
      console.error("Failed to process OAuth payload:", err);
      setError("An error occurred during authentication");
      setTimeout(() => router.push("/auth/signin"), 3000);
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


