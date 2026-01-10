import { Button, Container, Footer, Input, Navbar } from "@/components";
import { useToast } from "@/components/ToastProvider";
import { useAuth } from "@/contexts/AuthContext";
import { createLoginLimiter } from "@/utils/rateLimiter";
import { loginSchema, validateAndSanitize } from "@/utils/validation";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FiLock, FiMail } from "react-icons/fi";
import CryptoJS from "crypto-js";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("");
  const [returnTo, setReturnTo] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [blockTime, setBlockTime] = useState<number | null>(null);
  const toast = useToast();
  const router = useRouter();
  const { login: authLogin } = useAuth();

  useEffect(() => {
    if (router.isReady) {
      const { q, type, returnTo: rt } = router.query;
      setSearchQuery((q as string) || "");
      setSearchType((type as string) || "");
      setReturnTo((rt as string) || "");
    }
  }, [router.isReady, router.query]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (blockTime && blockTime > 0) {
      interval = setInterval(() => {
        setBlockTime(prev => (prev && prev > 1000 ? prev - 1000 : null));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [blockTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = validateAndSanitize(loginSchema, { email, password });

    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }

    const limiter = createLoginLimiter(email);
    const limitCheck = limiter.checkLimit();

    if (!limitCheck.allowed) {
      const seconds = Math.ceil((limitCheck.blockedFor || limitCheck.resetIn) / 1000);
      setBlockTime(limitCheck.blockedFor || limitCheck.resetIn);
      toast.showToast(
        `Too many failed attempts. Please wait ${seconds} seconds.`,
        3000,
        "error"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const _response = await authLogin(validation.data.email, validation.data.password);

      limiter.reset();
      toast.showToast("Sign in successful!", 2000, "success");

      setTimeout(() => {
        // Get user from localStorage to check role
        const storedUser = localStorage.getItem('inda_user');
        let userRole = null;

        if (storedUser) {
          try {
            const decrypted = CryptoJS.AES.decrypt(storedUser, process.env.NEXT_PUBLIC_ENCRYPTION_SECRET || '').toString(CryptoJS.enc.Utf8);
            const user = JSON.parse(decrypted);
            userRole = user.role;
          } catch (e) {
            console.error('Failed to decrypt user data:', e);
          }
        }

        // Role-based redirect
        const isProRole = userRole === 'Agent' || userRole === 'Developer' || userRole === 'Admin';

        if (isProRole) {
          // Pro users go to dashboard
          router.push('/dashboard');
          return;
        }

        // Buyers follow normal redirect logic
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
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || "Sign in failed.";
      toast.showToast(errorMessage, 2500, "error");
    } finally {
      setIsSubmitting(false);
    }
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
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors(prev => ({ ...prev, email: "" }));
                    }}
                    className={`w-full rounded-xl bg-[#F9F9F9] border ${errors.email ? "border-red-500" : "border-[#e0e0e0]"
                      } focus:ring-2 focus:ring-[#4EA8A1] pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 transition-all duration-200 text-sm sm:text-base`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.email}</p>
                )}
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
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors(prev => ({ ...prev, password: "" }));
                    }}
                    className={`w-full rounded-xl bg-[#F9F9F9] border ${errors.password ? "border-red-500" : "border-[#e0e0e0]"
                      } focus:ring-2 focus:ring-[#4EA8A1] pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 transition-all duration-200 text-sm sm:text-base`}
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.password}</p>
                )}
              </div>
              <div className="flex justify-end">
                <a
                  href={`/auth/forgot-password${returnTo
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
              {blockTime && blockTime > 0 && (
                <div className="text-center text-sm text-red-600">
                  Please wait {Math.ceil(blockTime / 1000)} seconds before trying again
                </div>
              )}
              <Button
                className="w-full bg-[#4EA8A1] text-white py-2.5 sm:py-3 rounded-full font-semibold text-sm sm:text-base hover:bg-[#39948b] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={isSubmitting || (blockTime !== null && blockTime > 0)}
              >
                {isSubmitting ? "Signing in..." : "Continue"}
              </Button>
            </form>
            <span className="text-xs sm:text-sm text-gray-600 mt-4 sm:mt-6 text-center">
              Don&apos;t have an account?{" "}
              <a
                href={`/auth/signup${returnTo
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
