import { Container, Footer, Input, Navbar, Text } from "@/components";
import { getToken } from "@/helpers";
import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useMotionValue,
} from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/router";
import React, {
  useEffect,
  useState as useFAQState,
  useRef,
  useState,
} from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import {
  FiBarChart2,
  FiHome,
  FiLink,
  FiMapPin,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import { GiBrain } from "react-icons/gi";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";

const sampleData = [
  { id: 1, name: "Lagos Luxury Villa", type: "listing" },
  { id: 2, name: "John Doe", type: "agent" },
  { id: 3, name: "Prime Developers", type: "developer" },
  { id: 4, name: "Abuja Smart Home", type: "listing" },
  { id: 5, name: "Jane Smith", type: "agent" },
];

const searchTypes = [
  {
    id: "address",
    label: "Address",
    icon: FiMapPin,
    placeholder: "15 Lekki Phase 1, Lagos",
    description: "Search by property address",
  },
  {
    id: "agent",
    label: "Agent Name",
    icon: FiUsers,
    placeholder: "John Smith Real Estate",
    description: "Find agents and reviews",
  },
  {
    id: "developer",
    label: "Developer Name",
    icon: HiOutlineBuildingOffice2,
    placeholder: "Dangote Properties Ltd",
    description: "Check developer projects",
  },
  {
    id: "smart",
    label: "Smart Search",
    icon: GiBrain,
    placeholder: "luxury apartment Victoria Island",
    description: "AI-powered property search",
  },
  {
    id: "link",
    label: "Paste Link",
    icon: FiLink,
    placeholder: "https://propertypro.ng/property/...",
    description: "Analyze any listing URL",
  },
  {
    id: "property",
    label: "Property Name",
    icon: FiHome,
    placeholder: "Eko Pearl Towers",
    description: "Search specific properties",
  },
];

const Marquee: React.FC<{
  duration?: number;
  reverse?: boolean;
  className?: string;
  children: React.ReactNode;
}> = ({ duration = 20, reverse = false, className, children }) => {
  const x = useMotionValue(0);
  const itemRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const update = () => {
      const w = itemRef.current?.offsetWidth ?? 0;
      const cw = containerRef.current?.offsetWidth ?? 0;
      setContentWidth(w);
      setContainerWidth(cw);
    };
    update();

    const ro =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(update) : null;
    if (ro) {
      if (itemRef.current) ro.observe(itemRef.current);
      if (containerRef.current) ro.observe(containerRef.current);
    }

    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      ro?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (contentWidth > 0) {
      x.set(reverse ? -contentWidth : 0);
    }
  }, [contentWidth, reverse]);

  useAnimationFrame((t, delta) => {
    if (!contentWidth || !duration) return;
    const baseDistance = containerWidth || contentWidth; // use visible band width to keep perceived speed constant
    const pxPerSec = baseDistance / duration;
    const step = (pxPerSec * delta) / 1000;
    let next = x.get() + (reverse ? step : -step);

    if (!reverse && next <= -contentWidth) next += contentWidth;
    if (reverse && next >= 0) next -= contentWidth;
    x.set(next);
  });

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden ${className || ""}`}
    >
      <motion.div
        className="flex items-center whitespace-nowrap will-change-transform leading-none h-full"
        style={{ x }}
      >
        <div ref={itemRef} className="flex items-center shrink-0">
          {children}
        </div>
        <div className="flex items-center shrink-0" aria-hidden="true">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

const Landing: React.FC = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedSearchType, setSelectedSearchType] = useState(
    () => searchTypes.find((t) => t.id === "link")!
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  // WhatsApp (Joshua) env for CTA chat
  const INDA_WHATSAPP =
    process.env.NEXT_PUBLIC_WHATSAPP_JOSHUA ||
    process.env.NEXT_PUBLIC_INDA_WHATSAPP ||
    "2349012345678";
  const openWhatsApp = (text: string, phone: string = INDA_WHATSAPP) => {
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    if (typeof window !== "undefined") window.open(url, "_blank");
  };
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Only allow valid URLs when pasting links
  const isValidUrl = (value: string) => {
    try {
      const u = new URL(value.trim());
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  };

  const filtered = sampleData.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  // Landing CTA actions
  const handleSeeSample = () => {
    const demo =
      process.env.NEXT_PUBLIC_DEMO_LISTING_URL ||
      "https://www.propertypro.ng/property";
    router.push(`/result/hidden?q=${encodeURIComponent(demo)}&type=link`);
  };

  const handlePlanSelect = (
    plan: "free" | "instant" | "deep-dive" | "deeper-dive"
  ) => {
    const base = "/auth";
    const params = new URLSearchParams();
    params.set("plan", plan);
    if (selectedSearchType.id === "link" && isValidUrl(search)) {
      params.set("q", search.trim());
      params.set("type", "link");
    }
    router.push(`${base}?${params.toString()}`);
  };

  const handleCTA = () => {
    // Open the rich textarea and focus (autoFocus is set there)
    setIsDropdownOpen(false);
    setSelectedSearchType(searchTypes.find((t) => t.id === "link")!);
    setIsSearchActive(true);
  };

  // Function to handle search with authentication check
  const handleSearch = () => {
    // Only allow link-based searches for now
    if (selectedSearchType.id !== "link" || !isValidUrl(search)) {
      return;
    }
    const token = getToken();

    if (!token) {
      // User is not authenticated, redirect to auth with search query
      router.push(
        `/auth?q=${encodeURIComponent(search)}&type=${selectedSearchType.id}`
      );
    } else {
      // User is authenticated, proceed to result page
      router.push(
        `/result/hidden?q=${encodeURIComponent(search)}&type=${
          selectedSearchType.id
        }`
      );
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        // Also exit active search mode (return to default input)
        setIsSearchActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <Container
      noPadding
      className="min-h-screen bg-[#F9F9F9] text-inda-dark overflow-hidden"
    >
      <Navbar />
      <motion.section
        className="flex flex-col bg-[#f9f9f9] items-center justify-center min-h-[70vh] relative z-10 px-4 sm:px-6 lg:px-8 py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="flex flex-col items-center justify-center w-full max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-8 sm:mb-12"
          >
            <h1 className="font-extrabold text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl mb-6 sm:mb-8 text-[#101820F2] leading-[0.9]">
              Know before you buy
            </h1>
            <p className="font-medium text-center text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-[#101820E5] tracking-wide max-w-7xl mx-auto px-2 sm:px-4">
              Inda reveals hidden risks, fake prices, and shady listings in
              seconds.
            </p>
          </motion.div>
          <motion.div
            className="flex items-center justify-center w-full max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {/* Dynamic Search Interface */}
            <div className="relative w-full max-w-3xl" ref={dropdownRef}>
              <AnimatePresence mode="wait">
                {!isSearchActive ? (
                  /* Initial State: Dropdown + Input */
                  <motion.div
                    key="dropdown-mode"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col sm:flex-row items-center gap-0 w-full"
                  >
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center bg-white border border-[#4EA8A1] rounded-t-[20px] sm:rounded-l-[20px] sm:rounded-tr-none pl-6 sm:pl-8 pr-4 sm:pr-6 py-4 sm:py-5 min-w-[200px] sm:min-w-[220px] w-full sm:w-auto hover:bg-gray-50 transition-colors duration-200"
                    >
                      <selectedSearchType.icon className="w-5 h-5 text-[#4EA8A1] mr-3" />
                      <span className="text-[#101820] font-medium text-lg sm:text-xl whitespace-nowrap mr-3">
                        {selectedSearchType.label}
                      </span>
                      <svg
                        className={`w-5 h-5 text-[#101820] transition-transform duration-200 ml-auto ${
                          isDropdownOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {/* Initial Input */}
                    <div className="relative flex-1 w-full">
                      <Input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onFocus={() => setIsSearchActive(true)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSearch();
                          }
                        }}
                        placeholder={selectedSearchType.placeholder}
                        className="w-full border border-t-0 sm:border-t border-l sm:border-l-0 border-[#4EA8A1] rounded-b-[20px] sm:rounded-r-[20px] sm:rounded-bl-none pl-6 sm:pl-8 pr-16 sm:pr-20 py-4 sm:py-5 text-lg sm:text-xl placeholder:text-[#9CA3AF] font-medium text-[#101820] focus:outline-none bg-white transition-all duration-200 focus:shadow-lg"
                      />
                      {/* Search Button inside the input */}
                      <button
                        onClick={handleSearch}
                        disabled={!isValidUrl(search)}
                        className={`absolute right-3 top-1/2 transform -translate-y-1/2 rounded-full p-3 transition-all duration-200 ${
                          isValidUrl(search)
                            ? "bg-[#4EA8A1] hover:bg-[#3d9691] hover:shadow-lg hover:scale-105"
                            : "bg-gray-200 cursor-not-allowed"
                        }`}
                      >
                        <BiSearchAlt2 className="text-white text-xl sm:text-2xl" />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  /* Active State: Beautiful Textarea */
                  <motion.div
                    key="textarea-mode"
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="relative w-full group"
                  >
                    {/* Search Type Indicator */}
                    <div className="flex items-center mb-3 px-2">
                      <selectedSearchType.icon className="w-4 h-4 text-[#4EA8A1] mr-2" />
                      <span className="text-sm font-medium text-[#4EA8A1]">
                        {selectedSearchType.label}
                      </span>
                      <button
                        onClick={() => {
                          setIsSearchActive(false);
                          setIsDropdownOpen(true);
                        }}
                        className="ml-auto text-xs text-gray-500 hover:text-[#4EA8A1] transition-colors duration-200"
                      >
                        Change
                      </button>
                    </div>

                    <div className="relative">
                      <textarea
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSearch();
                          }
                          if (e.key === "Escape") {
                            setIsSearchActive(false);
                          }
                        }}
                        placeholder={selectedSearchType.placeholder}
                        rows={3}
                        autoFocus
                        className="w-full border-2 border-[#4EA8A1] rounded-2xl pl-6 sm:pl-8 pr-20 sm:pr-24 py-5 sm:py-6 text-lg sm:text-xl placeholder:text-[#9CA3AF] font-medium text-[#101820] focus:outline-none bg-white/95 backdrop-blur-sm transition-all duration-300 focus:shadow-2xl focus:border-[#3d9691] focus:bg-white min-h-[120px] max-h-[200px] leading-relaxed resize-none overflow-y-auto scrollbar-thin scrollbar-thumb-[#4EA8A1]/20 scrollbar-track-transparent hover:scrollbar-thumb-[#4EA8A1]/40"
                        style={{
                          lineHeight: "1.6",
                          fontFamily: "inherit",
                        }}
                      />

                      <button
                        onClick={handleSearch}
                        disabled={!isValidUrl(search)}
                        className={`absolute right-4 bottom-4 rounded-2xl px-6 py-3.5 transition-all duration-300 flex items-center gap-3 font-medium text-base ${
                          isValidUrl(search)
                            ? "bg-[#4EA8A1] hover:bg-[#3d9691] text-white shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 border border-[#4EA8A1]"
                            : "bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-200"
                        }`}
                      >
                        <BiSearchAlt2 className="text-xl" />
                        <span className="hidden sm:inline">Search</span>
                      </button>

                      <div className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-300 group-focus-within:ring-2 group-focus-within:ring-[#4EA8A1]/30 group-focus-within:ring-offset-2"></div>

                      <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-[#4EA8A1]/5 via-transparent to-[#4EA8A1]/10"></div>
                    </div>

                    <div className="flex items-center justify-between mt-3 px-2">
                      <span className="text-xs text-gray-500 hidden sm:inline">
                        Press Shift+Enter for new line, Enter to search
                      </span>
                      <span className="text-xs text-gray-500 sm:hidden">
                        Tap Enter to search
                      </span>
                      <button
                        onClick={() => setIsSearchActive(false)}
                        className="text-xs text-gray-400 hover:text-[#4EA8A1] transition-colors duration-200 sm:hidden"
                      >
                        Back
                      </button>
                      <span className="text-xs text-gray-400 hidden sm:inline">
                        Esc to go back
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {isDropdownOpen && !isSearchActive && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 right-0 mt-3 w-full bg-white border border-[#4EA8A1] rounded-2xl shadow-xl z-50 overflow-hidden"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3">
                      {searchTypes.map((type, index) => (
                        <button
                          key={type.id}
                          onClick={() => {
                            if (type.id !== "link") return; // disable other types
                            setSelectedSearchType(type);
                            setIsDropdownOpen(false);
                            setSearch("");
                            setIsSearchActive(true);
                          }}
                          disabled={type.id !== "link"}
                          className={`text-left p-5 transition-colors duration-200 ${
                            type.id === "link"
                              ? "hover:bg-[#4EA8A1]/10"
                              : "opacity-50 cursor-not-allowed"
                          } ${
                            index < searchTypes.length - 1
                              ? "border-b sm:border-b-0"
                              : ""
                          } ${
                            (index + 1) % 3 !== 0 &&
                            index < searchTypes.length - 1
                              ? "sm:border-r border-gray-100"
                              : ""
                          } ${index < 3 ? "sm:border-b border-gray-100" : ""} ${
                            selectedSearchType.id === type.id
                              ? "bg-[#4EA8A1]/5 text-[#4EA8A1]"
                              : "text-[#101820]"
                          }`}
                        >
                          <div className="flex items-center mb-2">
                            <type.icon className="w-5 h-5 text-[#4EA8A1] mr-3 flex-shrink-0" />
                            <div className="font-medium text-base lg:text-lg">
                              {type.label}
                            </div>
                          </div>
                          <div className="text-sm lg:text-base text-gray-600 mt-1 leading-tight">
                            {type.description}
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className="w-full flex flex-col items-center justify-center min-h-[60vh] py-12 sm:py-16 md:py-20 rounded-t-[32px] sm:rounded-t-[48px] mt-[-32px] sm:mt-[-48px] relative z-0 overflow-x-hidden px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Text className="text-[#101820F2] text-center font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl mb-12 sm:mb-16 md:mb-20 leading-tight max-w-5xl mx-auto px-4">
            Would you invest in an asset
            <br />
            without knowing its true worth?
          </Text>
        </motion.div>
        <section className="relative flex flex-col items-center justify-center w-full px-0">
          <div className="relative w-full h-[140px] flex items-center justify-center">
            <div className="absolute left-1/2 top-0 w-[120vw] -translate-x-1/2 rotate-[-3deg] z-10 shadow-md overflow-x-hidden">
              <div className="bg-primary h-[106px] px-0 flex items-center text-lg font-semibold whitespace-nowrap border-0 rounded-xl overflow-hidden leading-none">
                {/* Left-to-right marquee (text moves left) */}
                <Marquee duration={22}>
                  <>
                    <span className="mx-6">
                      THE WRONG PROPERTY CAN COST MILLIONS
                    </span>
                    <span className="mx-2 text-inda-dark text-xl">✦</span>
                    <span className="mx-6">
                      THE WRONG PROPERTY CAN COST MILLIONS
                    </span>
                    <span className="mx-2 text-inda-dark text-xl">✦</span>
                    <span className="mx-6">
                      THE WRONG PROPERTY CAN COST MILLIONS
                    </span>
                    <span className="mx-2 text-inda-dark text-xl">✦</span>
                    <span className="mx-6">
                      THE WRONG PROPERTY CAN COST MILLIONS
                    </span>
                    <span className="mx-2 text-inda-dark text-xl">✦</span>
                    <span className="mx-6">
                      THE WRONG PROPERTY CAN COST MILLIONS
                    </span>
                    <span className="mx-2 text-inda-dark text-xl">✦</span>
                    <span className="mx-6">
                      THE WRONG PROPERTY CAN COST MILLIONS
                    </span>
                    <span className="mx-2 text-inda-dark text-xl">✦</span>
                    <span className="mx-6">
                      THE WRONG PROPERTY CAN COST MILLIONS
                    </span>
                    <span className="mx-2 text-inda-dark text-xl">✦</span>
                    <span className="mx-6">
                      THE WRONG PROPERTY CAN COST MILLIONS
                    </span>
                    <span className="mx-2 text-inda-dark text-xl">✦</span>
                    <span className="mx-6">
                      THE WRONG PROPERTY CAN COST MILLIONS
                    </span>
                    <span className="mx-2 text-inda-dark text-xl">✦</span>
                    <span className="mx-6">
                      THE WRONG PROPERTY CAN COST MILLIONS
                    </span>
                    <span className="mx-2 text-inda-dark text-xl">✦</span>
                    <span className="mx-6">
                      THE WRONG PROPERTY CAN COST MILLIONS
                    </span>
                    <span className="mx-2 text-inda-dark text-xl">✦</span>
                    <span className="mx-6">
                      THE WRONG PROPERTY CAN COST MILLIONS
                    </span>
                    <span className="mx-2 text-inda-dark text-xl">✦</span>
                  </>
                </Marquee>
              </div>
            </div>

            <div className="absolute left-1/2 top-0 w-[120vw] -translate-x-1/2 rotate-[3deg] z-20 overflow-x-hidden">
              <div className="bg-primary h-[106px] px-0 flex items-center text-lg font-semibold whitespace-nowrap shadow-md border-0 rounded-xl overflow-hidden leading-none">
                {/* Reverse marquee (text moves right) */}
                <Marquee duration={18} reverse>
                  <>
                    <span className="mx-6">KNOW BEFORE YOU BUY</span>
                    <span className="mx-2 text-inda-dark text-xl">✦</span>
                    <span className="mx-6">KNOW BEFORE YOU BUY</span>
                    <span className="mx-2 text-inda-dark text-xl">✦</span>
                    <span className="mx-6">KNOW BEFORE YOU BUY</span>
                    <span className="mx-2 text-inda-dark text-xl">✦</span>
                    <span className="mx-6">KNOW BEFORE YOU BUY</span>
                    <span className="mx-2 text-inda-dark text-xl">✦</span>
                    <span className="mx-6">KNOW BEFORE YOU BUY</span>
                    <span className="mx-2 text-inda-dark text-xl">✦</span>
                    <span className="mx-6">KNOW BEFORE YOU BUY</span>
                    <span className="mx-2 text-inda-dark text-xl">✦</span>
                    <span className="mx-6">KNOW BEFORE YOU BUY</span>
                    <span className="mx-2 text-inda-dark text-xl">✦</span>
                    <span className="mx-6">KNOW BEFORE YOU BUY</span>
                    <span className="mx-2 text-inda-dark text-xl">✦</span>
                    <span className="mx-6">KNOW BEFORE YOU BUY</span>
                    <span className="mx-2 text-inda-dark text-xl">✦</span>
                    <span className="mx-6">KNOW BEFORE YOU BUY</span>
                    <span className="mx-2 text-inda-dark text-xl">✦</span>
                    <span className="mx-6">KNOW BEFORE YOU BUY</span>
                    <span className="mx-2 text-inda-dark text-xl">✦</span>
                    <span className="mx-6">KNOW BEFORE YOU BUY</span>
                    <span className="mx-2 text-inda-dark text-xl">✦</span>
                    <span className="mx-6">KNOW BEFORE YOU BUY</span>
                    <span className="mx-2 text-inda-dark text-xl">✦</span>
                    <span className="mx-6">KNOW BEFORE YOU BUY</span>
                    <span className="mx-2 text-inda-dark text-xl">✦</span>
                  </>
                </Marquee>
              </div>
            </div>
          </div>
        </section>
      </motion.section>

      <motion.section
        className="w-full flex flex-col items-center justify-center py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col items-center"
        >
          <Text className="text-[#101820F2] text-center font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl mb-2 leading-tight max-w-5xl mx-auto px-4">
            See Every Risk. <br /> Spot Every Opportunity.
          </Text>
          <Text className="text-[#101820E5] text-center font-normal w-full max-w-[700px] lg:text-[22px] mb-4 sm:mb-6">
            Whether it’s valuation, due diligence, or investment potential, Inda
            delivers a clear, data-backed answer you can trust.
          </Text>
          <Image
            src="/assets/images/risk.png"
            width={800}
            height={400}
            alt="Risk & opportunity visual"
            className="mt-4 w-full max-w-4xl h-auto"
          />
        </motion.div>
      </motion.section>
      {/* Inda Report Preview Section */}
      <motion.section
        className="w-[90%] max-sm:w-full flex flex-col px-4 sm:px-6 md:px-8 lg:mx-auto items-center pt-6 sm:pt-8 justify-center min-h-[400px] sm:min-h-[465px] bg-[#F9F9F9]"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.p
          className="text-[#101820F2] text-center font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl mb-4 leading-tight max-w-5xl mx-auto px-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          See an Inda Report in Action
        </motion.p>
        <div
          className="flex flex-col lg:flex-row items-center lg:items-start w-full sm:w-[70%] mx-auto gap-6 sm:gap-8 bg-[#4EA8A129] rounded-2xl p-5 sm:p-[57px] overflow-hidden"
          style={{ boxShadow: "0px 2px 2px 0px #00000026" }}
        >
          <motion.div
            className="flex flex-col items-center justify-center w-full lg:w-auto"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Image
              src="/assets/images/home.png"
              width={540}
              height={238}
              alt="Modern house preview"
              className="rounded-lg object-cover w-full max-w-[540px] h-auto aspect-[540/238]"
            />
          </motion.div>
          <motion.div
            className="flex flex-col space-y-3 items-center lg:items-start justify-between text-center lg:text-left lg:pl-8 xl:pl-12"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h3 className="text-inda-dark font-bold text-xl sm:text-2xl md:text-[28px] mb-1">
              Property Report Preview
            </h3>
            <p className="text-[#101820BD] text-base sm:text-lg md:text-xl max-w-md">
              Get a detailed report on any property, agent or development
              company—including verification status, legal risks, ROI
              projections, and agent trust ratings.
            </p>
            <button
              onClick={handleSeeSample}
              className="w-full sm:w-auto bg-[#0A1A22] text-white text-lg sm:text-xl px-8 sm:px-10 h-[56px] sm:h-[67px] flex items-center justify-center rounded-full hover:bg-[#11242e] transition-all duration-300 hover:scale-105"
            >
              See full report sample
            </button>
          </motion.div>
        </div>
      </motion.section>
      <motion.section
        className="w-full py-12 sm:py-16 md:py-20 px-4 sm:px-6 md:px-8 lg:px-[10%]"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Text className="text-inda-dark font-bold text-2xl sm:text-3xl mb-6 sm:mb-8">
            Features
          </Text>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Feature 1 */}
          <motion.div
            className="bg-[#4EA8A1] rounded-2xl p-6 sm:p-8 flex flex-col items-start gap-4 sm:gap-6 min-h-[140px] sm:min-h-[150px] group hover:scale-105 transition-all duration-300 cursor-pointer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="text-white text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-300">
              <BiSearchAlt2 />
            </span>
            <span className="text-white text-xl sm:text-2xl font-medium">
              Verify Any Listing
            </span>
          </motion.div>
          {/* Feature 2 */}
          <motion.div
            className="bg-[#4EA8A1] rounded-2xl p-6 sm:p-8 flex flex-col items-start gap-4 sm:gap-6 min-h-[140px] sm:min-h-[150px] group hover:scale-105 transition-all duration-300 cursor-pointer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="text-white text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-300">
              <GiBrain />
            </span>
            <span className="text-white text-xl sm:text-2xl font-medium">
              AI Insights You Can Trust
            </span>
          </motion.div>
          {/* Feature 3 */}
          <motion.div
            className="bg-[#4EA8A1] rounded-2xl p-6 sm:p-8 flex flex-col items-start gap-4 sm:gap-6 min-h-[140px] sm:min-h-[150px] group hover:scale-105 transition-all duration-300 cursor-pointer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <span className="text-white text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-300">
              <FiUsers />
            </span>
            <span className="text-white text-xl sm:text-2xl font-medium">
              Detect Scam Agents
            </span>
          </motion.div>
          {/* Feature 4 */}
          <motion.div
            className="bg-[#4EA8A1] rounded-2xl p-6 sm:p-8 flex flex-col items-start gap-4 sm:gap-6 min-h-[140px] sm:min-h-[150px] group hover:scale-105 transition-all duration-300 cursor-pointer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <span className="text-white text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-300">
              <FiBarChart2 />
            </span>
            <span className="text-white text-xl sm:text-2xl font-medium">
              Project ROI Like a Pro
            </span>
          </motion.div>
          {/* Feature 5 */}
          <motion.div
            className="bg-[#4EA8A1] rounded-2xl p-6 sm:p-8 flex flex-col items-start gap-4 sm:gap-6 min-h-[140px] sm:min-h-[150px] group hover:scale-105 transition-all duration-300 cursor-pointer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <span className="text-white text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-300">
              <FiUsers />
            </span>
            <span className="text-white text-xl sm:text-2xl font-medium">
              Community-Sourced Reviews
            </span>
          </motion.div>
          {/* Feature 6 */}
          <motion.div
            className="bg-[#4EA8A1] rounded-2xl p-6 sm:p-8 flex flex-col items-start gap-4 sm:gap-6 min-h-[140px] sm:min-h-[150px] group hover:scale-105 transition-all duration-300 cursor-pointer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <span className="text-white text-2xl sm:text-3xl group-hover:scale-110 transition-transform duration-300">
              <FiTrendingUp />
            </span>
            <span className="text-white text-xl sm:text-2xl font-medium">
              Find Underpriced Deals
            </span>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className="w-full py-16 sm:py-20 md:py-24 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="w-full max-w-full sm:max-w-[80%] mx-auto">
          <motion.div
            className="bg-[rgba(105,217,188,0.35)] rounded-[48px] p-8 sm:p-12 shadow-xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-left mb-12"
            >
              <Text className="text-inda-dark font-bold text-2xl sm:text-3xl mb-2">
                Plans & Pricing
              </Text>
              <p className="font-normal text-md text-[#556457]">
                Inda Pricing Guide (Lagos Listings Only)
              </p>
            </motion.div>
            <div className="bg-[#F9F9F980] rounded-[24px] p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-0">
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
                className="w-full"
              >
                <div className="p-4 sm:p-6 h-full flex flex-col transition-all duration-300  rounded-lg sm:rounded-none">
                  <div className="text-left mb-4 sm:mb-6">
                    <motion.div
                      className="font-bold text-3xl sm:text-4xl mb-2 text-gray-900"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      ₦0
                    </motion.div>
                    <motion.h3
                      className="text-lg sm:text-xl font-bold text-gray-900 mb-2"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      Free Report
                    </motion.h3>
                    <motion.p
                      className="text-xs sm:text-sm text-gray-600 mb-4"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                    >
                      Delivery Time: &lt;20 seconds
                    </motion.p>
                  </div>

                  <motion.div
                    className="flex-1 mb-4 sm:mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                  >
                    <h4 className="text-gray-900 mb-3 text-xs sm:text-sm font-semibold">
                      What You Get:
                    </h4>
                    <ul className="space-y-2">
                      <motion.li
                        className="flex items-center gap-3 text-xs sm:text-sm text-gray-700"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.8 }}
                      >
                        <span className="text-[#4ea8a1] text-base sm:text-lg">
                          ✓
                        </span>
                        Inda Score
                      </motion.li>
                    </ul>
                  </motion.div>

                  <motion.button
                    onClick={() => handlePlanSelect("free")}
                    className="w-full bg-[#4ea8a1] text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-full font-medium hover:bg-[#3d8a84] transition-all duration-300 text-sm sm:text-base"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Choose plan
                  </motion.button>
                </div>
              </motion.div>

              {/* Inda Instant Report */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
                className="w-full"
              >
                <div className="p-4 sm:p-6 h-full flex flex-col transition-all duration-300  rounded-lg sm:rounded-none  ">
                  <div className="text-left mb-4 sm:mb-6">
                    <motion.div
                      className="font-bold text-3xl sm:text-4xl mb-2 text-gray-900"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      ₦7,500
                    </motion.div>
                    <motion.h3
                      className="text-lg sm:text-xl font-bold text-gray-900 mb-2"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    >
                      Inda Instant Report
                    </motion.h3>
                    <motion.p
                      className="text-xs sm:text-sm text-gray-600 mb-4"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                    >
                      Delivery Time: &lt;30 seconds (Instant)
                    </motion.p>
                  </div>

                  <motion.div
                    className="flex-1 mb-4 sm:mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                  >
                    <h4 className="text-gray-900 mb-3 text-xs sm:text-sm font-semibold">
                      What You Get:
                    </h4>
                    <ul className="space-y-2">
                      <motion.li
                        className="flex items-center gap-3 text-xs sm:text-sm text-gray-700"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.8 }}
                      >
                        <span className="text-[#4ea8a1] text-base sm:text-lg">
                          ✓
                        </span>
                        Inda Score
                      </motion.li>
                      <motion.li
                        className="flex items-center gap-3 text-xs sm:text-sm text-gray-700"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.9 }}
                      >
                        <span className="text-[#4ea8a1] text-base sm:text-lg">
                          ✓
                        </span>
                        Micro-location market data
                      </motion.li>
                      <motion.li
                        className="flex items-center gap-3 text-xs sm:text-sm text-gray-700"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 1.0 }}
                      >
                        <span className="text-[#4ea8a1] text-base sm:text-lg">
                          ✓
                        </span>
                        AI market valuation
                      </motion.li>
                      <motion.li
                        className="flex items-center gap-3 text-xs sm:text-sm text-gray-700"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 1.1 }}
                      >
                        <span className="text-[#4ea8a1] text-base sm:text-lg">
                          ✓
                        </span>
                        Overpricing check
                      </motion.li>
                    </ul>
                  </motion.div>

                  <motion.button
                    onClick={() => handlePlanSelect("instant")}
                    className="w-full bg-[#4ea8a1] text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-full font-medium hover:bg-[#3d8a84] transition-all duration-300 text-sm sm:text-base"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Choose plan
                  </motion.button>
                </div>
              </motion.div>

              {/* Deep Dive Report - Elevated */}
              <motion.div
                initial={{ opacity: 0, y: 40, scale: 0.85 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
                whileHover={{
                  scale: 1.03,
                  y: -5,
                  transition: { duration: 0.3 },
                }}
                className="relative -mt-4 sm:-mt-8 lg:-mt-12 w-full"
              >
                <div className="bg-[#2A2A2A] rounded-[20px] sm:rounded-[32px] p-4 sm:p-6 h-full flex flex-col shadow-2xl hover:shadow-3xl transition-all duration-300 ">
                  <div className="text-left mb-4 sm:mb-6">
                    <motion.div
                      className="font-bold text-3xl sm:text-4xl mb-2 text-white"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                    >
                      ₦75,000
                    </motion.div>
                    <motion.h3
                      className="text-lg sm:text-xl font-bold text-white mb-2"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                    >
                      Deep Dive Report
                    </motion.h3>
                    <motion.p
                      className="text-xs sm:text-sm text-gray-300 mb-4"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                    >
                      Delivery Time: 24-48 hours (via email PDF)
                    </motion.p>
                  </div>

                  <motion.div
                    className="flex-1 mb-4 sm:mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                  >
                    <h4 className="text-white mb-2 text-xs sm:text-sm font-semibold">
                      What You Get:
                      <span className="font-normal text-gray-300">
                        Everything in Instant Report
                      </span>
                      <span className="text-white font-semibold"> Plus:</span>
                    </h4>
                    <h5 className="text-white text-xs sm:text-sm font-semibold mb-3">
                      Title & Legal Verification:
                    </h5>
                    <ul className="space-y-2">
                      <motion.li
                        className="flex items-center gap-3 text-xs sm:text-sm text-gray-300"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 1.0 }}
                      >
                        <span className="text-white text-base sm:text-lg">
                          ✓
                        </span>
                        Certificate of Occupancy (C of O) or Deed check
                      </motion.li>
                      <motion.li
                        className="flex items-center gap-3 text-xs sm:text-sm text-gray-300"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 1.1 }}
                      >
                        <span className="text-white text-base sm:text-lg">
                          ✓
                        </span>
                        Governor's consent check
                      </motion.li>
                      <motion.li
                        className="flex items-center gap-3 text-xs sm:text-sm text-gray-300"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 1.2 }}
                      >
                        <span className="text-white text-base sm:text-lg">
                          ✓
                        </span>
                        Zoning compliance check
                      </motion.li>
                      <motion.li
                        className="flex items-center gap-3 text-xs sm:text-sm text-gray-300"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 1.3 }}
                      >
                        <span className="text-white text-base sm:text-lg">
                          ✓
                        </span>
                        Litigation search (court registry)
                      </motion.li>
                      <motion.li
                        className="flex items-center gap-3 text-xs sm:text-sm text-gray-300"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 1.4 }}
                      >
                        <span className="text-white text-base sm:text-lg">
                          ✓
                        </span>
                        Survey plan verification (boundaries & location)
                      </motion.li>
                    </ul>
                  </motion.div>

                  <motion.button
                    onClick={() => handlePlanSelect("deep-dive")}
                    className="w-full bg-[#4ea8a1] text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-full font-medium hover:bg-[#3d8a84] transition-all duration-300 text-sm sm:text-base"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.5 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Choose plan
                  </motion.button>
                </div>
              </motion.div>

              {/* Deeper Dive */}
              <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
                whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
                className="w-full"
              >
                <div className="p-4 sm:p-6 h-full flex flex-col transition-all duration-300  rounded-lg sm:rounded-none  ">
                  <div className="text-left mb-4 sm:mb-6">
                    <motion.div
                      className="font-bold text-3xl sm:text-4xl mb-2 text-gray-900"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                    >
                      ₦100,000
                    </motion.div>
                    <motion.h3
                      className="text-lg sm:text-xl font-bold text-gray-900 mb-2"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                    >
                      Deeper Dive
                    </motion.h3>
                    <motion.p
                      className="text-xs sm:text-sm text-gray-600 mb-4"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.9 }}
                    >
                      Delivery Time: 2-4 Days
                    </motion.p>
                  </div>

                  <motion.div
                    className="flex-1 mb-4 sm:mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.0 }}
                  >
                    <h4 className="text-gray-900 mb-3 text-xs sm:text-sm font-semibold">
                      What You Get:
                      <span className="font-normal text-gray-600">
                        Everything in Instant Report
                      </span>
                      <span className="text-[#4ea8a1] font-semibold">
                        Plus:
                      </span>
                    </h4>
                    <ul className="space-y-2">
                      <motion.li
                        className="flex items-center gap-3 text-xs sm:text-sm text-gray-700"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 1.1 }}
                      >
                        <span className="text-[#4ea8a1] text-base sm:text-lg">
                          ✓
                        </span>
                        Seller identity verification
                      </motion.li>
                      <motion.li
                        className="flex items-center gap-3 text-xs sm:text-sm text-gray-700"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 1.2 }}
                      >
                        <span className="text-[#4ea8a1] text-base sm:text-lg">
                          ✓
                        </span>
                        On-site property visit
                      </motion.li>
                      <motion.li
                        className="flex items-center gap-3 text-xs sm:text-sm text-gray-700"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 1.3 }}
                      >
                        <span className="text-[#4ea8a1] text-base sm:text-lg">
                          ✓
                        </span>
                        Photo evidence
                      </motion.li>
                    </ul>
                  </motion.div>

                  <motion.button
                    onClick={() => handlePlanSelect("deeper-dive")}
                    className="w-full bg-[#4ea8a1] text-white py-2.5 sm:py-3 px-4 sm:px-6 rounded-full font-medium hover:bg-[#3d8a84] transition-all duration-300 text-sm sm:text-base"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.4 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Choose plan
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className="w-full px-4 sm:px-6 md:px-8 lg:px-[10%] py-12 sm:py-16 md:py-20 flex flex-col items-start justify-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Text className="text-inda-dark font-bold text-2xl sm:text-3xl mb-6 sm:mb-8">
            Frequently Asked Questions
          </Text>
        </motion.div>
        <FAQ />
      </motion.section>

      {/* CTA Section - See the truth behind that listing today! */}
      <motion.section
        className="w-full flex justify-center items-center py-14 sm:py-20 md:py-24 bg-transparent px-4 sm:px-6"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          className="relative w-full max-w-6xl mx-auto rounded-[40px] sm:rounded-[56px] border border-[#4EA8A1]/60 flex flex-col items-center justify-center px-4 sm:px-8"
          style={{ boxSizing: "border-box" }}
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Background subtle radial for depth (desktop only) */}
          <div className="hidden sm:block absolute inset-0 pointer-events-none rounded-[56px] overflow-hidden">
            <div className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(circle_at_30%_30%,#4EA8A1_0%,transparent_60%)]" />
          </div>
          <div className="relative z-10 flex flex-col items-center w-full py-10 sm:py-14 md:py-16">
            <motion.h2
              className="text-[#101820F2] text-center font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight max-w-4xl mx-auto px-2 sm:px-4 mb-6 sm:mb-10"
              style={{ letterSpacing: 0 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.35 }}
            >
              See the truth behind that listing today!
            </motion.h2>
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full justify-center">
              <motion.button
                className="w-full sm:w-auto bg-[#4EA8A1] text-white text-base sm:text-lg md:text-xl font-medium rounded-full px-8 sm:px-10 md:px-12 py-4 sm:py-5 shadow-lg hover:bg-[#1a2a33] transition-all duration-300 hover:scale-[1.04] focus:outline-none focus:ring-4 focus:ring-[#4EA8A1]/30"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.55 }}
                onClick={handleCTA}
              >
                Try your first search now
              </motion.button>
              {/* Chat button inline on mobile; secondary on desktop below */}
              <motion.button
                className="w-full sm:w-auto bg-white text-[#0F5E57] border border-[#4EA8A1] text-base sm:text-lg font-medium rounded-full px-8 sm:px-10 py-4 sm:py-5 shadow-sm hover:bg-[#F2FCFB] transition-all duration-300 hover:scale-[1.03] focus:outline-none focus:ring-4 focus:ring-[#4EA8A1]/20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.65 }}
                onClick={() =>
                  openWhatsApp(
                    "Hello Inda team, I have a question about verifying a property."
                  )
                }
              >
                Chat with Us
              </motion.button>
            </div>
            {/* Supporting micro-copy for mobile clarity */}
            <motion.p
              className="mt-6 text-center text-sm sm:text-base text-[#101820B2] max-w-lg"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.75 }}
            >
              Paste a listing link to see risks, fair value and red flags in
              seconds.
            </motion.p>
          </div>
          {/* Desktop floating chat badge (kept for continuity) */}
        </motion.div>
      </motion.section>
      {/* End landing content */}
      <Footer />
    </Container>
  );
};

