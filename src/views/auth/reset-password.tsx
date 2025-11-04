import { resetPassword as resetPasswordApi } from "@/api/auth";
import { Button, Container, Footer, Input, Navbar } from "@/components";
import { useToast } from "@/components/ToastProvider";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FiLock, FiMail } from "react-icons/fi";

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("");
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      const { q, type, email: e } = router.query as any;
      setSearchQuery((q as string) || "");
      setSearchType((type as string) || "");
      if (e) setEmail(e as string);
    }
  }, [router.isReady, router.query]);

  const mutation = useMutation({
    mutationFn: resetPasswordApi,
    onSuccess: () => {
      toast.showToast("Password reset successful.", 2500, "success");
      const next = `/auth/signin${
        searchQuery
          ? `?q=${encodeURIComponent(searchQuery)}&type=${searchType}`
          : ""
      }`;
      setTimeout(() => router.push(next), 800);
    },
    onError: (error: any) => {
      toast.showToast(
        error?.response?.data?.message || error?.message || "Reset failed.",
        3000,
        "error"
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      email: email.trim().toLowerCase(),
      code: code.trim(),
      newPassword,
    });
  };

  return (
    <Container
      noPadding
      className="min-h-screen bg-white overflow-hidden text-inda-dark flex flex-col"
    >
      <Navbar variant="signIn" />
      <div className="flex-1 flex items-center justify-center py-8 sm:py-12">
        <div className="flex flex-col bg-[#E5E5E573] items-center justify-center rounded-3xl w-[95%] sm:w-[85%] md:w-[75%] lg:w-[65%] xl:w-[50%] mx-auto py-8 sm:py-12 px-4 sm:px-6">
          <div className="flex flex-col items-center w-full max-w-[320px] sm:max-w-[400px] md:max-w-[480px] mx-auto">
            <h1 className="text-center font-bold text-2xl sm:text-3xl mb-6 sm:mb-8">
              Reset Password
            </h1>
            <p className="text-center text-sm sm:text-base text-[#556457] mb-6">
              Enter the code sent to your email and your new password.
            </p>
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
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl bg-[#F9F9F9] border border-[#e0e0e0] focus:ring-2 focus:ring-[#4EA8A1] pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 transition-all duration-200 text-sm sm:text-base"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1 sm:gap-2">
                <label
                  htmlFor="code"
                  className="text-gray-700 font-medium text-sm sm:text-base"
                >
                  Code
                </label>
                <Input
                  id="code"
                  type="text"
                  placeholder="6-digit code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full rounded-xl bg-[#F9F9F9] border border-[#e0e0e0] focus:ring-2 focus:ring-[#4EA8A1] px-3 sm:px-4 py-2.5 sm:py-3 transition-all duration-200 text-sm sm:text-base"
                />
              </div>
              <div className="flex flex-col gap-1 sm:gap-2">
                <label
                  htmlFor="newPassword"
                  className="text-gray-700 font-medium text-sm sm:text-base"
                >
                  New Password
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3 sm:left-4 text-gray-400 text-sm sm:text-base">
                    <FiLock />
                  </span>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-xl bg-[#F9F9F9] border border-[#e0e0e0] focus:ring-2 focus:ring-[#4EA8A1] pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 transition-all duration-200 text-sm sm:text-base"
                  />
                </div>
              </div>
              <Button
                className="w-full bg-[#4EA8A1] text-white py-2.5 sm:py-3 rounded-full font-semibold text-sm sm:text-base hover:bg-[#39948b] transition-all duration-200"
                type="submit"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
            <span className="text-xs sm:text-sm text-gray-600 mt-4 sm:mt-6 text-center">
              Didn't get a code?{" "}
              <a
                href={`/auth/forgot-password${
                  searchQuery
                    ? `?q=${encodeURIComponent(searchQuery)}&type=${searchType}`
                    : ""
                }`}
                className="text-[#4EA8A1] font-semibold hover:underline transition-all duration-200"
              >
                Resend
              </a>
            </span>
          </div>
        </div>
      </div>
      <Footer />
    </Container>
  );
};

export default ResetPassword;
