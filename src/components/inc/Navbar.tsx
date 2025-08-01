import { getToken, removeToken } from "@/helpers";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import {
  FiBell,
  FiChevronDown,
  FiLogOut,
  FiMenu,
  FiSettings,
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
  const isLoggedIn = typeof window !== "undefined" && !!getToken();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      removeToken();
      router.push("/");
      setShowLogoutConfirm(false);
      setMobileMenuOpen(false);
      setProfileDropdownOpen(false);
    }
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isLoggedIn) {
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

          <XStack gap={40} className="hidden lg:flex items-center space-x-10">
            <div className="flex items-center gap-3 cursor-pointer select-none group hover:bg-white/5 rounded-xl px-3 py-2 transition-all duration-200">
              <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-all duration-200">
                <FiBell
                  size={20}
                  color="#F9F9F9"
                  className="group-hover:scale-110 transition-transform duration-200"
                />
              </div>
              <span className="text-white text-base font-medium group-hover:text-white/90 transition-colors duration-200">
                Notifications
              </span>
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileDropdownRef}>
              <div
                className="flex items-center gap-3 cursor-pointer select-none group hover:bg-white/5 rounded-xl px-3 py-2 transition-all duration-200"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-all duration-200">
                  <FiUser
                    size={20}
                    color="#F9F9F9"
                    className="group-hover:scale-110 transition-transform duration-200"
                  />
                </div>
                <span className="text-white text-base font-medium group-hover:text-white/90 transition-colors duration-200">
                  Profile
                </span>
                <FiChevronDown
                  size={16}
                  color="#F9F9F9"
                  className={`transition-transform duration-200 ${
                    profileDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </div>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        // Add navigation to profile page here
                      }}
                      className="flex items-center w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <FiUser className="w-4 h-4 mr-3" />
                      View Profile
                    </button>
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        // Add navigation to settings page here
                      }}
                      className="flex items-center w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <FiSettings className="w-4 h-4 mr-3" />
                      Account Settings
                    </button>
                    <hr className="my-1 border-gray-200" />
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        setShowLogoutConfirm(true);
                      }}
                      className="flex items-center w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      <FiLogOut className="w-4 h-4 mr-3" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 cursor-pointer select-none group hover:bg-white/5 rounded-xl px-3 py-2 transition-all duration-200">
              <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-all duration-200">
                <svg
                  width="20"
                  height="14"
                  viewBox="0 0 36 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="group-hover:scale-110 transition-transform duration-200"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M16.4883 16.2075C19.5841 14.1465 20.9654 10.3015 19.8887 6.74161C18.8121 3.18172 15.5316 0.746577 11.8125 0.746577C8.09337 0.746577 4.81286 3.18172 3.73625 6.74161C2.65965 10.3015 4.04089 14.1465 7.13672 16.2075C4.40929 17.2127 2.07999 19.0729 0.496406 21.5105C0.269898 21.8471 0.242226 22.2797 0.42399 22.6424C0.605754 23.0052 0.968785 23.242 1.37405 23.2621C1.77931 23.2822 2.164 23.0825 2.38078 22.7395C4.45614 19.5475 8.00515 17.6218 11.8125 17.6218C15.6198 17.6218 19.1689 19.5475 21.2442 22.7395C21.5876 23.2498 22.2771 23.3898 22.7922 23.0538C23.3074 22.7178 23.4572 22.0304 23.1286 21.5105C21.545 19.0729 19.2157 17.2127 16.4883 16.2075ZM5.625 9.1875C5.625 5.77024 8.39524 3 11.8125 3C15.2298 3 18 5.77024 18 9.1875C18 12.6048 15.2298 15.375 11.8125 15.375C8.39684 15.3711 5.62887 12.6032 5.625 9.1875ZM35.1759 23.0672C34.6556 23.4065 33.9587 23.2598 33.6192 22.7395C31.5462 19.5454 27.9954 17.6199 24.1875 17.625C23.5662 17.625 23.0625 17.1213 23.0625 16.5C23.0625 15.8787 23.5662 15.375 24.1875 15.375C26.6795 15.3727 28.9268 13.8756 29.8892 11.577C30.8515 9.27832 30.341 6.62669 28.594 4.84967C26.8469 3.07265 24.2044 2.51708 21.8897 3.44016C21.514 3.60257 21.0797 3.54812 20.7557 3.29797C20.4318 3.04782 20.2692 2.64145 20.3313 2.23688C20.3934 1.8323 20.6703 1.49337 21.0544 1.35187C25.0663 -0.248149 29.6388 1.44001 31.6485 5.26324C33.6582 9.08647 32.4561 13.8101 28.8633 16.2075C31.5907 17.2127 33.92 19.0729 35.5036 21.5105C35.8429 22.0308 35.6962 22.7278 35.1759 23.0672Z"
                    fill="#F9F9F9"
                  />
                </svg>
              </div>
              <span className="text-white text-base font-medium group-hover:text-white/90 transition-colors duration-200">
                My Portfolio
              </span>
            </div>
          </XStack>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200 hover:scale-105"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <FiX size={20} color="#F9F9F9" />
            ) : (
              <FiMenu size={20} color="#F9F9F9" />
            )}
          </button>
        </XStack>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-gradient-to-br from-inda-dark/98 to-inda-dark/95 backdrop-blur-md">
            <div className="flex flex-col items-center justify-center h-full space-y-8 px-4">
              <button
                className="absolute top-6 right-6 flex items-center justify-center w-14 h-14 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200 hover:scale-105"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <FiX size={24} color="#F9F9F9" />
              </button>

              <div className="flex flex-col items-center gap-6 mt-16">
                <div
                  className="flex flex-col items-center gap-4 cursor-pointer select-none p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200 hover:scale-105 w-64"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="p-3 rounded-xl bg-white/10">
                    <FiBell size={24} color="#F9F9F9" />
                  </div>
                  <span className="text-white text-base font-medium">
                    Notifications
                  </span>
                </div>
                <div
                  className="flex flex-col items-center gap-4 cursor-pointer select-none p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200 hover:scale-105 w-64"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="p-3 rounded-xl bg-white/10">
                    <FiUser size={24} color="#F9F9F9" />
                  </div>
                  <span className="text-white text-base font-medium">
                    Profile
                  </span>
                </div>
                <div
                  className="flex flex-col items-center gap-4 cursor-pointer select-none p-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200 hover:scale-105 w-64"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="p-3 rounded-xl bg-white/10">
                    <svg
                      width="24"
                      height="16"
                      viewBox="0 0 36 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M16.4883 16.2075C19.5841 14.1465 20.9654 10.3015 19.8887 6.74161C18.8121 3.18172 15.5316 0.746577 11.8125 0.746577C8.09337 0.746577 4.81286 3.18172 3.73625 6.74161C2.65965 10.3015 4.04089 14.1465 7.13672 16.2075C4.40929 17.2127 2.07999 19.0729 0.496406 21.5105C0.269898 21.8471 0.242226 22.2797 0.42399 22.6424C0.605754 23.0052 0.968785 23.242 1.37405 23.2621C1.77931 23.2822 2.164 23.0825 2.38078 22.7395C4.45614 19.5475 8.00515 17.6218 11.8125 17.6218C15.6198 17.6218 19.1689 19.5475 21.2442 22.7395C21.5876 23.2498 22.2771 23.3898 22.7922 23.0538C23.3074 22.7178 23.4572 22.0304 23.1286 21.5105C21.545 19.0729 19.2157 17.2127 16.4883 16.2075ZM5.625 9.1875C5.625 5.77024 8.39524 3 11.8125 3C15.2298 3 18 5.77024 18 9.1875C18 12.6048 15.2298 15.375 11.8125 15.375C8.39684 15.3711 5.62887 12.6032 5.625 9.1875ZM35.1759 23.0672C34.6556 23.4065 33.9587 23.2598 33.6192 22.7395C31.5462 19.5454 27.9954 17.6199 24.1875 17.625C23.5662 17.625 23.0625 17.1213 23.0625 16.5C23.0625 15.8787 23.5662 15.375 24.1875 15.375C26.6795 15.3727 28.9268 13.8756 29.8892 11.577C30.8515 9.27832 30.341 6.62669 28.594 4.84967C26.8469 3.07265 24.2044 2.51708 21.8897 3.44016C21.514 3.60257 21.0797 3.54812 20.7557 3.29797C20.4318 3.04782 20.2692 2.64145 20.3313 2.23688C20.3934 1.8323 20.6703 1.49337 21.0544 1.35187C25.0663 -0.248149 29.6388 1.44001 31.6485 5.26324C33.6582 9.08647 32.4561 13.8101 28.8633 16.2075C31.5907 17.2127 33.92 19.0729 35.5036 21.5105C35.8429 22.0308 35.6962 22.7278 35.1759 23.0672Z"
                        fill="#F9F9F9"
                      />
                    </svg>
                  </div>
                  <span className="text-white text-base font-medium">
                    My Portfolio
                  </span>
                </div>
                <div
                  className="flex flex-col items-center gap-4 cursor-pointer select-none p-6 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/30 transition-all duration-200 hover:scale-105 w-64"
                  onClick={() => setShowLogoutConfirm(true)}
                >
                  <div className="p-3 rounded-xl bg-red-500/20">
                    <FiLogOut size={24} color="#ef4444" />
                  </div>
                  <span className="text-red-400 text-base font-medium">
                    Logout
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Logout Confirmation Modal */}
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Confirm Logout
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to logout? You'll need to sign in again to
                access your account.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
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
            className="rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-6 py-2.5 text-sm text-white font-medium transition-all duration-200 hover:scale-105"
          >
            Write a review
          </Button>
          <Button
            variant="raw"
            className="rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-6 py-2.5 text-sm text-white font-medium transition-all duration-200 hover:scale-105"
          >
            Inda Blog
          </Button>
          {variant === "signUp" && (
            <Button
              onClick={() => {
                router.push("/auth/signin");
              }}
              variant="raw"
              className="rounded-full px-6 py-2.5 text-sm bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-inda-dark font-semibold transition-all duration-200 hover:scale-105 border border-primary/20"
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
              className="rounded-full px-6 py-2.5 text-sm bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-inda-dark font-semibold transition-all duration-200 hover:scale-105 border border-primary/20"
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
                className="rounded-full px-6 py-2.5 text-sm bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-inda-dark font-semibold transition-all duration-200 hover:scale-105 border border-primary/20"
              >
                SIGN UP | SIGN IN
              </Button>
            )}
        </XStack>

        <button
          className="lg:hidden flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200 hover:scale-105"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? (
            <FiX size={20} color="#F9F9F9" />
          ) : (
            <FiMenu size={20} color="#F9F9F9" />
          )}
        </button>
      </XStack>

      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-gradient-to-br from-inda-dark/98 to-inda-dark/95 backdrop-blur-md">
          <div className="flex flex-col items-center justify-center h-full space-y-8 px-4">
            <button
              className="absolute top-6 right-6 flex items-center justify-center w-14 h-14 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-200 hover:scale-105"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <FiX size={24} color="#F9F9F9" />
            </button>

            <div className="flex flex-col items-center gap-6 mt-16">
              <Button
                variant="raw"
                className="rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-8 py-4 text-base text-white font-medium w-64 transition-all duration-200 hover:scale-105"
                onClick={() => setMobileMenuOpen(false)}
              >
                Write a review
              </Button>
              <Button
                variant="raw"
                className="rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 px-8 py-4 text-base text-white font-medium w-64 transition-all duration-200 hover:scale-105"
                onClick={() => setMobileMenuOpen(false)}
              >
                Inda Blog
              </Button>
              {variant === "signUp" && (
                <Button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push("/auth/signin");
                  }}
                  variant="raw"
                  className="rounded-2xl px-8 py-4 text-base bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-inda-dark font-semibold w-64 transition-all duration-200 hover:scale-105 border border-primary/20"
                >
                  SIGN IN
                </Button>
              )}
              {variant === "signIn" && (
                <Button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    router.push("/auth/signup");
                  }}
                  variant="raw"
                  className="rounded-2xl px-8 py-4 text-base bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-inda-dark font-semibold w-64 transition-all duration-200 hover:scale-105 border border-primary/20"
                >
                  SIGN UP
                </Button>
              )}
              {variant !== "auth" &&
                variant !== "signUp" &&
                variant !== "signIn" && (
                  <Button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      router.push("/auth");
                    }}
                    variant="raw"
                    className="rounded-2xl px-8 py-4 text-base bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-inda-dark font-semibold w-64 transition-all duration-200 hover:scale-105 border border-primary/20"
                  >
                    SIGN UP | SIGN IN
                  </Button>
                )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
