import Image from "next/image";
import React from "react";
import { FiCheck, FiDownload, FiShare, FiX } from "react-icons/fi";

interface PaymentReceiptProps {
  payment: {
    _id: string;
    reference: string;
    plan: string;
    amountNGN: number;
    currency: string;
    provider: string;
    status: string;
    paidAt: string;
    listingUrl?: string;
    verifyResponse?: {
      data?: {
        customer?: {
          name?: string;
          email?: string;
          phone_number?: string;
        };
      };
    };
  };
  onClose?: () => void;
}

import { useAuth } from "@/contexts/AuthContext";

const PaymentReceipt: React.FC<PaymentReceiptProps> = ({
  payment,
  onClose,
}) => {
  const { user } = useAuth();

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // Get logged-in user name from context or payment response
  const getLoggedInUserName = () => {
      if (user) {
        return (
            (user as any).name ||
            (user as any).firstName ||
            user.email?.split("@")[0] ||
            "Valued Customer"
        );
      }
    return payment.verifyResponse?.data?.customer?.name || "Valued Customer";
  };

  const customerName = getLoggedInUserName();

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="bg-white w-full h-full sm:w-auto sm:h-auto sm:rounded-2xl sm:max-w-md sm:max-h-[90vh] overflow-auto relative">
        {/* Background Logo Pattern */}
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none overflow-hidden">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${(i % 3) * 33 + 10}%`,
                top: `${Math.floor(i / 3) * 18 + 5}%`,
                transform: `rotate(${-20 + (i % 4) * 10}deg)`,
              }}
            >
              <Image
                src="/assets/images/logo.png"
                alt="INDA"
                width={80}
                height={80}
                className="w-16 h-16 opacity-30 filter grayscale"
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm px-6 py-4 flex items-center justify-between border-b border-gray-100 z-10">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <FiX size={20} className="text-gray-600" />
          </button>
          <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <FiShare size={18} className="text-gray-600" />
          </button>
        </div>

        {/* Success Icon */}
        <div className="flex flex-col items-center px-6 pt-8 pb-4 relative z-10">
          <div className="w-16 h-16 bg-[#4EA8A1] rounded-full flex items-center justify-center mb-6 shadow-lg">
            <FiCheck size={32} className="text-white" />
          </div>

          <h1 className="text-2xl font-bold text-[#101820] mb-2">
            Payment Success!
          </h1>
          <p className="text-[#6B7280] text-center mb-8">
            Your payment has been successfully done.
          </p>
        </div>

        {/* Amount */}
        <div className="px-6 pb-8 relative z-10">
          <div className="text-center mb-8">
            <p className="text-[#6B7280] text-lg mb-2">Total Payment</p>
            <p className="text-4xl font-bold text-[#4EA8A1]">
              {formatPrice(payment.amountNGN)}
            </p>
          </div>

          {/* Transaction Details */}
          <div className="space-y-6 mb-8">
            <div className="flex justify-between items-center">
              <span className="text-[#6B7280]">Ref Number</span>
              <span className="font-semibold text-[#101820] font-mono text-xs max-w-[50%] text-right break-all">
                {payment.reference.length > 15
                  ? `${payment.reference.slice(
                      0,
                      8
                    )}...${payment.reference.slice(-4)}`
                  : payment.reference}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#6B7280]">Payment Time</span>
              <span className="font-semibold text-[#101820]">
                {formatDate(payment.paidAt)}, {formatTime(payment.paidAt)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#6B7280]">Payment Method</span>
              <span className="font-semibold text-[#101820] capitalize">
                {payment.provider === "paystack"
                  ? "Bank Transfer"
                  : payment.provider}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[#6B7280]">Sender Name</span>
              <span className="font-semibold text-[#101820]">
                {customerName}
              </span>
            </div>
          </div>

          {/* Get PDF Receipt Button */}
          <button
            onClick={handleDownloadPDF}
            className="w-full bg-white border border-[#4EA8A1]/20 rounded-xl py-4 flex items-center justify-center gap-3 hover:bg-[#4EA8A1]/5 transition-colors mb-6"
          >
            <FiDownload size={20} className="text-[#4EA8A1]" />
            <span className="text-[#4EA8A1] font-medium">Get PDF Receipt</span>
          </button>

          {/* Done Button */}
          <button
            onClick={onClose}
            className="w-full bg-[#4EA8A1] hover:bg-[#3d9691] text-white font-semibold py-4 rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentReceipt;
