import { Container, Footer, Navbar } from "@/components";
import { useRouter } from "next/router";

const Auth = () => {
  const router = useRouter();
  return (
    <Container noPadding className="h-screen bg-white text-inda-dark">
      <Navbar variant="auth" />
      <div className="flex flex-col bg-[#E5E5E573] items-center justify-center rounded-3xl flex-1 w-[50%] mx-auto h-[64.5vh] py-12">
        <h1 className="text-inda-dark text-center font-medium text-3xl sm:text-4xl md:text-5xl mb-6">
          Let’s unlock smarter property decisions.
        </h1>
        <p className="text-inda-dark font-medium text-center text-lg sm:text-xl mb-10 max-w-xl">
          No noise. No spam. Just clarity where it matters most.
        </p>
        <div className="flex flex-col gap-6 w-full max-w-[480px] mx-auto justify-center">
          <button
            onClick={() => {
              router.push("/auth/signup");
            }}
            className="bg-[#F9F9F9] text-inda-dark font-medium text-xl rounded-full w-full h-[64px] shadow-md transition-colors duration-200 ease-in-out sm:w-auto hover:opacity-75"
          >
            Sign Up
          </button>
          <button
            onClick={() => {
              router.push("/auth/signin");
            }}
            className="bg-[#4EA8A1] text-white font-medium text-xl rounded-full px-10 py-5 shadow-md transition-colors duration-200 ease-in-out w-full sm:w-auto hover:opacity-75"
          >
            Sign In
          </button>
        </div>
      </div>
      <Footer />
    </Container>
  );
};

export default Auth;
