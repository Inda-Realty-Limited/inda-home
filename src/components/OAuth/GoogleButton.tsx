import { env } from "@/config/env";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";

interface GoogleButtonProps {
  onSuccess?: (user: any) => void;
  returnTo?: string;
  className?: string;
}

const GoogleButton: React.FC<GoogleButtonProps> = ({
  returnTo,
  className = "",
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = () => {
    setIsLoading(true);

    const state = returnTo ? encodeURIComponent(returnTo) : "";
    const redirectUri = `${typeof window !== "undefined" ? window.location.origin : ""}/auth/oauth/callback`;

    const oauthUrl = `${env.api.baseUrl}/auth/google?state=${state}&redirectUri=${encodeURIComponent(redirectUri)}`;

    window.location.href = oauthUrl;
  };

  return (
    <button
      onClick={handleGoogleLogin}
      disabled={isLoading}
      className={`bg-[#F9F9F9] text-inda-dark font-medium text-lg sm:text-xl rounded-full w-full h-[56px] sm:h-[64px] transition-all duration-200 ease-in-out hover:bg-[#F0F0F0] hover:scale-[0.98] active:scale-[0.96] flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <FcGoogle className="w-5 h-5 sm:w-6 sm:h-6" />
      {isLoading ? "Redirecting..." : "Continue with Google"}
    </button>
  );
};

export default GoogleButton;


