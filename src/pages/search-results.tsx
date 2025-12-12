import { Navbar } from "@/components";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";

type Property = {
  id: string;
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  image: string;
  type: "apartment" | "house" | "land";
};

const DUMMY_PROPERTIES: Property[] = [
  {
    id: "1",
    title: "3 Bed Luxury Apartment",
    location: "Ikoyi, Lagos",
    price: "₦320M",
    beds: 3,
    baths: 3,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
    type: "apartment",
  },
  {
    id: "2",
    title: "4 Bed Terrace Duplex",
    location: "Lekki Phase 1, Lagos",
    price: "₦210M",
    beds: 4,
    baths: 4,
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80",
    type: "house",
  },
  {
    id: "3",
    title: "2 Bed Serviced Apartment",
    location: "Victoria Island, Lagos",
    price: "₦180M",
    beds: 2,
    baths: 2,
    image: "https://images.unsplash.com/photo-1502673530728-f79b4cab31b1?auto=format&fit=crop&w=800&q=80",
    type: "apartment",
  },
  {
    id: "4",
    title: "Residential Land - 900sqm",
    location: "Banana Island, Lagos",
    price: "₦550M",
    beds: 0,
    baths: 0,
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
    type: "land",
  },
];

export default function SearchResultsPage() {
  const router = useRouter();
  const query = (router.query.q as string) || "";
  const [typeFilter, setTypeFilter] = useState<"all" | "apartment" | "house" | "land">("all");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return DUMMY_PROPERTIES.filter((p) => {
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q);
      const matchesType = typeFilter === "all" || p.type === typeFilter;
      return matchesQuery && matchesType;
    });
  }, [query, typeFilter]);

  return (
    <>
      <Head>
        <title>Search Results - Inda</title>
        <meta name="description" content="Property search results" />
      </Head>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">Search Results</h1>
              <p className="text-gray-600 mt-2">
                Showing results for <span className="font-medium text-gray-900">"{query || "All"}"</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Filter:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setTypeFilter("all")}
                  className={`px-3 py-1 rounded-full text-sm ${
                    typeFilter === "all" ? "bg-[#4ea8a1] text-white" : "bg-white border text-gray-700"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setTypeFilter("apartment")}
                  className={`px-3 py-1 rounded-full text-sm ${
                    typeFilter === "apartment" ? "bg-[#4ea8a1] text-white" : "bg-white border text-gray-700"
                  }`}
                >
                  Apartments
                </button>
                <button
                  onClick={() => setTypeFilter("house")}
                  className={`px-3 py-1 rounded-full text-sm ${
                    typeFilter === "house" ? "bg-[#4ea8a1] text-white" : "bg-white border text-gray-700"
                  }`}
                >
                  Houses
                </button>
                <button
                  onClick={() => setTypeFilter("land")}
                  className={`px-3 py-1 rounded-full text-sm ${
                    typeFilter === "land" ? "bg-[#4ea8a1] text-white" : "bg-white border text-gray-700"
                  }`}
                >
                  Land
                </button>
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white border rounded-2xl p-8 text-center text-gray-600">
              No properties found. Try another search.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p) => (
                <div key={p.id} className="bg-white rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-48 w-full overflow-hidden rounded-t-2xl">
                    <img src={p.image} alt={p.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="text-xs text-gray-500 uppercase">{p.type}</div>
                    <h3 className="text-lg font-semibold text-gray-900">{p.title}</h3>
                    <p className="text-gray-600 text-sm">{p.location}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[#4ea8a1] font-semibold">{p.price}</span>
                      <span className="text-gray-600 text-sm">
                        {p.beds ? `${p.beds} bed` : ""} {p.baths ? `• ${p.baths} bath` : ""}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
