import Image from "next/image";
import React from "react";
import Button from "../base/Button";
import XStack from "../base/XStack";

const Navbar: React.FC = () => {
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
        <Button
          variant="raw"
          className="rounded-full px-8 py-3 text-base bg-primary text-inda-dark font-medium"
        >
          SIGN UP | SIGN IN
        </Button>
      </XStack>
    </XStack>
  );
};

export default Navbar;