// FAQ data and component
const faqData = [
  {
    q: "What is Inda and how does it help me?",
    a: (
      <>
        Inda is your property truth checker. In just seconds, it verifies if a
        listing is real, priced fairly, and free from hidden risks like fake
        documents, flooding, or disputes so you don’t waste money or fall for
        scams.
      </>
    ),
  },
  {
    q: "How does Inda get its data?",
    a: (
      <>
        We pull data from multiple trusted sources property platforms,
        government registries, rental markets, sellers, and verified agents. Our
        system cleans and cross-checks everything, then uses AI to give you a
        clear, easy-to-read report.
      </>
    ),
  },
  {
    q: "What’s the difference between Instant, Deep Dive, and Deeper Dive reports?",
    a: (
      <>
        <span className="block font-medium">Free Preview (₦0):</span>
        <span className="block mb-2 text-[13.5px] sm:text-sm">
          Basic snapshot with limited Inda Score visibility so you can confirm
          the link works before paying.
        </span>
        <span className="block font-medium">Instant Report (₦7,500):</span>
        <span className="block mb-2 text-[13.5px] sm:text-sm">
          30–60s automated analysis – Fair Value (FMV) range, pricing flags, ROI
          projection seed, Inda Trust Score, agent signals & red flag scan.
        </span>
        <span className="block font-medium">Deep Dive (₦75,000):</span>
        <span className="block mb-2 text-[13.5px] sm:text-sm">
          Everything in Instant + title & document verification (registry
          lookups), government approval checks, micro‑location &
          flood/encroachment risk profiling (24–48 hrs).
        </span>
        <span className="block font-medium">Deeper Dive (₦100,000):</span>
        <span className="block text-[13.5px] sm:text-sm">
          Adds seller / ownership vetting, on‑site inspection with media
          evidence, utility & build quality assessment, enhanced fraud screening
          (2–4 days).
        </span>
      </>
    ),
  },
  {
    q: "Who should use Inda?",
    a: (
      <>
        Anyone buying or investing in property - first-time buyers, diaspora
        buyers sending money home, or everyday investors. If you’re about to put
        millions into a property, Inda helps you buy with confidence.
      </>
    ),
  },
  {
    q: "Is my information safe with Inda?",
    a: (
      <>
        Yes. We don’t share your personal or property checks publicly. All data
        is secured and only you get access to your reports.
      </>
    ),
  },
  {
    q: "Why should I pay for Inda when agents or lawyers can check for me?",
    a: (
      <>
        Agents and lawyers often take weeks and still miss risks. Inda gives you
        instant, unbiased, data-backed insights, at a fraction of the cost so
        you can decide faster and safer.
      </>
    ),
  },
];

