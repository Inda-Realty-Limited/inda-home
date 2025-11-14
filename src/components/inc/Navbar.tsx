import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import {
  FiBell,
  FiFileText,
  FiLogOut,
  FiMenu,
  FiUser,
  FiX,
} from "react-icons/fi";
import Button from "../base/Button";
import XStack from "../base/XStack";

interface NavbarProps {
  variant?: "auth" | string;
}

const Navbar: React.FC<NavbarProps> = ({ variant }) => {
  const router = useRouter();
  const { user, isAuthenticated, logout: authLogout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const profileRef = useRef<HTMLDivElement | null>(null);

  // Close profile dropdown on outside click / ESC
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!profileRef.current) return;
      if (!profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setProfileOpen(false);
      }
    }
    if (profileOpen) {
      document.addEventListener("mousedown", onDocClick);
      document.addEventListener("keydown", onKey);
    }
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [profileOpen]);

  const handleLogout = async () => {
    setProfileOpen(false);
    setMobileProfileOpen(false);
    setMobileOpen(false);
    
    try {
      await authLogout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (isAuthenticated) {
    return (
      <>
        <XStack className="w-full flex items-center justify-between py-4 bg-gradient-to-r from-inda-dark/95 to-inda-dark/90 backdrop-blur-sm border-b border-white/5 h-[80px] md:h-[110px] px-4 md:pr-8">
          <div
            className="flex items-center gap-2 h-full overflow-hidden cursor-pointer group transition-transform duration-200 hover:scale-105"
            onClick={() => router.push("/")}
          >
            <Image
              src="/assets/images/logo.png"
              alt="Inda Logo"
              width={132}
              height={157}
              className="w-[100px] md:w-[132px] h-auto filter brightness-110 group-hover:brightness-125 transition-all duration-200"
            />
          </div>

          <XStack
            gap={40}
            className="hidden lg:flex items-center justify-center space-x-10"
          >
            <div className="relative flex items-center justify-center cursor-pointer select-none group bg-[#F9F9F90A] hover:bg-white/10 rounded-full w-12 h-12 transition-all duration-200">
              <FiBell
                size={22}
                color="#F9F9F9"
                className="group-hover:scale-110 transition-transform duration-200"
              />
              {/* Notification count badge */}
              {notificationCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {notificationCount > 99 ? "99+" : notificationCount}
                </div>
              )}
            </div>
            {/* Profile (dropdown) */}
            <div
              ref={profileRef}
              className="relative"
              onMouseEnter={() => setProfileOpen(true)}
              onMouseLeave={() => setProfileOpen(false)}
            >
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center justify-center gap-2.5 cursor-pointer select-none group bg-[#F9F9F90A] hover:bg-white/10 rounded-full px-4 py-2 transition-all duration-200"
                aria-haspopup="menu"
                aria-expanded={profileOpen}
              >
                <FiUser
                  size={22}
                  color="#F9F9F9"
                  className="group-hover:scale-110 transition-transform duration-200"
                />
                <span className="text-white text-lg font-medium group-hover:text-white/90 transition-colors duration-200">
                  {user?.firstName ? `${user.firstName}` : "Profile"}
                </span>
              </button>

              {profileOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full z-[99] w-72 rounded-xl border border-white/10 bg-inda-dark/95 backdrop-blur-md shadow-xl shadow-black/30 overflow-hidden"
                >
                  <div className="px-4 py-4 bg-white/5">
                    <div className="text-white text-base font-semibold">
                      {user?.firstName || "User"} {user?.lastName || ""}
                    </div>
                    <div className="text-white/70 text-sm truncate">
                      {user?.email || "no-email@inda.africa"}
                    </div>
                  </div>
                  <div className="py-2">
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-white/90 hover:bg-white/10 inline-flex items-center gap-2"
                      onClick={() => router.push("/profile")}
                    >
                      <FiUser className="opacity-90" />
                      View Profile
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-white/90 hover:bg-white/10 inline-flex items-center gap-2"
                      onClick={() => router.push("/orders")}
                    >
                      <FiFileText className="opacity-90" />
                      Orders & Reports
                    </button>
                    <div className="my-2 h-px bg-white/10" />
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 inline-flex items-center gap-2"
                      onClick={handleLogout}
                    >
                      <FiLogOut />
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </XStack>

          {/* Mobile menu toggle */}
          <button
            aria-label="Open menu"
            className="lg:hidden inline-flex items-center justify-center p-2 rounded-full text-white bg-white/10 hover:bg-white/20 transition-colors"
            onClick={() => setMobileOpen(true)}
          >
            <FiMenu size={22} />
          </button>
        </XStack>

        {/* Mobile drawer */}
        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/40 z-50"
              onClick={() => setMobileOpen(false)}
            />
            <div className="fixed top-0 right-0 h-full w-[78%] max-w-[320px] z-50 bg-inda-dark/95 backdrop-blur-md border-l border-white/10 p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between mb-2">
                <Image
                  src="/assets/images/logo.png"
                  alt="Inda Logo"
                  width={110}
                  height={40}
                  className="h-auto w-[90px]"
                />
                <button
                  aria-label="Close menu"
                  className="inline-flex items-center justify-center p-2 rounded-full text-white/90 hover:text-white bg-white/10 hover:bg-white/20"
                  onClick={() => setMobileOpen(false)}
                >
                  <FiX size={20} />
                </button>
              </div>
              <button
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-base"
                onClick={() => setMobileOpen(false)}
              >
                <span className="flex items-center gap-3">
                  <FiBell /> Notifications
                </span>
                {notificationCount > 0 && (
                  <div className="bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {notificationCount > 99 ? "99+" : notificationCount}
                  </div>
                )}
              </button>
              {/* Mobile Profile submenu */}
              <div className="w-full">
                <button
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-base"
                  onClick={() => setMobileProfileOpen((v) => !v)}
                >
                  <span className="inline-flex items-center gap-3">
                    <FiUser /> Profile
                  </span>
                  <span
                    className={`transition-transform ${
                      mobileProfileOpen ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    ▾
                  </span>
                </button>
                {mobileProfileOpen && (
                  <div className="mt-2 mx-2 rounded-xl border border-white/10 bg-inda-dark/90">
                    <div className="px-4 py-3 text-white">
                      <div className="font-semibold text-base">
                        {user?.firstName || "User"} {user?.lastName || ""}
                      </div>
                      <div className="text-white/70 text-sm break-all">
                        {user?.email || "no-email@inda.africa"}
                      </div>
                    </div>
                    <div className="py-1">
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-white/90 hover:bg-white/10 inline-flex items-center gap-2"
                        onClick={() => {
                          setMobileOpen(false);
                          router.push("/profile");
                        }}
                      >
                        <FiUser className="opacity-90" />
                        View Profile
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-white/90 hover:bg-white/10 inline-flex items-center gap-2"
                        onClick={() => {
                          setMobileOpen(false);
                          router.push("/orders");
                        }}
                      >
                        <FiFileText className="opacity-90" />
                        Orders & Reports
                      </button>
                      <div className="my-2 h-px bg-white/10" />
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 inline-flex items-center gap-2"
                        onClick={handleLogout}
                      >
                        <FiLogOut />
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </>
    );
  }

  // NOT LOGGED IN NAVBAR (original)
  return (
    <>
      <XStack className="w-full flex items-center justify-between py-4 bg-gradient-to-r from-inda-dark/95 to-inda-dark/90 backdrop-blur-sm border-b border-white/5 h-[80px] md:h-[110px] px-4 md:pr-8">
        <div
          className="flex items-center gap-2 h-full overflow-hidden cursor-pointer group transition-transform duration-200 hover:scale-105"
          onClick={() => router.push("/")}
        >
          <Image
            src="/assets/images/logo.png"
            alt="Inda Logo"
            width={132}
            height={157}
            className="w-[100px] md:w-[132px] h-auto filter brightness-110 group-hover:brightness-125 transition-all duration-200"
          />
        </div>

        <XStack gap={24} className="hidden lg:flex items-center space-x-3">
          <Button
            variant="raw"
            className="rounded-full bg-[#F9F9F90A] hover:bg-white/10   px-6 py-2.5 text-sm text-white font-medium transition-all duration-200 hover:scale-105"
          >
            Inda Blog
          </Button>
          {variant === "signUp" && (
            <Button
              onClick={() => {
                router.push("/auth/signin");
              }}
              variant="raw"
              className="rounded-full px-6 py-2.5 text-sm bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-inda-dark font-semibold transition-all duration-200 hover:scale-105  -primary/20"
            >
              SIGN IN
            </Button>
          )}
          {variant === "signIn" && (
            <Button
              onClick={() => {
                router.push("/auth/signup");
              }}
              variant="raw"
              className="rounded-full px-6 py-2.5 text-sm bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-inda-dark font-semibold transition-all duration-200 hover:scale-105  -primary/20"
            >
              SIGN UP
            </Button>
          )}
          {variant !== "auth" &&
            variant !== "signUp" &&
            variant !== "signIn" && (
              <Button
                onClick={() => {
                  router.push("/auth");
                }}
                variant="raw"
                className="rounded-full px-6 py-2.5 text-sm bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-inda-dark font-semibold transition-all duration-200 hover:scale-105  -primary/20"
              >
                SIGN UP | SIGN IN
              </Button>
            )}
        </XStack>

        {/* Mobile menu toggle */}
        <button
          aria-label="Open menu"
          className="lg:hidden inline-flex items-center justify-center p-2 rounded-full text-white bg-white/10 hover:bg-white/20 transition-colors"
          onClick={() => setMobileOpen(true)}
        >
          <FiMenu size={22} />
        </button>
      </XStack>

      {/* Mobile drawer (not logged in) */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed top-0 right-0 h-full w-[78%] max-w-[320px] z-50 bg-inda-dark/95 backdrop-blur-md border-l border-white/10 p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between mb-2">
              <Image
                src="/assets/images/logo.png"
                alt="Inda Logo"
                width={110}
                height={40}
                className="h-auto w-[90px]"
              />
              <button
                aria-label="Close menu"
                className="inline-flex items-center justify-center p-2 rounded-full text-white/90 hover:text-white bg-white/10 hover:bg-white/20"
                onClick={() => setMobileOpen(false)}
              >
                <FiX size={20} />
              </button>
            </div>
            <button
              className="w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-base"
              onClick={() => {
                setMobileOpen(false);
                router.push("/blog");
              }}
            >
              Inda Blog
            </button>
            {variant === "signUp" && (
              <button
                className="w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-base"
                onClick={() => {
                  setMobileOpen(false);
                  router.push("/auth/signin");
                }}
              >
                SIGN IN
              </button>
            )}
            {variant === "signIn" && (
              <button
                className="w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-base"
                onClick={() => {
                  setMobileOpen(false);
                  router.push("/auth/signup");
                }}
              >
                SIGN UP
              </button>
            )}
            {variant !== "auth" &&
              variant !== "signUp" &&
              variant !== "signIn" && (
                <button
                  className="w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-base"
                  onClick={() => {
                    setMobileOpen(false);
                    router.push("/auth");
                  }}
                >
                  SIGN UP | SIGN IN
                </button>
              )}
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
