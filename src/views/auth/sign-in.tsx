import { Button, Container, Footer, Input, Navbar } from "@/components";
import React, { useState } from "react";
import { FiLock, FiMail } from "react-icons/fi";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Container noPadding className="min-h-screen bg-white text-inda-dark">
      <Navbar variant="signIn" />
      <div className="flex flex-col bg-[#E5E5E573] items-center justify-center rounded-3xl flex-1 w-[50%] mx-auto py-12 overflow-y-auto h-[64.5vh] max-h-[64.5vh]">
        <div className="flex flex-col items-center w-full max-w-[480px] mx-auto">
          <h1 className="text-center font-bold text-3xl mb-8">Welcome Back!</h1>
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl bg-[#F9F9F9] border border-[#e0e0e0] shadow focus:ring-2 focus:ring-[#4EA8A1] pl-10 pr-4 py-3 transition-all duration-200"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-gray-700 font-medium">
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
            <div className="flex justify-end">
              <a
                href="#"
                className="text-sm text-[#4EA8A1] font-semibold hover:underline transition-all duration-200"
              >
                Forgot password?
              </a>
            </div>
            <Button className="w-full bg-[#4EA8A1] text-white py-3 rounded-full font-semibold shadow-lg text-base hover:bg-[#39948b] transition-all duration-200">
              Continue
            </Button>
          </form>
          <span className="text-sm text-gray-600 mt-6">
            Don't have an account?{" "}
            <a
              href="/auth/signup"
              className="text-[#4EA8A1] font-semibold hover:underline transition-all duration-200"
            >
              Sign Up
            </a>
          </span>
        </div>
      </div>
      <Footer />
    </Container>
  );
};

export default SignIn;
