import { Container, Footer, Navbar } from "@/components";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Auth = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("");

  useEffect(() => {
    if (router.isReady) {
      const { q, type } = router.query;
      setSearchQuery((q as string) || "");
      setSearchType((type as string) || "");
    }
  }, [router.isReady, router.query]);

  const buildAuthUrl = (path: string) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (searchType) params.set("type", searchType);
    return `${path}${params.toString() ? `?${params.toString()}` : ""}`;
  };

  return (
    <Container
      noPadding
      className="min-h-screen bg-white md:h-screen text-inda-dark flex flex-col justify-between"
    >
      <Navbar variant="auth" />
      <div className="flex-1 flex items-center justify-center py-8 sm:py-12">
        <div className="flex flex-col bg-[#E5E5E573] items-center justify-center rounded-3xl w-[95%] sm:w-[85%] md:w-[75%] lg:w-[65%] xl:w-[50%] mx-auto py-8 sm:py-12">
          <h1 className="text-inda-dark text-center font-medium text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 sm:mb-6 px-4">
            Let's unlock smarter property decisions.
          </h1>
          <p className="text-inda-dark font-medium text-center text-base sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-xs sm:max-w-md md:max-w-xl px-4">
            No noise. No spam. Just clarity where it matters most.
          </p>
          <div className="flex flex-col gap-4 sm:gap-6 w-full max-w-[90%] sm:max-w-[400px] md:max-w-[480px] mx-auto justify-center px-4">
            <button
              onClick={() => {
                router.push(buildAuthUrl("/auth/signup"));
              }}
              className="bg-[#F9F9F9] text-inda-dark font-medium text-lg sm:text-xl rounded-full w-full h-[56px] sm:h-[64px] transition-all duration-200 ease-in-out hover:bg-[#F0F0F0] hover:scale-[0.98] active:scale-[0.96]"
            >
              Sign Up
            </button>
            <button
              onClick={() => {
                router.push(buildAuthUrl("/auth/signin"));
              }}
              className="bg-[#4EA8A1] text-white font-medium text-lg sm:text-xl rounded-full w-full h-[56px] sm:h-[64px] transition-all duration-200 ease-in-out hover:bg-[#45968f] hover:scale-[0.98] active:scale-[0.96]"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </Container>
  );
};

export default Auth;
