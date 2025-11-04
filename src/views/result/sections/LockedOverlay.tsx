import React from "react";
import { FaLock } from "react-icons/fa";

type Props = {
  isHidden: boolean;
  onUnlock: () => void;
  children: React.ReactNode;
};

const LockedOverlay: React.FC<Props> = ({ isHidden, onUnlock, children }) => {
  return (
    <div className="relative overflow-hidden">
      {isHidden && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className="sticky top-[50vh] -translate-y-1/2 transform w-full">
            <div className="mx-auto w-[200px] h-[200px] md:w-[240px] md:h-[240px] rounded-full bg-[#4EA8A1] flex flex-col items-center justify-center shadow-2xl pointer-events-auto">
              <FaLock className="text-white w-12 h-12 md:w-14 md:h-14 mb-4" />
              <button
                onClick={onUnlock}
                className="px-4 py-1.5 md:px-6 md:py-2 rounded-full border border-white text-white text-sm md:text-base font-semibold hover:bg-white/10 transition"
              >
                Unlock here
              </button>
            </div>
          </div>
        </div>
      )}
      <div className={isHidden ? "filter blur-sm" : undefined}>{children}</div>
    </div>
  );
};

export default LockedOverlay;
