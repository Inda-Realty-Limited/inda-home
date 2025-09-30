import { Input } from "@/components";
import { getToken } from "@/helpers";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import { sampleData, searchTypes } from "../landingData";

const HeroSection: React.FC = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedSearchType, setSelectedSearchType] = useState(
    () => searchTypes.find((t) => t.id === "link") || searchTypes[0]
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const INSTANT_TYPES = useMemo(() => new Set(["link"]), []);

  const isValidUrl = (value: string) => {
    try {
      const url = new URL(value.trim());
      return ["http:", "https:"].includes(url.protocol);
    } catch {
      return false;
    }
  };

  const filteredSuggestions = useMemo(
    () =>
      sampleData.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  const handleSearch = () => {
    if (selectedSearchType.id !== "link" || !isValidUrl(search)) return;
    const token = getToken();
    const encoded = encodeURIComponent(search);

    if (!token) {
      router.push(`/auth?q=${encoded}&type=${selectedSearchType.id}`);
      return;
    }

    router.push(`/result?q=${encoded}&type=${selectedSearchType.id}`);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setIsSearchActive(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleOpenSearch = () => {
      const linkType =
        searchTypes.find((t) => t.id === "link") || searchTypes[0];
      setSelectedSearchType(linkType);
      setIsDropdownOpen(false);
      setIsSearchActive(true);
      setTimeout(() => {
        const textArea = document.getElementById(
          "landing-search-textarea"
        ) as HTMLTextAreaElement | null;
        textArea?.focus();
      }, 10);
    };

    window.addEventListener("openLandingSearch", handleOpenSearch);
    return () => {
      window.removeEventListener("openLandingSearch", handleOpenSearch);
    };
  }, []);

  return (
    <motion.section
      className="flex flex-col bg-[#f9f9f9] items-center justify-center min-h-[70vh] z-0 px-4 sm:px-6 lg:px-8 py-8"
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
          <div className="relative w-full max-w-3xl" ref={dropdownRef}>
            <AnimatePresence mode="wait">
              {!isSearchActive ? (
                <motion.div
                  key="dropdown-mode"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col sm:flex-row items-center gap-0 w-full"
                >
                  <button
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
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

                  <div className="relative flex-1 w-full">
                    <Input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onFocus={() => setIsSearchActive(true)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSearch();
                      }}
                      placeholder={selectedSearchType.placeholder}
                      id="landing-search-input"
                      className="w-full border border-t-0 sm:border-t border-l sm:border-l-0 border-[#4EA8A1] rounded-b-[20px] sm:rounded-r-[20px] sm:rounded-bl-none pl-6 sm:pl-8 pr-16 sm:pr-20 py-4 sm:py-5 text-lg sm:text-xl placeholder:text-[#9CA3AF] font-medium text-[#101820] focus:outline-none bg-white transition-all duration-200 focus:shadow-lg"
                    />
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
                <motion.div
                  key="textarea-mode"
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="relative w-full group"
                >
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
                      id="landing-search-textarea"
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
                      style={{ lineHeight: "1.6", fontFamily: "inherit" }}
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

                    <div className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-300 group-focus-within:ring-2 group-focus-within:ring-[#4EA8A1]/30 group-focus-within:ring-offset-2" />
                    <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-[#4EA8A1]/5 via-transparent to-[#4EA8A1]/10" />
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
                    {searchTypes.map((type, index) => {
                      const isEnabled = INSTANT_TYPES.has(type.id);
                      return (
                        <button
                          key={type.id}
                          onClick={() => {
                            if (!isEnabled) return;
                            setSelectedSearchType(type);
                            setIsDropdownOpen(false);
                            setSearch("");
                            setIsSearchActive(true);
                          }}
                          disabled={!isEnabled}
                          className={`text-left p-5 transition-colors duration-200 ${
                            isEnabled
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
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {filteredSuggestions.length > 0 && !isSearchActive && (
              <ul className="hidden" aria-hidden>
                {filteredSuggestions.map((item) => (
                  <li key={item.id}>{item.name}</li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroSection;
