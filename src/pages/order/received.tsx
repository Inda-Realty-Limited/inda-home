import { Container, Footer, Navbar } from "@/components";
import { useRouter } from "next/router";
import React, { useMemo } from "react";

const OrderReceived: React.FC = () => {
  const router = useRouter();
  const { query } = router;
  // Read possible values from query string
  const reference = (query.reference as string) || (query.ref as string) || "";
  const q = (query.q as string) || "";
  const plan = (query.plan as string) || "deepDive";
  const product = useMemo(() => {
    if (plan === "deeperDive") return "Deeper Dive";
    if (plan === "deepDive") return "Deep Dive";
    if (plan === "instant") return "Instant Report";
    return "Deep Dive";
  }, [plan]);
  const orderId = reference || `IND-${Date.now().toString().slice(-5)}`;

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <Container
      noPadding
      className="min-h-screen bg-[#F0F4F3] text-inda-dark flex flex-col"
    >
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl">
          {/* Main confirmation card */}
          <div className="bg-[#E8F4F1] rounded-[24px] p-8 sm:p-12 text-center shadow-lg">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#2D3748] leading-tight mb-6">
              Your request has been
              <br />
              received!
            </h1>

            <p className="text-[#4A5568] mb-2">
              Thanks for choosing{" "}
              <span className="text-[#4EA8A1] font-semibold">{product}</span>
            </p>
            <p className="text-[#4A5568] mb-8">
              Our verification team will now:
            </p>

            {/* Steps */}
            <div className="text-left mb-8 space-y-2">
              <div className="flex items-start gap-3">
                <span className="text-[#4A5568] mt-1">1.</span>
                <span className="text-[#4A5568]">
                  Review your documents & details.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[#4A5568] mt-1">2.</span>
                <span className="text-[#4A5568]">
                  Deliver your report within{" "}
                  {plan === "deeperDive"
                    ? "2-4 working days"
                    : "24-48 working hours"}
                </span>
              </div>
            </div>

            {/* Status Box */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-[#2D3748] mb-4 text-left">
                Status Box
              </h2>

              {/* Order ID Row */}
              <div className="flex bg-transparent border border-[#4EA8A1]/30 rounded-lg mb-2 overflow-hidden">
                <div className="bg-[#4EA8A1] text-white px-4 py-3 font-medium flex-shrink-0 min-w-fit">
                  Order ID:
                </div>
                <div className="px-4 py-3 text-[#4EA8A1] font-medium flex-1 min-w-0">
                  {orderId}
                </div>
              </div>

              {/* Product Row */}
              <div className="flex bg-transparent border border-[#4EA8A1]/30 rounded-lg overflow-hidden">
                <div className="bg-[#4EA8A1] text-white px-4 py-3 font-medium flex-shrink-0 min-w-fit">
                  Product
                </div>
                <div className="px-4 py-3 text-[#4EA8A1] font-medium flex-1 min-w-0">
                  {product}
                </div>
              </div>
            </div>

            {/* Go Home Button */}
            <button
              onClick={handleGoHome}
              className="w-full bg-[#4EA8A1] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#3d8a84] transition-colors duration-200 mb-6"
            >
              Go Home
            </button>
          </div>

          {/* Support Contact */}
          <div className="text-center mt-6 text-[#4A5568] text-sm">
            Support Contact: support@investinda.com | +234 XXX XXX XXXX
          </div>
        </div>
      </main>
      <Footer />
    </Container>
  );
};

export default OrderReceived;
