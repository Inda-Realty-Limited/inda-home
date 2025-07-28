import { Button, Container, Footer, Input, Navbar, Text } from "@/components";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import {
  FiBarChart2,
  FiBriefcase,
  FiHome,
  FiTrendingUp,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import { GiBrain } from "react-icons/gi";

const sampleData = [
  { id: 1, name: "Lagos Luxury Villa", type: "listing" },
  { id: 2, name: "John Doe", type: "agent" },
  { id: 3, name: "Prime Developers", type: "developer" },
  { id: 4, name: "Abuja Smart Home", type: "listing" },
  { id: 5, name: "Jane Smith", type: "agent" },
];

const Landing: React.FC = () => {
  const [search, setSearch] = useState("");
  const filtered = sampleData.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <Container noPadding className="min-h-screen bg-[#F9F9F9] text-inda-dark">
      <Navbar />
      <motion.section
        className="flex flex-col items-center justify-center min-h-[70vh] relative z-10 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Text
          as="p"
          size="7xl"
          className="font-extrabold text-center text-7xl mb-4 text-inda-dark leading-tight"
        >
          Know before you buy
        </Text>
        <Text
          as="p"
          size="2xl"
          className="font-medium text-center text-2xl mb-10 text-inda-dark/80 tracking-widest"
        >
          Inda reveals hidden risks, fake prices, and shady listings — in
          seconds.
        </Text>
        <div className="flex flex-col sm:flex-row items-center space-x-3 w-full max-w-[50%] mx-auto">
          <div className="relative flex items-center w-full sm:w-[90%]">
            <span className="absolute left-6 flex items-center">
              <BiSearchAlt2 className="text-[#ACAFB2] text-3xl" />
            </span>
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search any listing, agent, developer, address or link"
              className="w-full rounded-full pl-14 pr-8 py-5 text-[22px] placeholder:text-[#10182054] placeholder:text-md font-medium text-inda-dark/80 focus:outline-none"
            />
            <span className="absolute right-6"></span>
          </div>
          <Button
            variant="primary"
            className="rounded-full font-semibold px-14 py-5 text-xl whitespace-nowrap flex items-center justify-center w-full sm:w-auto min-w-[180px]"
          >
            Run Check
          </Button>
        </div>
        {/* Results area below input, always fixed under input, with animation */}
        <div className="w-full max-w-[50%] mx-auto mt-8">
          <AnimatePresence>
            {search ? (
              filtered.length > 0 ? (
                <motion.ul
                  className="bg-white/80 backdrop-blur rounded-xl shadow-lg p-2 flex flex-col gap-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  {filtered.map((item) => (
                    <motion.li
                      key={item.id}
                      className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-inda-light/60 transition"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-inda-teal text-xl flex items-center justify-center w-8 h-8 bg-inda-light rounded-full">
                        {item.type === "listing" && <FiHome />}
                        {item.type === "agent" && <FiUser />}
                        {item.type === "developer" && <FiBriefcase />}
                      </span>
                      <span className="text-base text-inda-dark/90 font-normal">
                        {item.name}
                      </span>
                      <span className="text-xs text-inda-teal bg-inda-light px-2 py-1 rounded ml-auto font-medium">
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </span>
                    </motion.li>
                  ))}
                </motion.ul>
              ) : (
                <motion.div
                  className="bg-white/80 backdrop-blur rounded-xl shadow-lg p-6 text-center text-inda-dark/60"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  No results found.
                </motion.div>
              )
            ) : null}
          </AnimatePresence>
        </div>
      </motion.section>

      <section className="w-full flex flex-col items-center justify-center min-h-[60vh] py-20 rounded-t-[48px] mt-[-48px] relative z-0 overflow-x-hidden">
        <Text className="text-inda-dark/80 text-center font-bold text-3xl md:text-3xl lg:text-6xl mb-20 leading-tight">
          Would you invest in an asset
          <br />
          without knowing its true worth?
        </Text>
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
      </section>

      <section className="w-full flex flex-col items-center justify-center py-24 ">
        <Text className="text-inda-dark text-center font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-4xl mb-6">
          Here's How <span className="text-inda-teal">INDA</span> Works
        </Text>
        <div className="flex flex-col items-center w-full max-w-[50%]">
          <div className="flex flex-col items-center w-full max-w-[500px] mx-auto mb-10">
            <div className="bg-[#FFFDAE] rounded-full w-full text-center px-8 py-4 font-semibold text-inda-dark z-10 text-xl sm:text-2xl md:text-3xl lg:text-3xl">
              Step One
            </div>

            <div className="w-4/5 h-[20px] bg-[#E5E5E5] z-0"></div>
            <div className="bg-[#4EA8A1DB] rounded-t-[44px] rounded-b-none w-full px-[20%] pt-7 pb-4 flex flex-col items-center ">
              <span className="text-white font-semibold mb-2 text-center text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
                Type Anything in the Search Bar
              </span>
            </div>
            <div className="bg-[#E5E5E5] rounded-t-none w-full p-5 px-[15%] text-center text-inda-dark/90 border-t-0 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
              Enter a name, address, or link. <b>Inda</b> suggests results as
              you type.
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-8 w-full items-start justify-center">
            <div className="flex flex-col items-center w-full max-w-[500px] mx-auto mb-10">
              <div className="bg-[#FFFDAE] rounded-full w-full text-center px-8 py-4 font-semibold text-inda-dark z-10 text-xl sm:text-2xl md:text-3xl lg:text-3xl">
                Step Two
              </div>
              <div className="w-4/5 h-[20px] bg-[#66B3AD] z-0"></div>
              <div className="bg-[#E5E5E5] w-full p-5 px-[15%] text-center text-inda-dark/90 border-t-0 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
                <b>Inda</b> detects if it’s a developer, agent, company, or
                property and loads the matching result page.
              </div>
              <div className="bg-[#4EA8A1DB] text-white px-[20%] rounded-b-[44px] w-full pt-7 pb-4 flex flex-col items-center ">
                <span className="text-white font-semibold mb-2 text-center text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
                  Inda Understands Your Search Type
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center w-full max-w-[500px] mx-auto mb-10">
              <div className="bg-[#FFFDAE] rounded-full w-full text-center px-8 py-4 font-semibold text-inda-dark z-10 text-xl sm:text-2xl md:text-3xl lg:text-3xl">
                Step Three
              </div>
              <div className="w-4/5 h-[20px] bg-[#66B3AD] z-0"></div>
              <div className="bg-[#E5E5E5] w-full p-5 px-[15%] text-center text-inda-dark/90 border-t-0 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
                Get clear info, ratings, reviews, red flags, and AI insights to
                help you decide with confidence.
              </div>
              <div className="bg-[#4EA8A1DB] text-white px-[20%] rounded-b-[44px] w-full pt-7 pb-4 flex flex-col items-center ">
                <span className="text-white font-semibold mb-2 text-center text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
                  See a Smart Summary with Full Details
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Inda Report Preview Section */}
      <section className="w-full flex flex-col px-[10%] items-start pt-8 justify-center h-[465px] bg-[#1018200A]">
        <p className="text-inda-dark font-bold text-4xl mb-6">
          See an Inda Report in Action
        </p>
        <div className="flex flex-col md:flex-row items-start w-full gap-8">
          <div
            className="flex-col items-center justify-center"
            style={{ height: 320 }}
          >
            <Image
              src="/assets/images/home.png"
              width={540}
              height={238}
              alt="Modern house preview"
              className="rounded-lg object-cover"
              style={{
                width: 540,
                height: 238,
                minWidth: 540,
                minHeight: 238,
              }}
            />
          </div>
          <div className=" flex flex-col space-y-3 items-start justify-between pl-12">
            <h3 className="text-inda-dark font-bold text-[28px] mb-1">
              Property Report Preview
            </h3>
            <p className="text-[#101820BD] text-xl max-w-md">
              Get a detailed report on any property, agent or development
              company—including verification status, legal risks, ROI
              projections, and agent trust ratings.
            </p>
            <a
              href="#"
              className="bg-[#0A1A22] text-white text-xl px-10 h-[67px] flex items-center justify-center rounded-full hover:bg-[#11242e] transition"
            >
              See full report sample
            </a>
          </div>
        </div>
      </section>

      <section className="w-full py-20 px-[10%]">
        <Text className="text-inda-dark font-bold text-3xl sm:text-3xl mb-6">
          Features
        </Text>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-[#54B1AD] rounded-2xl p-8 flex flex-col items-start gap-6 min-h-[150px]">
            <span className="text-white text-3xl">
              <BiSearchAlt2 />
            </span>
            <span className="text-white text-2xl font-medium">
              Verify Any Listing
            </span>
          </div>
          {/* Feature 2 */}
          <div className="bg-[#54B1AD] rounded-2xl p-8 flex flex-col items-start gap-6 min-h-[150px]">
            <span className="text-white text-3xl">
              <GiBrain />
            </span>
            <span className="text-white text-2xl font-medium">
              AI Insights You Can Trust
            </span>
          </div>
          {/* Feature 3 */}
          <div className="bg-[#54B1AD] rounded-2xl p-8 flex flex-col items-start gap-6 min-h-[150px]">
            <span className="text-white text-3xl">
              <FiUsers />
            </span>
            <span className="text-white text-2xl font-medium">
              Detect Scam Agents
            </span>
          </div>
          {/* Feature 4 */}
          <div className="bg-[#54B1AD] rounded-2xl p-8 flex flex-col items-start gap-6 min-h-[150px]">
            <span className="text-white text-3xl">
              <FiBarChart2 />
            </span>
            <span className="text-white text-2xl font-medium">
              Project ROI Like a Pro
            </span>
          </div>
          {/* Feature 5 */}
          <div className="bg-[#54B1AD] rounded-2xl p-8 flex flex-col items-start gap-6 min-h-[150px]">
            <span className="text-white text-3xl">
              <FiUsers />
            </span>
            <span className="text-white text-2xl font-medium">
              Community-Sourced Reviews
            </span>
          </div>
          {/* Feature 6 */}
          <div className="bg-[#54B1AD] rounded-2xl p-8 flex flex-col items-start gap-6 min-h-[150px]">
            <span className="text-white text-3xl">
              <FiTrendingUp />
            </span>
            <span className="text-white text-2xl font-medium">
              Find Underpriced Deals
            </span>
          </div>
        </div>
      </section>

      <section className="w-full px-[10%] py-20 flex flex-col items-start justify-center">
        <Text className="text-inda-dark font-bold text-3xl md:text-3xl mb-6">
          Pricing
        </Text>
        <div
          className="w-full rounded-3xl border border-[#E2E4E8] bg-white p-8 md:p-12 flex flex-col gap-8"
          style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
        >
          <div className="w-full flex flex-col items-center">
            <div className="w-full flex flex-col md:flex-row gap-8 justify-center">
              {/* Basic Summary with Pricing Breakdown Button */}
              <div>
                <div className="flex-1 min-w-[260px] bg-white rounded-2xl border border-[#D1D5DB] p-8 flex flex-col justify-between">
                  <div>
                    <div className="font-bold text-xl mb-4 text-inda-dark">
                      Basic Summary
                    </div>
                    <div className="text-3xl font-extrabold text-inda-dark mb-2 flex items-center">
                      <span className="line-through mr-2">₦0</span>
                    </div>
                    <ul className="mt-6 mb-2">
                      <li className="flex items-center gap-2 text-lg text-inda-dark/90">
                        <span className="text-2xl text-inda-dark">✓</span>{" "}
                        Report preview
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="w-full flex justify-center mt-8">
                  <button className="bg-[#F5F6F7] text-inda-dark font-bold text-xl rounded-2xl px-10 py-6 shadow-md hover:bg-[#e9eaeb] transition">
                    See Pricing Breakdown
                  </button>
                </div>
              </div>
              {/* Deep Report */}
              <div className="flex-1 min-w-[260px] bg-white rounded-2xl border border-[#D1D5DB] p-8 flex flex-col justify-between">
                <div>
                  <div className="font-bold text-xl mb-4 text-inda-dark">
                    Deep Report
                  </div>
                  <div className="text-3xl font-extrabold text-inda-dark mb-2 flex items-center">
                    <span className="mr-2">₦15,000</span>
                    <span className="text-lg font-medium text-inda-dark/70">
                      / use
                    </span>
                  </div>
                  <ul className="mt-6 mb-2 space-y-2">
                    <li className="flex items-center gap-2 text-lg text-inda-dark/90">
                      <span className="text-2xl text-inda-dark">✓</span>{" "}
                      Detailed property report
                    </li>
                    <li className="flex items-center gap-2 text-lg text-inda-dark/90">
                      <span className="text-2xl text-inda-dark">✓</span>{" "}
                      Verification stamp
                    </li>
                    <li className="flex items-center gap-2 text-lg text-inda-dark/90">
                      <span className="text-2xl text-inda-dark">✓</span> Legal
                      risk assessment
                    </li>
                    <li className="flex items-center gap-2 text-lg text-inda-dark/90">
                      <span className="text-2xl text-inda-dark">✓</span> ROI
                      chart
                    </li>
                    <li className="flex items-center gap-2 text-lg text-inda-dark/90">
                      <span className="text-2xl text-inda-dark">✓</span> Agent
                      trust rating
                    </li>
                  </ul>
                </div>
              </div>
              {/* Pro Access */}
              <div className="flex-1 min-w-[260px] bg-white rounded-2xl border border-[#D1D5DB] p-8 flex flex-col justify-between">
                <div>
                  <div className="font-bold text-xl mb-4 text-inda-dark">
                    Pro Access
                  </div>
                  <div className="text-3xl font-extrabold text-inda-dark mb-2 flex items-center">
                    <span className="mr-2">₦55,000</span>
                    <span className="text-lg font-medium text-inda-dark/70">
                      / month
                    </span>
                  </div>
                  <ul className="mt-6 mb-2 space-y-2">
                    <li className="flex items-center gap-2 text-lg text-inda-dark/90">
                      <span className="text-2xl text-inda-dark">✓</span>{" "}
                      Unlimited deep reports
                    </li>
                    <li className="flex items-center gap-2 text-lg text-inda-dark/90">
                      <span className="text-2xl text-inda-dark">✓</span> Live
                      ROI Alerts + Market Signals
                    </li>
                    <li className="flex items-center gap-2 text-lg text-inda-dark/90">
                      <span className="text-2xl text-inda-dark">✓</span>{" "}
                      Exclusive market insights
                    </li>
                    <li className="flex items-center gap-2 text-lg text-inda-dark/90">
                      <span className="text-2xl text-inda-dark">✓</span>{" "}
                      Portfolio Dashboard
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full px-[10%] py-20 flex flex-col items-start justify-center">
        <Text className="text-inda-dark font-bold text-3xl md:text-3xl mb-6">
          Frequently Asked Questions
        </Text>
        <FAQ />
      </section>

      {/* CTA Section - See the truth behind that listing today! */}
      <section className="w-full flex justify-center items-center py-24 bg-transparent">
        <div
          className="relative w-[95%] mx-auto rounded-[64px] bg-[#54B1AD] flex flex-col items-center justify-center px-6 md:px-0"
          style={{
            minHeight: 540,
            border: "1.5px solid #fff",
            boxSizing: "border-box",
          }}
        >
          {/* Thin white border inside */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="w-full h-full rounded-[56px] border border-white opacity-60 absolute top-4 left-4"
              style={{ zIndex: 1 }}
            ></div>
          </div>
          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center justify-center w-full h-full py-16">
            <h2
              className="text-white text-center font-extrabold text-4xl sm:text-5xl md:text-6xl leading-tight mb-10"
              style={{ letterSpacing: 0 }}
            >
              See the truth behind
              <br className="hidden sm:block" />
              that listing today!
            </h2>
            <button
              className="bg-[#101820] text-white text-2xl font-normal rounded-full px-12 py-5 mt-2 shadow-lg hover:bg-[#1a2a33] transition focus:outline-none"
              style={{ minWidth: 380 }}
            >
              Try your first search now
            </button>
          </div>
          {/* Chat with Us button and horizontal line */}
          <button
            id="cta-chat-btn"
            className="absolute left-8 bottom-16 bg-[#101820] text-white text-xl font-normal rounded-full px-10 py-4 shadow-lg hover:bg-[#1a2a33] transition focus:outline-none"
            style={{ minWidth: 260, zIndex: 10 }}
          >
            Chat with Us
          </button>
          {/* Thin horizontal line starting beside Chat with Us button */}
          <div
            className="absolute bottom-16 bg-white opacity-60 h-px"
            style={{
              left: `calc(8px + 260px + 2.5rem)`, // 8px left + minWidth + px-10 padding
              right: 0,
              zIndex: 2,
            }}
          ></div>
        </div>
      </section>
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

import { useState as useFAQState } from "react";

const FAQ = () => {
  const [open, setOpen] = useFAQState<number | null>(null);
  return (
    <div className="w-full max-w-3xl flex flex-col gap-6">
      {faqData.map((item, i) => {
        const isOpen = open === i;
        return (
          <div
            key={item.q}
            className={`w-full bg-white rounded-2xl border border-[#ECECEC] shadow-sm transition-all duration-200 ${
              isOpen ? "shadow-md" : "hover:shadow-md"
            } cursor-pointer`}
            style={{ minHeight: 64 }}
            onClick={() => setOpen(isOpen ? null : i)}
          >
            <div className="flex items-center justify-between px-8 py-6 text-inda-dark text-xl md:text-2xl font-medium select-none">
              <span>{item.q}</span>
              <svg
                width="32"
                height="32"
                fill="none"
                stroke="#101820"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`ml-4 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
                style={{ minWidth: 32 }}
              >
                <polyline points="8 12 16 20 24 12" />
              </svg>
            </div>
            {isOpen && (
              <div className="px-8 pb-6 pt-0 text-inda-dark/90 text-base md:text-lg font-normal animate-fadeIn">
                <div>{item.a}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Landing;
