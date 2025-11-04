import { login } from "@/api/auth";
import { Button, Container, Footer, Input, Navbar } from "@/components";
import { useToast } from "@/components/ToastProvider";
import { setToken, setUser } from "@/helpers";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FiLock, FiMail } from "react-icons/fi";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("");
  const [returnTo, setReturnTo] = useState("");
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      const { q, type, returnTo: rt } = router.query;
      setSearchQuery((q as string) || "");
      setSearchType((type as string) || "");
      setReturnTo((rt as string) || "");
    }
  }, [router.isReady, router.query]);

  // Store token securely using setToken helper
  const handleSuccess = (data: any) => {
    if (data?.token) {
      setToken(data.token);
      if (data?.user) {
        setUser(data.user);
      }
      toast.showToast("Sign in successful!", 2000, "success");
      setTimeout(() => {
        // Prefer explicit returnTo redirect, else fallback to search or home
        if (returnTo) {
          try {
            router.push(decodeURIComponent(returnTo));
            return;
          } catch {
            router.push(returnTo);
            return;
          }
        }
        if (searchQuery) {
          router.push(
            `/result?q=${encodeURIComponent(searchQuery)}&type=${searchType}`
          );
        } else {
          router.push("/");
        }
      }, 800);
    } else {
      toast.showToast("Sign in failed: No token returned.", 2500, "error");
    }
  };

  const handleError = (error: any) => {
    toast.showToast(
      error?.response?.data?.message || error?.message || "Sign in failed.",
      2500,
      "error"
    );
  };

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: handleSuccess,
    onError: handleError,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <Container
      noPadding
      className="min-h-screen md:h-screen bg-white overflow-hidden text-inda-dark flex flex-col justify-between"
    >
      <Navbar variant="signIn" />
      <div className="flex-1 flex items-center justify-center py-8 sm:py-12">
        <div className="flex flex-col bg-[#E5E5E573] items-center justify-center rounded-3xl w-[95%] sm:w-[85%] md:w-[75%] lg:w-[65%] xl:w-[50%] mx-auto py-8 sm:py-12 px-4 sm:px-6">
          <div className="flex flex-col items-center w-full max-w-[320px] sm:max-w-[400px] md:max-w-[480px] mx-auto">
            <h1 className="text-center font-bold text-2xl sm:text-3xl mb-6 sm:mb-8">
              Welcome Back!
            </h1>
            <form
              className="w-full flex flex-col gap-4 sm:gap-6"
              onSubmit={handleSubmit}
            >
              <div className="flex flex-col gap-1 sm:gap-2">
                <label
                  htmlFor="email"
                  className="text-gray-700 font-medium text-sm sm:text-base"
                >
                  Email
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 sm:left-4 text-gray-400 text-sm sm:text-base">
                    <FiMail />
                  </span>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl bg-[#F9F9F9] border border-[#e0e0e0] focus:ring-2 focus:ring-[#4EA8A1] pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 transition-all duration-200 text-sm sm:text-base"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1 sm:gap-2">
                <label
                  htmlFor="password"
                  className="text-gray-700 font-medium text-sm sm:text-base"
                >
                  Password
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 sm:left-4 text-gray-400 text-sm sm:text-base">
                    <FiLock />
                  </span>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl bg-[#F9F9F9] border border-[#e0e0e0] focus:ring-2 focus:ring-[#4EA8A1] pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 transition-all duration-200 text-sm sm:text-base"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <a
                  href={`/auth/forgot-password${
                    returnTo
                      ? `?returnTo=${encodeURIComponent(returnTo)}`
                      : searchQuery
                      ? `?q=${encodeURIComponent(
                          searchQuery
                        )}&type=${searchType}`
                      : ""
                  }`}
                  className="text-xs sm:text-sm text-[#4EA8A1] font-semibold hover:underline transition-all duration-200"
                >
                  Forgot password?
                </a>
              </div>
              <Button
                className="w-full bg-[#4EA8A1] text-white py-2.5 sm:py-3 rounded-full font-semibold text-sm sm:text-base hover:bg-[#39948b] transition-all duration-200"
                type="submit"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Signing in..." : "Continue"}
              </Button>
            </form>
            <span className="text-xs sm:text-sm text-gray-600 mt-4 sm:mt-6 text-center">
              Don't have an account?{" "}
              <a
                href={`/auth/signup${
                  returnTo
                    ? `?returnTo=${encodeURIComponent(returnTo)}`
                    : searchQuery
                    ? `?q=${encodeURIComponent(searchQuery)}&type=${searchType}`
                    : ""
                }`}
                className="text-[#4EA8A1] font-semibold hover:underline transition-all duration-200"
              >
                Sign Up
              </a>
            </span>
          </div>
        </div>
      </div>
      <Footer />
    </Container>
  );
};

export default SignIn;