const FAQ = () => {
  const [open, setOpen] = useFAQState<number | null>(null);
  return (
    <motion.div
      className="w-full max-w-full sm:max-w-[67%]  flex flex-col gap-4 sm:gap-6"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      {faqData.map((item, i) => {
        const isOpen = open === i;
        return (
          <motion.div
            key={item.q}
            className={`w-full bg-[#4EA8A129] rounded-xl sm:rounded-2xl border border-[#4EA8A129] shadow-sm transition-all duration-300 ${
              isOpen ? "shadow-md" : ""
            } cursor-pointer overflow-hidden`}
            style={{ minHeight: 56 }}
            onClick={() => setOpen(isOpen ? null : i)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          >
            <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 text-inda-dark text-base sm:text-md md:text-lg lg:text-xl font-medium select-none">
              <span className="flex-1 pr-4">{item.q}</span>
              <motion.svg
                width="28"
                height="28"
                fill="none"
                stroke="#101820"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="flex-shrink-0 transition-transform duration-300"
                style={{ minWidth: 28 }}
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <polyline points="8 12 16 20 24 12" />
              </motion.svg>
            </div>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  className="px-4 sm:px-6 md:px-8 pb-4 sm:pb-5 md:pb-6 pt-0 text-inda-dark/90 text-sm sm:text-base md:text-lg font-normal"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.05 }}
                    className="leading-relaxed"
                  >
                    {item.a}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default Landing;
