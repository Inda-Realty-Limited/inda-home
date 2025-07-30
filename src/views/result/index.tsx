import { Container, Footer, Navbar } from "@/components";

const Result = () => {
  return (
    <Container noPadding className="min-h-screen bg-[#F9F9F9] text-inda-dark">
      <Navbar />
      <main>
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-3xl font-bold mb-4">Search Results</h1>
          <p className="text-lg text-gray-600">No results found.</p>
        </div>
      </main>
      <Footer />
    </Container>
  );
};

export default Result;
