const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-inda-light text-inda-dark">
      {/* Navigation Bar */}
      <nav className="w-full flex items-center justify-between px-8 py-4 bg-inda-white shadow">
        <div className="text-2xl font-bold text-inda-teal">Inda Realty</div>
        <div className="flex gap-6">
          <a href="#" className="font-medium hover:text-inda-teal">
            Home
          </a>
          <a href="#" className="font-medium hover:text-inda-teal">
            Features
          </a>
          <a href="#" className="font-medium hover:text-inda-teal">
            Pricing
          </a>
          <a href="#" className="font-medium hover:text-inda-teal">
            Sign In
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-24 px-4 text-center">
        <h1 className="text-5xl font-extrabold mb-6 text-inda-teal">
          Know Before You Buy
        </h1>
        <p className="text-xl mb-8 max-w-xl">
          Inda helps you discover hidden risks, fake prices, and shady listings
          instantly. Search any property, agent, or developer and get the truth
          before you invest.
        </p>
        <button className="px-8 py-3 rounded bg-inda-teal text-inda-white font-semibold text-lg shadow hover:bg-inda-dark transition">
          Try Inda Now
        </button>
      </section>
    </div>
  );
};

export default Landing;
