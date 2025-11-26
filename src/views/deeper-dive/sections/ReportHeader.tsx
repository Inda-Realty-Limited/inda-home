import React from "react";

type Props = {
  title: string;
  location: string;
  price: number;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  size: number;
  imageUrls: string[];
  listingUrl: string;
};

const ReportHeader: React.FC<Props> = ({
  title,
  location,
  price,
  propertyType,
  bedrooms,
  bathrooms,
  size,
  listingUrl,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="w-full px-6">
      <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-indigo-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {title}
            </h1>
            <p className="text-gray-600 mb-4">{location}</p>
          </div>
          <div className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-lg font-semibold whitespace-nowrap ml-4">
            Deeper Dive
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <div className="bg-white/70 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">Price</p>
            <p className="text-lg font-bold text-gray-900">{formatPrice(price)}</p>
          </div>
          <div className="bg-white/70 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">Type</p>
            <p className="text-lg font-bold text-gray-900">{propertyType}</p>
          </div>
          <div className="bg-white/70 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">Beds/Baths</p>
            <p className="text-lg font-bold text-gray-900">
              {bedrooms}/{bathrooms}
            </p>
          </div>
          <div className="bg-white/70 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-1">Size</p>
            <p className="text-lg font-bold text-gray-900">{size}m²</p>
          </div>
        </div>

        <a
          href={listingUrl}
          target="_blank"
          rel="noreferrer"
          className="text-indigo-600 hover:text-indigo-800 font-medium text-sm hover:underline"
        >
          View Original Listing →
        </a>
      </div>
    </div>
  );
};

export default ReportHeader;

