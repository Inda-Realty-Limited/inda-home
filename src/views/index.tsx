import { Container, Footer, Input, Navbar, Text } from "@/components";
import { getToken } from "@/helpers";
import { AnimatePresence, motion } from "framer-motion";
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

const Landing: React.FC = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedSearchType, setSelectedSearchType] = useState(searchTypes[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filtered = sampleData.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  // Function to handle search with authentication check
  const handleSearch = () => {
    const token = getToken();

    if (!token) {
      // User is not authenticated, redirect to auth with search query
      router.push(
        `/auth?q=${encodeURIComponent(search)}&type=${selectedSearchType.id}`
      );
    } else {
      // User is authenticated, proceed to result page
      router.push(
        `/result?q=${encodeURIComponent(search)}&type=${selectedSearchType.id}`
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
            <h1 className="font-extrabold text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl mb-6 sm:mb-8 text-[#101820] leading-[0.9]">
              Know before you buy
            </h1>
            <p className="font-medium text-center text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-[#101820]/80 tracking-wide max-w-5xl mx-auto px-2 sm:px-4">
              Inda reveals hidden risks, fake prices, and shady listings — in
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
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-[#4EA8A1] hover:bg-[#3d9691] rounded-full p-3 transition-all duration-200 hover:shadow-lg hover:scale-105"
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

                    {/* Beautiful Textarea */}
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

                      {/* Enhanced Search Button */}
                      <button
                        onClick={handleSearch}
                        disabled={!search.trim()}
                        className={`absolute right-4 bottom-4 rounded-2xl px-6 py-3.5 transition-all duration-300 flex items-center gap-3 font-medium text-base ${
                          search.trim()
                            ? "bg-[#4EA8A1] hover:bg-[#3d9691] text-white shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 border border-[#4EA8A1]"
                            : "bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-200"
                        }`}
                      >
                        <BiSearchAlt2 className="text-xl" />
                        <span className="hidden sm:inline">Search</span>
                      </button>

                      {/* Enhanced focus effects */}
                      <div className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-300 group-focus-within:ring-2 group-focus-within:ring-[#4EA8A1]/30 group-focus-within:ring-offset-2"></div>

                      {/* Subtle gradient overlay */}
                      <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-[#4EA8A1]/5 via-transparent to-[#4EA8A1]/10"></div>
                    </div>

                    {/* Mobile-friendly helper text */}
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

              {/* Dropdown Menu */}
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
                            setSelectedSearchType(type);
                            setIsDropdownOpen(false);
                            setSearch("");
                            setIsSearchActive(true);
                          }}
                          className={`text-left p-5 hover:bg-[#4EA8A1]/10 transition-colors duration-200 ${
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
          <Text className="text-inda-dark/80 text-center font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl mb-12 sm:mb-16 md:mb-20 leading-tight max-w-4xl mx-auto px-4">
            Would you invest in an asset
            <br />
            without knowing its true worth?
          </Text>
        </motion.div>
        <section className="relative flex flex-col items-center justify-center w-full px-0">
          <div className="relative w-full h-[140px] flex items-center justify-center">
            <div className="absolute left-1/2 top-0 w-[120vw] -translate-x-1/2 rotate-[-3deg] z-10 shadow-md overflow-x-hidden">
              <div className="bg-primary h-[106px] px-0 flex items-center text-lg font-semibold whitespace-nowrap border-0 rounded-xl  overflow-x-hidden">
                <div className="flex items-center shadow-2xl">
                  {/* Repeat content twice for seamless loop */}
                  {[...Array(2)].map((_, i) => (
                    <>
                      <span className="mx-6" key={`wrong-${i}-1`}>
                        THE WRONG PROPERTY CAN COST MILLIONS
                      </span>
                      <span
                        className="mx-2 text-inda-dark text-xl"
                        key={`wrong-${i}-2`}
                      >
                        ✦
                      </span>
                      <span className="mx-6" key={`wrong-${i}-3`}>
                        THE WRONG PROPERTY CAN COST MILLIONS
                      </span>
                      <span
                        className="mx-2 text-inda-dark text-xl"
                        key={`wrong-${i}-4`}
                      >
                        ✦
                      </span>
                      <span className="mx-6" key={`wrong-${i}-5`}>
                        THE WRONG PROPERTY CAN COST MILLIONS
                      </span>
                      <span
                        className="mx-2 text-inda-dark text-xl"
                        key={`wrong-${i}-6`}
                      >
                        ✦
                      </span>
                      <span className="mx-6" key={`wrong-${i}-5`}>
                        THE WRONG PROPERTY CAN COST MILLIONS
                      </span>
                      <span
                        className="mx-2 text-inda-dark text-xl"
                        key={`wrong-${i}-6`}
                      >
                        ✦
                      </span>
                    </>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute left-1/2 top-0 w-[120vw] -translate-x-1/2 rotate-[3deg] z-20 overflow-x-hidden">
              <div className="bg-primary h-[106px] px-0 flex items-center text-lg font-semibold whitespace-nowrap shadow-md border-0 rounded-xl  overflow-x-hidden">
                <div className="flex items-center shadow-2xl">
                  {/* Repeat content twice for seamless loop */}
                  {[...Array(2)].map((_, i) => (
                    <>
                      <span className="mx-6" key={`know-${i}-1`}>
                        KNOW BEFORE YOU BUY
                      </span>
                      <span
                        className="mx-2 text-inda-dark text-xl"
                        key={`know-${i}-2`}
                      >
                        ✦
                      </span>
                      <span className="mx-6" key={`know-${i}-3`}>
                        KNOW BEFORE YOU BUY
                      </span>
                      <span
                        className="mx-2 text-inda-dark text-xl"
                        key={`know-${i}-4`}
                      >
                        ✦
                      </span>
                      <span className="mx-6" key={`know-${i}-5`}>
                        KNOW BEFORE YOU BUY
                      </span>
                      <span
                        className="mx-2 text-inda-dark text-xl"
                        key={`know-${i}-6`}
                      >
                        ✦
                      </span>
                      <span className="mx-6" key={`know-${i}-5`}>
                        KNOW BEFORE YOU BUY
                      </span>
                      <span
                        className="mx-2 text-inda-dark text-xl"
                        key={`know-${i}-6`}
                      >
                        ✦
                      </span>
                    </>
                  ))}
                </div>
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
        >
          <Text className="text-inda-dark text-center font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-6 sm:mb-8">
            Here's How <span className="text-inda-teal">INDA</span> Works
          </Text>
        </motion.div>
        <div className="flex flex-col items-center w-full max-w-7xl">
          <motion.div
            className="flex flex-col items-center w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto mb-8 sm:mb-10 md:mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="bg-inda-dark/90 rounded-full w-full text-center px-6 sm:px-8 py-3 sm:py-4 font-semibold text-inda-yellow z-10 text-lg sm:text-xl md:text-2xl lg:text-3xl">
              Step One
            </div>

            <div className="w-4/5 h-[15px] sm:h-[20px] bg-[#E5E5E5] z-0"></div>
            <div className="bg-[#4EA8A1] rounded-t-[32px] sm:rounded-t-[44px] rounded-b-none w-full px-[15%] sm:px-[20%] pt-5 sm:pt-7 pb-3 sm:pb-4 flex flex-col items-center">
              <span className="text-white font-semibold mb-2 text-center text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl">
                Type Anything in the Search Bar
              </span>
            </div>
            <div className="bg-[#E5E5E5] rounded-t-none w-full p-4 sm:p-5 px-[10%] sm:px-[15%] text-center text-inda-dark/90 border-t-0 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl">
              Enter a name, address, or link. <b>Inda</b> suggests results as
              you type.
            </div>
          </motion.div>
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 w-full items-start justify-center">
            <motion.div
              className="flex flex-col items-center w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto mb-8 sm:mb-10"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="bg-inda-dark/90 rounded-full w-full text-center px-8 py-4 font-semibold text-inda-yellow z-10 text-xl sm:text-2xl md:text-3xl lg:text-3xl">
                Step Two
              </div>
              <div className="w-4/5 h-[20px] bg-[#66B3AD] z-0"></div>
              <div className="bg-[#E5E5E5] w-full p-5 px-[15%] text-center text-inda-dark/90 border-t-0 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
                <b>Inda</b> detects if it’s a developer, agent, company, or
                property and loads the matching result page.
              </div>
              <div className="bg-[#4EA8A1] text-white px-[20%] rounded-b-[44px] w-full pt-7 pb-4 flex flex-col items-center ">
                <span className="text-white font-semibold mb-2 text-center text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
                  Inda Understands Your Search Type
                </span>
              </div>
            </motion.div>
            <motion.div
              className="flex flex-col items-center w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto mb-8 sm:mb-10"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="bg-inda-dark/90 rounded-full w-full text-center px-6 sm:px-8 py-3 sm:py-4 font-semibold text-inda-yellow z-10 text-lg sm:text-xl md:text-2xl lg:text-3xl">
                Step Three
              </div>
              <div className="w-4/5 h-[15px] sm:h-[20px] bg-[#66B3AD] z-0"></div>
              <div className="bg-[#E5E5E5] w-full p-4 sm:p-5 px-[10%] sm:px-[15%] text-center text-inda-dark/90 border-t-0 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl">
                Get clear info, ratings, reviews, red flags, and AI insights to
                help you decide with confidence.
              </div>
              <div className="bg-[#4EA8A1] text-white px-[15%] sm:px-[20%] rounded-b-[32px] sm:rounded-b-[44px] w-full pt-5 sm:pt-7 pb-3 sm:pb-4 flex flex-col items-center">
                <span className="text-white font-semibold mb-2 text-center text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl">
                  See a Smart Summary with Full Details
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
      {/* Inda Report Preview Section */}
      <motion.section
        className="w-full flex flex-col px-4 sm:px-6 md:px-8 lg:px-[10%] items-start pt-6 sm:pt-8 justify-center min-h-[400px] sm:min-h-[465px] bg-[#1018200A]"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.p
          className="text-inda-dark font-bold text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          See an Inda Report in Action
        </motion.p>
        <div className="flex flex-col lg:flex-row items-start w-full gap-6 sm:gap-8">
          <motion.div
            className="flex-col items-center justify-center w-full lg:w-auto"
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
            className="flex flex-col space-y-3 items-start justify-between lg:pl-8 xl:pl-12"
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
            <a
              href="#"
              className="bg-[#0A1A22] text-white text-lg sm:text-xl px-8 sm:px-10 h-[56px] sm:h-[67px] flex items-center justify-center rounded-full hover:bg-[#11242e] transition-all duration-300 hover:scale-105"
            >
              See full report sample
            </a>
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
        className="w-full px-4 sm:px-6 md:px-8 lg:px-[10%] bg-[#E5E5E566] py-12 sm:py-16 md:py-20 flex flex-col items-start justify-center"
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
            Pricing
          </Text>
        </motion.div>
        <motion.div
          className="w-full rounded-2xl sm:rounded-3xl border border-[#E2E4E8] p-6 sm:p-8 md:p-12 flex flex-col gap-6 sm:gap-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="w-full flex flex-col items-center">
            <div className="w-full flex flex-col xl:flex-row gap-6 sm:gap-8 justify-center">
              {/* Basic Summary with Pricing Breakdown Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="flex-1 min-w-[240px] sm:min-w-[260px] bg-[#E5E5E566] rounded-xl sm:rounded-2xl border border-[#D1D5DB] p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:scale-105">
                  <div>
                    <div className="font-bold text-lg sm:text-xl mb-3 sm:mb-4 text-inda-dark">
                      Basic Summary
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-inda-dark mb-2 flex items-center">
                      <span className="line-through mr-2">₦0</span>
                    </div>
                    <ul className="mt-4 sm:mt-6 mb-2">
                      <li className="flex items-center gap-2 text-base sm:text-lg text-inda-dark/90">
                        <span className="text-xl sm:text-2xl text-inda-dark">
                          ✓
                        </span>{" "}
                        Report preview
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="w-full flex justify-center mt-6 sm:mt-8">
                  <button className="bg-[#F5F6F7] text-inda-dark font-bold text-lg sm:text-xl rounded-xl sm:rounded-2xl px-8 sm:px-10 py-4 sm:py-6 shadow-md hover:bg-[#e9eaeb] transition-all duration-300 hover:scale-105">
                    See Pricing Breakdown
                  </button>
                </div>
              </motion.div>
              {/* Deep Report */}
              <motion.div
                className="flex-1 min-w-[240px] sm:min-w-[260px] bg-[#E5E5E566] rounded-xl sm:rounded-2xl border border-[#D1D5DB] p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:scale-105"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div>
                  <div className="font-bold text-lg sm:text-xl mb-3 sm:mb-4 text-inda-dark">
                    Deep Report
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-inda-dark mb-2 flex items-center">
                    <span className="mr-2">₦15,000</span>
                    <span className="text-sm sm:text-lg font-medium text-inda-dark/70">
                      / use
                    </span>
                  </div>
                  <ul className="mt-4 sm:mt-6 mb-2 space-y-1 sm:space-y-2">
                    <li className="flex items-center gap-2 text-sm sm:text-base md:text-lg text-inda-dark/90">
                      <span className="text-lg sm:text-2xl text-inda-dark">
                        ✓
                      </span>{" "}
                      Detailed property report
                    </li>
                    <li className="flex items-center gap-2 text-sm sm:text-base md:text-lg text-inda-dark/90">
                      <span className="text-lg sm:text-2xl text-inda-dark">
                        ✓
                      </span>{" "}
                      Verification stamp
                    </li>
                    <li className="flex items-center gap-2 text-sm sm:text-base md:text-lg text-inda-dark/90">
                      <span className="text-lg sm:text-2xl text-inda-dark">
                        ✓
                      </span>{" "}
                      Legal risk assessment
                    </li>
                    <li className="flex items-center gap-2 text-sm sm:text-base md:text-lg text-inda-dark/90">
                      <span className="text-lg sm:text-2xl text-inda-dark">
                        ✓
                      </span>{" "}
                      ROI chart
                    </li>
                    <li className="flex items-center gap-2 text-sm sm:text-base md:text-lg text-inda-dark/90">
                      <span className="text-lg sm:text-2xl text-inda-dark">
                        ✓
                      </span>{" "}
                      Agent trust rating
                    </li>
                  </ul>
                </div>
              </motion.div>
              {/* Pro Access */}
              <motion.div
                className="flex-1 min-w-[240px] sm:min-w-[260px] bg-[#E5E5E566] rounded-xl sm:rounded-2xl border border-[#D1D5DB] p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:scale-105"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div>
                  <div className="font-bold text-lg sm:text-xl mb-3 sm:mb-4 text-inda-dark">
                    Pro Access
                  </div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-inda-dark mb-2 flex items-center">
                    <span className="mr-2">₦55,000</span>
                    <span className="text-sm sm:text-lg font-medium text-inda-dark/70">
                      / month
                    </span>
                  </div>
                  <ul className="mt-4 sm:mt-6 mb-2 space-y-1 sm:space-y-2">
                    <li className="flex items-center gap-2 text-sm sm:text-base md:text-lg text-inda-dark/90">
                      <span className="text-lg sm:text-2xl text-inda-dark">
                        ✓
                      </span>{" "}
                      Unlimited deep reports
                    </li>
                    <li className="flex items-center gap-2 text-sm sm:text-base md:text-lg text-inda-dark/90">
                      <span className="text-lg sm:text-2xl text-inda-dark">
                        ✓
                      </span>{" "}
                      Live ROI Alerts + Market Signals
                    </li>
                    <li className="flex items-center gap-2 text-sm sm:text-base md:text-lg text-inda-dark/90">
                      <span className="text-lg sm:text-2xl text-inda-dark">
                        ✓
                      </span>{" "}
                      Exclusive market insights
                    </li>
                    <li className="flex items-center gap-2 text-sm sm:text-base md:text-lg text-inda-dark/90">
                      <span className="text-lg sm:text-2xl text-inda-dark">
                        ✓
                      </span>{" "}
                      Portfolio Dashboard
                    </li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
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
        className="w-full flex justify-center items-center py-16 sm:py-20 md:py-24 bg-transparent px-4 sm:px-6"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          className="relative w-[95%] mx-auto overflow-hidden rounded-[48px] sm:rounded-[64px] bg-[#E5E5E599] flex flex-col items-center justify-center px-4 sm:px-6 md:px-8"
          style={{
            minHeight: 450,
            border: "1.5px solid #fff",
            boxSizing: "border-box",
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Thin white border inside */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="w-full h-full rounded-[40px] sm:rounded-[56px] border border-[#00000040] opacity-60 absolute top-3 sm:top-4 left-3 sm:left-4"
              style={{ zIndex: 1 }}
            ></div>
          </div>
          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center justify-center w-full h-full py-12 sm:py-16">
            <motion.h2
              className="text-inda-dark text-center font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-tight mb-8 sm:mb-10"
              style={{ letterSpacing: 0 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              See the truth behind
              <br className="hidden sm:block" />
              that listing today!
            </motion.h2>
            <motion.button
              className="bg-[#4EA8A1] text-white text-lg sm:text-xl md:text-2xl font-normal rounded-full px-8 sm:px-10 md:px-12 py-4 sm:py-5 mt-2 shadow-lg hover:bg-[#1a2a33] transition-all duration-300 hover:scale-105 focus:outline-none"
              style={{ minWidth: 280 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Try your first search now
            </motion.button>
          </div>
          {/* Chat with Us button and horizontal line */}
          <motion.button
            id="cta-chat-btn"
            className="absolute left-4 sm:left-6 md:left-8 bottom-12 sm:bottom-16 bg-[#4EA8A1] text-white text-base sm:text-lg md:text-xl font-normal rounded-full px-6 sm:px-8 md:px-10 py-3 sm:py-4 shadow-lg hover:bg-[#1a2a33] transition-all duration-300 hover:scale-105 focus:outline-none"
            style={{ minWidth: 200, zIndex: 10 }}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Chat with Us
          </motion.button>
          {/* Thin horizontal line starting beside Chat with Us button */}
          <motion.div
            className="absolute bottom-12 sm:bottom-16 bg-[#00000040] opacity-60 h-px hidden sm:block"
            style={{
              left: `calc(24px + 200px + 2rem)`, // left + minWidth + padding
              right: 0,
              zIndex: 2,
            }}
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 0.6, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 1 }}
          ></motion.div>
        </motion.div>
      </motion.section>
      <Footer />
    </Container>
  );
};

// FAQ data and component
const faqData = [
  {
    q: "How does Inda know if a property is real or fake?",
    a: (
      <>
        Inda uses advanced algorithms and data verification processes to ensure
        the authenticity of property listings. We cross-reference information
        from multiple reliable sources and employ machine learning techniques to
        detect and flag potentially fraudulent listings. Our system continuously
        learns and adapts to new patterns, enhancing its ability to identify and
        filter out fake properties.
      </>
    ),
  },
  {
    q: "Can I trust Inda’s pricing and ROI suggestions?",
    a: (
      <>
        Yes. We benchmark against verified comps in your area, adjust for market
        movement and rental income, and back every estimate with real-time data
        — not guesswork.
      </>
    ),
  },
  {
    q: "What do I get after a search?",
    a: (
      <>
        You’ll see a smart breakdown including: verification status, legal red
        flags, ROI analysis, resale estimates, market comparisons, user reviews,
        and even a recommendation like ‘Overpriced by 18% — Negotiate.’
      </>
    ),
  },
  {
    q: "Is Inda only for investors or can I use it to buy a home?",
    a: (
      <>
        Anyone buying property can use Inda. We help you check documents,
        evaluate deals, and make sure you’re not getting scammed — whether it’s
        your first home or your fifth.
      </>
    ),
  },
  {
    q: "What’s free and what’s paid?",
    a: (
      <>
        <span className="block">
          Free: Search any name or listing to get basic trust signals and
          reviews.
        </span>
        <span className="block">
          Paid: ₦15K one-time unlocks full reports — including: ROI, resale,
          legal insights. Frequent buyers? ₦100K/month for unlimited scans.
        </span>
      </>
    ),
  },
  {
    q: "How does Inda get smarter?",
    a: (
      <>
        Every time you search, flag, or leave a review, Inda’s AI learns. We
        improve our detection, pricing logic, and risk signals to make sure each
        new search is sharper than the last.
      </>
    ),
  },
];

const FAQ = () => {
  const [open, setOpen] = useFAQState<number | null>(null);
  return (
    <motion.div
      className="w-full max-w-4xl flex flex-col gap-4 sm:gap-6"
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
            className={`w-full bg-white rounded-xl sm:rounded-2xl border border-[#ECECEC] shadow-sm transition-all duration-300 ${
              isOpen ? "shadow-md" : "hover:shadow-md"
            } cursor-pointer overflow-hidden`}
            style={{ minHeight: 56 }}
            onClick={() => setOpen(isOpen ? null : i)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
          >
            <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 text-inda-dark text-base sm:text-lg md:text-xl lg:text-2xl font-medium select-none">
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
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div>{item.a}</div>
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
