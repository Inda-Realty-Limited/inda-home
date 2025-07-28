import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import Button from "../base/Button";
import XStack from "../base/XStack";

interface NavbarProps {
  variant?: "auth" | string;
}

const Navbar: React.FC<NavbarProps> = ({ variant }) => {
  const router = useRouter();
  return (
    <XStack className="w-full flex items-center justify-between py-4 bg-inda-dark/90 h-[110px] pr-8">
      <div className="flex items-center gap-2 h-full overflow-hidden">
        <Image
          src="/assets/images/logo.png"
          alt="Inda Logo"
          width={132}
          height={157}
        />
      </div>
      <XStack gap={24} className="items-center space-x-3">
        <Button
          variant="raw"
          className="rounded-full bg-[#F9F9F90A] px-8 py-3 text-base text-white hover:bg-inda-teal/20 font-medium"
        >
          Write a review
        </Button>
        <Button
          variant="raw"
          className="rounded-full bg-[#F9F9F90A] px-8 py-3 text-base text-white hover:bg-inda-teal/20 font-medium"
        >
          Inda Blog
        </Button>
        {/* Show SIGN IN or SIGN UP button based on variant */}
        {variant === "signUp" && (
          <Button
            onClick={() => {
              router.push("/auth");
            }}
            variant="raw"
            className="rounded-full px-8 py-3 text-base bg-primary text-inda-dark font-medium"
          >
            SIGN IN
          </Button>
        )}
        {variant === "signIn" && (
          <Button
            onClick={() => {
              router.push("/auth");
            }}
            variant="raw"
            className="rounded-full px-8 py-3 text-base bg-primary text-inda-dark font-medium"
          >
            SIGN UP
          </Button>
        )}
        {/* Default: show both SIGN UP | SIGN IN if not auth/signUp/signIn */}
        {variant !== "auth" && variant !== "signUp" && variant !== "signIn" && (
          <Button
            onClick={() => {
              router.push("/auth");
            }}
            variant="raw"
            className="rounded-full px-8 py-3 text-base bg-primary text-inda-dark font-medium"
          >
            SIGN UP | SIGN IN
          </Button>
        )}
      </XStack>
    </XStack>
  );
};

export default Navbar;
