import { Button, Container, Footer, Input, Navbar } from "@/components";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import {
  FiBriefcase,
  FiChevronDown,
  FiGlobe,
  FiHome,
  FiMail,
  FiSearch,
  FiTag,
  FiUser,
  FiUsers,
} from "react-icons/fi";

const Signup: React.FC = () => {
  const [step, setStep] = useState(1);
  const [lookingToDo, setLookingToDo] = useState("");
  const [hearAboutUs, setHearAboutUs] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

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
              <form className="w-full flex flex-col gap-6">
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
                      className="w-full rounded-xl bg-[#F9F9F9] border border-[#e0e0e0] shadow focus:ring-2 focus:ring-[#4EA8A1] pl-10 pr-4 py-3 transition-all duration-200"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="phone" className="text-gray-700 font-medium">
                    Phone Number
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-gray-400">
                      <FiTag />
                    </span>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Phone Number"
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
                <Button className="w-full bg-[#4EA8A1] text-white py-3 rounded-full font-semibold mt-4 shadow-lg text-base hover:bg-[#39948b] transition-all duration-200">
                  Continue
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
      </div>
      <Footer />
    </Container>
  );
};

export default Signup;
