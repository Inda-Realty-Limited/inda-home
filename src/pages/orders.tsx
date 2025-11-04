import {
  getOrdersAndPayments,
  OrdersApiResponse,
  OrdersByListingItem,
} from "@/api/payments";
import { Container, Footer, Navbar } from "@/components";
import PaymentReceipt from "@/components/inc/PaymentReceipt";
import { getToken } from "@/helpers";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import {
  FiAlertCircle,
  FiChevronLeft,
  FiChevronRight,
  FiCreditCard,
  FiExternalLink,
  FiFileText,
  FiLoader,
  FiPackage,
} from "react-icons/fi";

const OrdersPage: React.FC = () => {
  const router = useRouter();
  const [data, setData] = useState<OrdersApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"orders" | "payments">("orders");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState<any | null>(null);
  const itemsPerPage = 5;

  const fetchData = async (page: number) => {
    try {
      setLoading(true);
      const res = await getOrdersAndPayments({ page, limit: 20 });
      setData(res);
      setError(null);
    } catch (e: any) {
      setError(e?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/auth");
      return;
    }
    fetchData(1);
  }, [router]);

  const totalOrders = useMemo(() => data?.summary?.totalOrders || 0, [data]);

  // Paginate orders locally (since we're fetching 20 but showing 5 per page)
  const paginatedOrders = useMemo(() => {
    if (!data?.orders) return [];
    const start = (currentPage - 1) * itemsPerPage;
    return data.orders.slice(start, start + itemsPerPage);
  }, [data?.orders, currentPage]);

  const totalOrderPages = useMemo(() => {
    if (!data?.orders) return 0;
    return Math.ceil(data.orders.length / itemsPerPage);
  }, [data?.orders]);

  // Paginate payments similarly
  const paginatedPayments = useMemo(() => {
    if (!data?.payments?.items) return [];
    const start = (currentPage - 1) * itemsPerPage;
    return data.payments.items.slice(start, start + itemsPerPage);
  }, [data?.payments?.items, currentPage]);

  const totalPaymentPages = useMemo(() => {
    if (!data?.payments?.items) return 0;
    return Math.ceil(data.payments.items.length / itemsPerPage);
  }, [data?.payments?.items]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleTabChange = (tab: "orders" | "payments") => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset to first page when switching tabs
  };

  const navigateToResult = (order: OrdersByListingItem) => {
    if (order.listing.listingUrl) {
      // Route to result page with correct query parameters that the page expects
      router.push(
        `/result?q=${encodeURIComponent(order.listing.listingUrl)}&type=link`
      );
    }
  };

  const formatPrice = (price?: number) => {
    if (!price) return "N/A";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getPlanColor = (plan: string) => {
    switch (plan.toLowerCase()) {
      case "free":
        return "bg-green-100 text-green-800 border-green-200";
      case "instant":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "deepdive":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "deeperdive":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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

          {/* Top summary */}
          {data && (
            <div className="mb-6 grid grid-cols-3 gap-3 sm:gap-4">
              <div className="rounded-xl bg-white border border-black/10 p-4">
                <div className="text-xs text-[#6B7280]">Total orders</div>
                <div className="text-2xl font-bold">
                  {data.summary.totalOrders}
                </div>
              </div>
              <div className="rounded-xl bg-white border border-black/10 p-4">
                <div className="text-xs text-[#6B7280]">Listings</div>
                <div className="text-2xl font-bold">
                  {data.summary.totalListings}
                </div>
              </div>
              <div className="rounded-xl bg-white border border-black/10 p-4">
                <div className="text-xs text-[#6B7280]">Payments</div>
                <div className="text-2xl font-bold">
                  {data.summary.totalPayments}
                </div>
              </div>
            </div>
          )}

          {/* Tabs */}
          {data && (
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => handleTabChange("orders")}
                    className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === "orders"
                        ? "border-[#4EA8A1] text-[#4EA8A1]"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <FiPackage size={16} />
                    Orders ({data.summary.totalListings})
                  </button>
                  <button
                    onClick={() => handleTabChange("payments")}
                    className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === "payments"
                        ? "border-[#4EA8A1] text-[#4EA8A1]"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <FiCreditCard size={16} />
                    Payments ({data.summary.totalPayments})
                  </button>
                </nav>
              </div>
            </div>
          )}

          {/* Loading / Error / Empty */}
          {loading && (
            <div className="rounded-2xl border border-black/10 bg-white p-8 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#4EA8A1]/10 text-[#4EA8A1] mb-3 animate-spin">
                <FiLoader />
              </div>
              <div className="text-sm text-[#6B7280]">Loading your orders…</div>
            </div>
          )}
          {error && !loading && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700 flex flex-col items-center">
              <FiAlertCircle className="mb-2" />
              <div className="font-medium">{error}</div>
            </div>
          )}

          {!loading && !error && totalOrders === 0 && (
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
          )}

          {/* Content based on active tab */}
          {!loading && !error && data && (
            <>
              {activeTab === "orders" && (
                <>
                  {paginatedOrders.length > 0 ? (
                    <div className="space-y-4">
                      {paginatedOrders.map((order) => (
                        <div
                          key={order.listingId}
                          className="rounded-xl bg-white border border-black/10 p-3 sm:p-4 hover:shadow-lg hover:border-[#4EA8A1]/30 transition-all duration-200 cursor-pointer group active:scale-[0.98]"
                          onClick={() => navigateToResult(order)}
                        >
                          <div className="flex items-start gap-3 sm:gap-4">
                            {/* Property Image */}
                            <div className="flex-shrink-0 relative">
                              {order.listing.imageUrls?.[0] ? (
                                <div className="relative overflow-hidden rounded-lg">
                                  <Image
                                    src={order.listing.imageUrls[0]}
                                    alt={order.listing.title || "Property"}
                                    width={120}
                                    height={90}
                                    className="w-24 h-18 sm:w-28 sm:h-21 object-cover"
                                    quality={85}
                                    priority={false}
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                                </div>
                              ) : (
                                <div className="w-24 h-18 sm:w-28 sm:h-21 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                                  <FiFileText
                                    className="text-gray-400"
                                    size={24}
                                  />
                                </div>
                              )}
                              {/* Click indicator */}
                              <div className="absolute -top-1 -right-1 w-6 h-6 bg-[#4EA8A1] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 transform scale-75 group-hover:scale-100">
                                <FiExternalLink
                                  size={12}
                                  className="text-white"
                                />
                              </div>
                            </div>

                            {/* Property Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-[#101820] group-hover:text-[#4EA8A1] transition-colors text-sm sm:text-base leading-tight line-clamp-2">
                                    {order.listing.title || "Property Listing"}
                                  </h3>

                                  {/* Mobile: Only show location */}
                                  <p className="text-xs sm:text-sm text-[#6B7280] mt-1 line-clamp-1">
                                    <span className="sm:hidden">
                                      {order.listing.microlocationStd ||
                                        order.listing.propertyTypeStd}
                                    </span>
                                    <span className="hidden sm:inline">
                                      {[
                                        order.listing.microlocationStd,
                                        order.listing.propertyTypeStd,
                                      ]
                                        .filter(Boolean)
                                        .join(" • ")}
                                    </span>
                                  </p>

                                  {/* Price - more prominent on mobile */}
                                  <p className="text-sm sm:text-base font-semibold text-[#101820] mt-1">
                                    {formatPrice(order.listing.priceNGN)}
                                  </p>
                                </div>

                                {/* Tap hint for mobile */}
                                <div className="flex flex-col items-end gap-1 sm:hidden">
                                  <div className="text-xs text-[#4EA8A1] font-medium opacity-60 group-hover:opacity-100 transition-opacity">
                                    Tap to view
                                  </div>
                                </div>
                              </div>

                              {/* Plans - simplified for mobile */}
                              <div className="mt-2 sm:mt-3 flex flex-wrap items-center gap-1 sm:gap-2">
                                {/* Mobile: Show only first plan + count */}
                                <div className="sm:hidden flex items-center gap-1">
                                  <span
                                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${getPlanColor(
                                      order.plans[0].plan
                                    )}`}
                                  >
                                    {order.plans[0].plan}
                                  </span>
                                  {order.plans.length > 1 && (
                                    <span className="text-xs text-[#6B7280]">
                                      +{order.plans.length - 1} more
                                    </span>
                                  )}
                                  <span className="text-xs text-[#6B7280] ml-auto">
                                    {order.lastPaidAt &&
                                      new Date(
                                        order.lastPaidAt
                                      ).toLocaleDateString()}
                                  </span>
                                </div>

                                {/* Desktop: Show all plans */}
                                <div className="hidden sm:flex flex-wrap items-center gap-2 w-full">
                                  {order.plans.map((plan, idx) => (
                                    <span
                                      key={plan.reference + idx}
                                      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${getPlanColor(
                                        plan.plan
                                      )}`}
                                    >
                                      <span className="capitalize">
                                        {plan.plan}
                                      </span>
                                      {plan.paidAt && (
                                        <span className="opacity-75">
                                          ·{" "}
                                          {new Date(
                                            plan.paidAt
                                          ).toLocaleDateString()}
                                        </span>
                                      )}
                                    </span>
                                  ))}
                                  <div className="text-xs text-[#6B7280] ml-auto">
                                    {order.plans.length} plan
                                    {order.plans.length > 1 ? "s" : ""}
                                    {order.lastPaidAt && (
                                      <span className="block sm:inline sm:ml-2">
                                        Last:{" "}
                                        {new Date(
                                          order.lastPaidAt
                                        ).toLocaleDateString()}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FiPackage className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No orders found
                      </h3>
                      <p className="text-gray-500">
                        You haven't placed any orders yet.
                      </p>
                    </div>
                  )}
                </>
              )}

              {activeTab === "payments" && (
                <>
                  {paginatedPayments.length > 0 ? (
                    <div className="space-y-4">
                      {paginatedPayments.map((payment) => (
                        <div
                          key={payment._id}
                          className="rounded-xl bg-white border border-black/10 p-4"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPlanColor(
                                    payment.plan
                                  )}`}
                                >
                                  {payment.plan.charAt(0).toUpperCase() +
                                    payment.plan.slice(1)}
                                </span>
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(
                                    payment.status
                                  )}`}
                                >
                                  {payment.status.charAt(0).toUpperCase() +
                                    payment.status.slice(1)}
                                </span>
                                {/* {payment.status === "success" &&
                                  payment.plan !== "free" && (
                                    <button
                                      onClick={() =>
                                        setSelectedPayment(payment)
                                      }
                                      className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md bg-[#4EA8A1] text-white hover:bg-[#3d8a84] transition-colors"
                                      title="View Receipt"
                                    >
                                      <FiFileText size={12} />
                                      Receipt
                                    </button>
                                  )} */}
                              </div>
                              <p className="font-medium text-[#101820] line-clamp-1">
                                {payment.listingUrl
                                  ? new URL(payment.listingUrl).pathname
                                      .split("/")
                                      .pop()
                                      ?.replace(/-/g, " ") ||
                                    "Property Analysis"
                                  : "Property Analysis"}
                              </p>
                              <p className="text-sm text-[#6B7280]">
                                Ref: {payment.reference}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-[#101820]">
                                {formatPrice(payment.amountNGN)}
                              </div>
                              <div className="text-sm text-[#6B7280]">
                                {payment.paidAt
                                  ? new Date(
                                      payment.paidAt
                                    ).toLocaleDateString()
                                  : "Pending"}
                              </div>
                              <div className="text-xs text-[#6B7280] capitalize">
                                {payment.provider}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FiCreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No payments found
                      </h3>
                      <p className="text-gray-500">
                        You haven't made any payments yet.
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* Pagination */}
              {((activeTab === "orders" && totalOrderPages > 1) ||
                (activeTab === "payments" && totalPaymentPages > 1)) && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                  <div className="text-sm text-[#6B7280]">
                    Page {currentPage} of{" "}
                    {activeTab === "orders"
                      ? totalOrderPages
                      : totalPaymentPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <FiChevronLeft size={16} />
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={
                        currentPage ===
                        (activeTab === "orders"
                          ? totalOrderPages
                          : totalPaymentPages)
                      }
                      className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                      <FiChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
        <Footer />
      </Container>

      {/* Payment Receipt Modal */}
      {selectedPayment && (
        <PaymentReceipt
          payment={selectedPayment}
          onClose={() => setSelectedPayment(null)}
        />
      )}
    </>
  );
};

export default OrdersPage;
