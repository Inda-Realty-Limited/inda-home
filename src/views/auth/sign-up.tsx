import { register, RegisterPayload } from "@/api/auth";
import { Button, Container, Footer, Input, Navbar } from "@/components";
import { useToast } from "@/components/ToastProvider";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import {
  FiBriefcase,
  FiChevronDown,
  FiGlobe,
  FiHome,
  FiLock,
  FiMail,
  FiSearch,
  FiTag,
  FiUser,
  FiUsers,
} from "react-icons/fi";

const Signup: React.FC = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [lookingToDo, setLookingToDo] = useState("");
  const [hearAboutUs, setHearAboutUs] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  // OTP state
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpInputs = Array.from({ length: 6 }, (_, i) =>
    React.createRef<HTMLInputElement>()
  );
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const toast = useToast();

  const useRegisterMutation = () =>
    useMutation({
      mutationFn: async (payload: RegisterPayload) => await register(payload),
    });

  const registerMutation = useRegisterMutation();
  useEffect(() => {
    if (registerMutation.isSuccess) {
      toast.showToast(
        "Sign up successful! Please verify your email.",
        2500,
        "success"
      );
      setTimeout(() => setStep(3), 800);
    } else if (registerMutation.isError) {
      toast.showToast(
        registerMutation.error instanceof Error
          ? registerMutation.error.message
          : "Sign up failed. Please try again.",
        3000,
        "error"
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registerMutation.isSuccess, registerMutation.isError]);

  const [verifyOtpApi, setVerifyOtpApi] = useState<any>(null);
  const [requestResetApi, setRequestResetApi] = useState<any>(null);
  useEffect(() => {
    import("@/api/auth").then((mod) => {
      setVerifyOtpApi(() => mod.verifyOtp);
      setRequestResetApi(() => mod.requestResetPassword);
    });
  }, []);

  const lookingToDoOptions = [
    { value: "buy", label: "Buy a home to live in", icon: <FiHome /> },
    { value: "invest", label: "Invest in Property", icon: <FiBriefcase /> },
    { value: "agent", label: "I am an agent or developer", icon: <FiUser /> },
    {
      value: "bank",
      label: "I work with a bank or mortgage company",
      icon: <FiTag />,
    },
    { value: "browse", label: "Just Browsing", icon: <FiGlobe /> },
  ];

  const hearAboutUsOptions = [
    {
      value: "search",
      label: "Search Engines: Google, Bing, etc.",
      icon: <FiSearch />,
    },
    {
      value: "social",
      label: "Social Media: Facebook, Instagram, Twitter, YouTube, etc.",
      icon: <FiUsers />,
    },
    {
      value: "ads",
      label: "Online Ads: Google Ads, social media ads, etc.",
      icon: <FiTag />,
    },
    {
      value: "referral",
      label: "Referral: A friend, family member, or colleague",
      icon: <FiUser />,
    },
    {
      value: "website",
      label: "Website: Direct visit to our website",
      icon: <FiGlobe />,
    },
    { value: "newsletter", label: "Email Newsletter", icon: <FiMail /> },
    {
      value: "print",
      label: "Print Ads: Newspaper, magazine, or flyer",
      icon: <FiTag />,
    },
    { value: "other", label: "Other", icon: <FiTag /> },
  ];

  return (
    <Container
      noPadding
      className={`${
        step === 2 ? "min-h-screen" : "h-screen"
      } bg-white text-inda-dark`}
    >
      <Navbar variant="signUp" />
      <div
        className={`flex flex-col bg-[#E5E5E573] items-center justify-center rounded-3xl flex-1 w-[50%] mx-auto py-12 overflow-y-auto ${
          step === 2 ? "h-full" : "h-[64.5vh] max-h-[64.5vh]"
        }`}
      >
        {step === 1 && (
          <>
            <h1 className="text-inda-dark text-center font-medium text-3xl sm:text-4xl md:text-5xl mb-6">
              See the truth behind that listing today!
            </h1>
            <p className="text-inda-dark font-medium text-center text-lg sm:text-xl mb-10 max-w-xl">
              No noise. No spam. Just clarity where it matters most.
            </p>
            <div className="flex flex-col gap-6 w-full max-w-[480px] mx-auto justify-center">
              <button
                onClick={() => {}}
                className="bg-[#F9F9F9] text-inda-dark font-medium text-xl rounded-full w-full h-[64px] shadow-md transition-colors duration-200 ease-in-out sm:w-auto hover:opacity-75 flex items-center justify-center gap-3"
              >
                <FcGoogle className="w-6 h-6" />
                Continue with Google
              </button>
              <button
                onClick={() => {
                  setStep(2);
                }}
                className="bg-[#4EA8A1] text-white font-medium text-xl rounded-full px-10 py-5 shadow-md transition-colors duration-200 ease-in-out w-full sm:w-auto hover:opacity-75"
              >
                Use Email Instead
              </button>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <div className="flex flex-col items-center w-full max-w-[480px] mx-auto">
              <h1 className="text-center font-bold text-2xl mb-8">
                Sign up with email
              </h1>
              <form
                className="w-full flex flex-col gap-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  registerMutation.mutate({
                    email,
                    firstName,
                    lastName,
                    password,
                    howDidYouHearAboutUs: hearAboutUs,
                    todo: lookingToDo,
                  });
                }}
              >
                {/* ...existing form fields... */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-gray-700 font-medium">
                    Email
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-gray-400">
                      <FiMail />
                    </span>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl bg-[#F9F9F9] border border-[#e0e0e0] shadow focus:ring-2 focus:ring-[#4EA8A1] pl-10 pr-4 py-3 transition-all duration-200"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="firstName"
                    className="text-gray-700 font-medium"
                  >
                    First Name
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-gray-400">
                      <FiUser />
                    </span>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full rounded-xl bg-[#F9F9F9] border border-[#e0e0e0] shadow focus:ring-2 focus:ring-[#4EA8A1] pl-10 pr-4 py-3 transition-all duration-200"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="lastName"
                    className="text-gray-700 font-medium"
                  >
                    Last Name
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-gray-400">
                      <FiUser />
                    </span>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full rounded-xl bg-[#F9F9F9] border border-[#e0e0e0] shadow focus:ring-2 focus:ring-[#4EA8A1] pl-10 pr-4 py-3 transition-all duration-200"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="password"
                    className="text-gray-700 font-medium"
                  >
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-gray-400">
                      <FiLock />
                    </span>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl bg-[#F9F9F9] border border-[#e0e0e0] shadow focus:ring-2 focus:ring-[#4EA8A1] pl-10 pr-4 py-3 transition-all duration-200"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="lookingToDo"
                    className="text-gray-700 font-medium"
                  >
                    What are you looking to do?
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      className="w-full flex items-center justify-between rounded-xl bg-[#F9F9F9] border border-[#e0e0e0] shadow px-4 py-3 transition-all duration-200 focus:ring-2 focus:ring-[#4EA8A1] text-left"
                      onClick={() =>
                        setOpenDropdown(
                          openDropdown === "lookingToDo" ? null : "lookingToDo"
                        )
                      }
                    >
                      <span className="flex items-center gap-2">
                        {
                          lookingToDoOptions.find(
                            (opt) => opt.value === lookingToDo
                          )?.icon
                        }
                        {lookingToDo ? (
                          lookingToDoOptions.find(
                            (opt) => opt.value === lookingToDo
                          )?.label
                        ) : (
                          <span className="text-gray-400">
                            Select an option
                          </span>
                        )}
                      </span>
                      <FiChevronDown />
                    </button>
                    {openDropdown === "lookingToDo" && (
                      <div className="absolute z-10 mt-2 w-full bg-white rounded-xl shadow-lg border border-[#e0e0e0]">
                        {lookingToDoOptions.map((opt) => (
                          <div
                            key={opt.value}
                            className="px-4 py-3 flex items-center gap-2 cursor-pointer hover:bg-[#F9F9F9] transition"
                            onClick={() => {
                              setLookingToDo(opt.value);
                              setOpenDropdown(null);
                            }}
                          >
                            {opt.icon}
                            <span>{opt.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="hearAboutUs"
                    className="text-gray-700 font-medium"
                  >
                    How did you hear about us?
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      className="w-full flex items-center justify-between rounded-xl bg-[#F9F9F9] border border-[#e0e0e0] shadow px-4 py-3 transition-all duration-200 focus:ring-2 focus:ring-[#4EA8A1] text-left"
                      onClick={() =>
                        setOpenDropdown(
                          openDropdown === "hearAboutUs" ? null : "hearAboutUs"
                        )
                      }
                    >
                      <span className="flex items-center gap-2">
                        {
                          hearAboutUsOptions.find(
                            (opt) => opt.value === hearAboutUs
                          )?.icon
                        }
                        {hearAboutUs ? (
                          hearAboutUsOptions.find(
                            (opt) => opt.value === hearAboutUs
                          )?.label
                        ) : (
                          <span className="text-gray-400">
                            Select an option
                          </span>
                        )}
                      </span>
                      <FiChevronDown />
                    </button>
                    {openDropdown === "hearAboutUs" && (
                      <div className="absolute z-10 mt-2 w-full bg-white rounded-xl shadow-lg border border-[#e0e0e0]">
                        {hearAboutUsOptions.map((opt) => (
                          <div
                            key={opt.value}
                            className="px-4 py-3 flex items-center gap-2 cursor-pointer hover:bg-[#F9F9F9] transition"
                            onClick={() => {
                              setHearAboutUs(opt.value);
                              setOpenDropdown(null);
                            }}
                          >
                            {opt.icon}
                            <span>{opt.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  className="w-full bg-[#4EA8A1] text-white py-3 rounded-full font-semibold mt-4 shadow-lg text-base hover:bg-[#39948b] transition-all duration-200"
                  type="submit"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? "Signing up..." : "Continue"}
                </Button>
              </form>
              <span className="text-sm text-gray-600 mt-6">
                Already have an account?{" "}
                <a
                  href="/auth/signin"
                  className="text-[#4EA8A1] font-semibold hover:underline transition-all duration-200"
                >
                  Log in
                </a>
              </span>
            </div>
          </>
        )}

        {step === 3 && (
          <div className="flex flex-col items-center w-full max-w-[480px] mx-auto animate-fade-in">
            <div className="w-full rounded-3xl px-0 py-0 flex flex-col items-center">
              <h1 className="text-center font-bold text-3xl mb-3 text-inda-dark tracking-tight">
                Verify your email
              </h1>
              <p className="text-center text-gray-600 mb-8 text-base">
                Enter the 6-digit code sent to{" "}
                <span className="font-semibold text-[#4EA8A1]">{email}</span>
              </p>
              <form
                className="w-full flex flex-col gap-7"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setOtpLoading(true);
                  const code = otp.join("");
                  if (code.length !== 6) {
                    toast.showToast(
                      "Please enter the 6-digit code.",
                      2500,
                      "error"
                    );
                    setOtpLoading(false);
                    return;
                  }
                  if (!verifyOtpApi) {
                    toast.showToast("Please wait, loading...", 2000, "error");
                    setOtpLoading(false);
                    return;
                  }
                  try {
                    await verifyOtpApi({ email, code });
                    setOtpLoading(false);
                    toast.showToast("Email verified!", 2000, "success");
                  } catch (err: any) {
                    setOtpLoading(false);
                    toast.showToast(
                      err?.response?.data?.message ||
                        err?.message ||
                        "Invalid code. Please try again.",
                      2500,
                      "error"
                    );
                  }
                }}
              >
                <div className="flex justify-center gap-4 mb-2">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={otpInputs[idx]}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, "");
                        if (!val) return;
                        const newOtp = [...otp];
                        newOtp[idx] = val;
                        setOtp(newOtp);
                        if (idx < 5 && val) otpInputs[idx + 1].current?.focus();
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace") {
                          if (otp[idx]) {
                            const newOtp = [...otp];
                            newOtp[idx] = "";
                            setOtp(newOtp);
                          } else if (idx > 0) {
                            otpInputs[idx - 1].current?.focus();
                          }
                        }
                      }}
                      className={`w-14 h-16 text-3xl text-center rounded-xl border-2 transition-all duration-200 outline-none bg-[#F9F9F9] focus:ring-2 focus:ring-[#4EA8A1] border-[#e0e0e0] focus:border-[#4EA8A1] ${
                        digit ? "border-[#4EA8A1] bg-white" : ""
                      }`}
                      style={{
                        letterSpacing: "2px",
                        boxShadow: digit ? "0 2px 12px #4ea8a12a" : undefined,
                      }}
                    />
                  ))}
                </div>
                {/* All error/success handled by toast, no inline text */}
                <Button
                  className="w-full bg-[#4EA8A1] text-white py-3 rounded-full font-semibold shadow-lg text-base hover:bg-[#39948b] transition-all duration-200 mt-2"
                  type="submit"
                  disabled={otpLoading}
                >
                  {otpLoading ? "Verifying..." : "Verify"}
                </Button>
              </form>
              <button
                className="mt-6 text-[#4EA8A1] font-semibold hover:underline text-sm disabled:opacity-60"
                type="button"
                disabled={resendLoading}
                onClick={async () => {
                  if (!requestResetApi) return;
                  setResendLoading(true);
                  try {
                    await requestResetApi({ email });
                    toast.showToast("Verification code resent!", 2000, "info");
                  } catch (err: any) {
                    toast.showToast(
                      err?.response?.data?.message ||
                        err?.message ||
                        "Failed to resend code.",
                      2500,
                      "error"
                    );
                  }
                  setResendLoading(false);
                }}
              >
                {resendLoading ? "Resending..." : "Resend code"}
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </Container>
  );
};

export default Signup;
