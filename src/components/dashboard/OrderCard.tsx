import React from 'react';
import Image from 'next/image';
import { FiFileText, FiExternalLink } from 'react-icons/fi';
import { OrdersByListingItem } from '@/api/payments';

interface OrderCardProps {
    order: OrdersByListingItem & { id?: string; status?: string; type?: string; reportId?: string };
    onClick: (order: any) => void;
    formatPrice: (price?: number) => string;
    getPlanColor: (plan: string) => string;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onClick, formatPrice, getPlanColor }) => {
    return (
        <div
            className="rounded-xl bg-white border border-black/10 p-3 sm:p-4 hover:shadow-lg hover:border-[#4EA8A1]/30 transition-all duration-200 cursor-pointer group active:scale-[0.98]"
            onClick={() => onClick(order)}
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

                        {/* Status for Reports Hub */}
                        {order.status && (
                            <div className="hidden sm:block">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${order.status === 'READY' || order.status === 'Completed' ? 'bg-green-50 text-green-600 border-green-100' :
                                        order.status === 'Pending' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                                            'bg-blue-50 text-blue-600 border-blue-100'
                                    }`}>
                                    {order.status}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Plans */}
                    <div className="mt-2 sm:mt-3 flex flex-wrap items-center gap-1 sm:gap-2">
                        <div className="hidden sm:flex flex-wrap items-center gap-2 w-full">
                            {order.plans.map((plan, idx) => (
                                <span
                                    key={(plan.reference || idx) + idx}
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
                                {(order.lastPaidAt || order.plans[0]?.paidAt) && (
                                    <span className="block sm:inline sm:ml-2">
                                        {new Date(
                                            (order.lastPaidAt || order.plans[0]?.paidAt) as string
                                        ).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Mobile view for status/plans */}
                        <div className="sm:hidden flex items-center justify-between w-full mt-1">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${order.status === 'READY' || order.status === 'Completed' ? 'bg-green-50 text-green-600 border-green-100' :
                                    order.status === 'Pending' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' :
                                        'bg-blue-50 text-blue-600 border-blue-100'
                                }`}>
                                {order.status || order.plans[0]?.plan}
                            </span>
                            <span className="text-xs text-[#6B7280]">
                                {new Date(
                                    (order.lastPaidAt || order.plans[0]?.paidAt) as string
                                ).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderCard;
