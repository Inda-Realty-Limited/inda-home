import React from "react";
import Button from "../base/Button";
import Text from "../base/Text";
import XStack from "../base/XStack";

const Navbar: React.FC = () => {
  return (
    <nav className="w-full flex items-center justify-between px-8 py-4 bg-inda-dark/90">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 bg-inda-white rounded-l-md flex items-center justify-center"></div>
        <Text as="p" size="2xl" className="font-bold text-inda-teal ml-2">
          Inda
        </Text>
      </div>
      <XStack gap={24} className="items-center">
        <Button
          variant="secondary"
          className="rounded-full px-8 py-3 text-base"
        >
          Write a review
        </Button>
        <Button
          variant="secondary"
          className="rounded-full px-8 py-3 text-base"
        >
          Inda Blog
        </Button>
        <Button
          variant="primary"
          className="rounded-full px-8 py-3 text-base bg-inda-yellow text-inda-dark font-bold"
        >
          SIGN UP | SIGN IN
        </Button>
      </XStack>
    </nav>
  );
};

export default Navbar;
