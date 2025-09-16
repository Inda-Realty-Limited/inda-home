import { Container, Footer, Navbar } from "@/components";
import { getToken } from "@/helpers";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { FiFileText } from "react-icons/fi";

const OrdersPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/auth");
    }
  }, [router]);

  return (
    <>
      <Head>
        <title>Orders & Reports • Inda</title>
      </Head>
      <Container
        noPadding
        className="min-h-screen bg-[#E5E5E5] text-[#101820] flex flex-col"
      >
        <Navbar />
        <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-12 flex-1">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 text-[#101820]">
              Orders & Reports
            </h1>
            <p className="text-[#6B7280] text-sm sm:text-base lg:text-lg">
              Track your property analysis purchases and download reports.
            </p>
          </div>

          {/* Orders Section */}
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-[#101820]">
                Recent Orders
              </h2>
              <div className="text-xs sm:text-sm text-[#6B7280]">
                Total orders:{" "}
                <span className="font-medium text-[#101820]">0</span>
              </div>
            </div>

            {/* Empty State */}
            <div className="rounded-2xl sm:rounded-3xl border border-black/10 bg-white p-6 sm:p-8 lg:p-12 text-center shadow-sm">
              <div className="inline-flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#4EA8A1]/10 to-[#4EA8A1]/5 text-[#4EA8A1] mb-4 sm:mb-6">
                <FiFileText size={24} className="sm:hidden" />
                <FiFileText size={32} className="hidden sm:block" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-[#101820] mb-2 sm:mb-3">
                No orders yet
              </h3>
              <p className="text-[#6B7280] text-sm sm:text-base mb-4 sm:mb-6 max-w-sm sm:max-w-md mx-auto">
                Your property analysis purchases and reports will appear here.
                Start by analyzing a property to see your first order.
              </p>
              <button
                onClick={() => router.push("/")}
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#4EA8A1] text-white text-sm sm:text-base font-medium hover:bg-[#3d9691] transition-colors duration-200"
              >
                <FiFileText size={16} className="sm:hidden" />
                <FiFileText size={18} className="hidden sm:block" />
                Analyze Property
              </button>
            </div>

            {/* Future: Orders Table would go here */}
            {/* 
            <div className="rounded-2xl border border-black/10 bg-white overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-black/5 bg-gray-50/50">
                <h3 className="font-semibold text-[#101820]">Order History</h3>
              </div>
              <div className="divide-y divide-black/5">
                // Order rows would be mapped here
              </div>
            </div>
            */}
          </div>
        </main>
        <Footer />
      </Container>
    </>
  );
};

export default OrdersPage;
