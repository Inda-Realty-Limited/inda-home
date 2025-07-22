import { Button, Container, Input, Navbar, Text } from "@/components";

const Landing: React.FC = () => {
  return (
    <Container noPadding className="min-h-screen bg-inda-light text-inda-dark">
      <Navbar />
      <section className="flex flex-col items-center justify-center min-h-[70vh]">
        <Text
          as="h1"
          size="7xl"
          className="font-extrabold text-center mb-4 text-inda-dark leading-tight"
        >
          Know before you buy
        </Text>
        <Text
          as="p"
          size="3xl"
          className="font-medium text-center mb-10 text-inda-dark/80 tracking-wider"
        >
          Inda reveals hidden risks, fake prices, and shady listings — in
          seconds.
        </Text>
        <div className="flex flex-col sm:flex-row items-center space-x-3 w-full max-w-[50%] mx-auto">
          <div className="relative flex items-center w-full sm:w-[90%]">
            <span className="absolute left-6 flex items-center">
              {/* Replace with your SVG icon import below */}
              {/* Example: <SvgIcon SvgComponent={SearchIcon} width={28} height={28} className="text-inda-teal" /> */}
              <svg
                width="22"
                height="22"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="text-inda-teal"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                />
              </svg>
            </span>
            <Input
              type="text"
              placeholder="Search any listing, agent, developer, address or link"
              className="w-full rounded-full pl-14 pr-8 py-5 text-[22px] placeholder:text-[#10182054] placeholder:text-md font-medium text-inda-dark/80 focus:outline-none"
            />
            <span className="absolute right-6"></span>
          </div>
          <Button
            variant="primary"
            className="rounded-full font-semibold px-14 py-5 text-xl whitespace-nowrap flex items-center justify-center w-full sm:w-auto min-w-[180px]"
          >
            Run Check
          </Button>
        </div>
        {/* Results area below input, hidden until user searches */}
        <div className="w-full max-w-[50%] mx-auto mt-8">
          {/* Results will be rendered here after search */}
        </div>
      </section>
    </Container>
  );
};

export default Landing;
