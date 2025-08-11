import { Button, Container, Footer, Input, Navbar } from "@/components";
import React, { useMemo, useRef, useState } from "react";
import { FaCheckCircle, FaUpload } from "react-icons/fa";

type InteractionType = "Contacted" | "Met" | "Transacted";

const sliderBg = (value: number) => {
  const pct = ((value - 1) / 4) * 100;
  return {
    background: `linear-gradient(to right, #0A0A0A ${pct}%, #e5e7eb ${pct}%)`,
  } as React.CSSProperties;
};

const AgentReviewPage: React.FC = () => {
  const [agentName, setAgentName] = useState("");
  const [agencyName, setAgencyName] = useState("");
  const [isRecommended, setIsRecommended] = useState<"Yes" | "No" | "Not Sure">(
    "Yes"
  );
  const [interactions, setInteractions] = useState<InteractionType[]>([]);
  const [communication, setCommunication] = useState(3);
  const [honesty, setHonesty] = useState(3);
  const [speedOfResponse, setSpeedOfResponse] = useState(3);
  const [dealDelivery, setDealDelivery] = useState(3);
  const [wouldRecommend, setWouldRecommend] = useState<"Yes" | "No">("Yes");
  const [details, setDetails] = useState("");
  const [tags, setTags] = useState({
    hiddenCharges: false,
    accuratePhotos: false,
    badAgentBehavior: false,
    greatInvestment: false,
    other: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleInteraction = (interaction: InteractionType) => {
    setInteractions((prev) =>
      prev.includes(interaction)
        ? prev.filter((x) => x !== interaction)
        : [...prev, interaction]
    );
  };

  const canSubmit = useMemo(() => agentName.trim() !== "", [agentName]);

  return (
    <Container noPadding className="min-h-screen bg-[#F9F9F9] flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-[980px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-[#E5E5E54D] rounded-2xl border border-gray-100 p-6 sm:p-8">
            <div className="mb-6">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#101820] flex items-center gap-2">
                <span role="img" aria-label="emoji">
                  📝
                </span>
                Leave an Agent Review
              </h1>
              <p className="text-sm text-[#101820]/70 mt-1">
                Help others find reliable agents by sharing your insights.
              </p>
            </div>

            {/* Single column layout */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm text-[#101820] font-semibold block">
                    Agent/Developer Name
                  </label>
                  <Input
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    placeholder="Start typing to search"
                    className="bg-white border-gray-300 focus:border-[#101820] w-full"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm text-[#101820] font-semibold block">
                    Agency (if applicable)
                  </label>
                  <Input
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                    placeholder="Enter agency name"
                    className="bg-white border-gray-300 focus:border-[#101820] w-full"
                  />
                </div>

                {/* Recommendation Pills */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {(["Yes", "No", "Not Sure"] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setIsRecommended(option)}
                      className={`rounded-full px-3 py-1.5 text-sm border transition ${
                        isRecommended === option
                          ? "bg-[#4EA8A1]/10 text-[#101820] border-[#4EA8A1]/30"
                          : "bg-white text-[#101820] border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* How did you interact with the agent? */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-[#101820]">
                  How did you interact with the agent?
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(["📞 Contacted", "🤝 Met", "🏠 Transacted"] as const).map(
                    (label) => {
                      const interaction = label.replace(
                        /^.*?\s/,
                        ""
                      ) as InteractionType;
                      const active = interactions.includes(interaction);
                      return (
                        <button
                          key={label}
                          type="button"
                          onClick={() => toggleInteraction(interaction)}
                          className={`rounded-full px-3 py-1.5 text-sm border transition ${
                            active
                              ? "bg-[#4EA8A1]/10 text-[#101820] border-[#4EA8A1]/30"
                              : "bg-white text-[#101820] border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {label}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Rate Your Experience */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[#101820]">
                  Rate Your Experience
                </h3>

                {/* Communication */}
                <div className="space-y-2">
                  <label className="text-sm text-[#101820] font-semibold block">
                    Communication
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={1}
                      max={5}
                      step={1}
                      value={communication}
                      onChange={(e) =>
                        setCommunication(parseInt(e.target.value))
                      }
                      className="flex-1 h-[2px] appearance-none rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#0A0A0A]"
                      style={sliderBg(communication)}
                    />
                    <span className="text-xs text-[#101820]/60">5</span>
                  </div>
                </div>

                {/* Honesty */}
                <div className="space-y-2">
                  <label className="text-sm text-[#101820] font-semibold block">
                    Honesty
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={1}
                      max={5}
                      step={1}
                      value={honesty}
                      onChange={(e) => setHonesty(parseInt(e.target.value))}
                      className="flex-1 h-[2px] appearance-none rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#0A0A0A]"
                      style={sliderBg(honesty)}
                    />
                    <span className="text-xs text-[#101820]/60">5</span>
                  </div>
                </div>

                {/* Speed of Response */}
                <div className="space-y-2">
                  <label className="text-sm text-[#101820] font-semibold block">
                    Speed of Response
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={1}
                      max={5}
                      step={1}
                      value={speedOfResponse}
                      onChange={(e) =>
                        setSpeedOfResponse(parseInt(e.target.value))
                      }
                      className="flex-1 h-[2px] appearance-none rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#0A0A0A]"
                      style={sliderBg(speedOfResponse)}
                    />
                    <span className="text-xs text-[#101820]/60">5</span>
                  </div>
                </div>

                {/* Deal Delivery */}
                <div className="space-y-2">
                  <label className="text-sm text-[#101820] font-semibold block">
                    Deal Delivery
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min={1}
                      max={5}
                      step={1}
                      value={dealDelivery}
                      onChange={(e) =>
                        setDealDelivery(parseInt(e.target.value))
                      }
                      className="flex-1 h-[2px] appearance-none rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#0A0A0A]"
                      style={sliderBg(dealDelivery)}
                    />
                    <span className="text-xs text-[#101820]/60">5</span>
                  </div>
                </div>
              </div>

              {/* Would you recommend them? */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-[#101820]">
                  Would you recommend them?
                </h4>
                <div className="flex gap-2">
                  {(["Yes", "No"] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setWouldRecommend(option)}
                      className={`rounded-full px-3 py-1.5 text-sm border transition ${
                        wouldRecommend === option
                          ? "bg-[#4EA8A1]/10 text-[#101820] border-[#4EA8A1]/30"
                          : "bg-white text-[#101820] border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Detailed Feedback */}
              <div className="space-y-1.5">
                <label className="text-sm text-[#101820] font-semibold block">
                  Detailed Feedback
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  rows={5}
                  placeholder="Share details of your experience"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-[#101820] focus:outline-none focus:border-[#101820]"
                />
              </div>

              {/* Tags */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-[#101820]">Tags</h4>
                <div className="grid grid-cols-2 gap-y-3">
                  <label className="inline-flex items-center gap-2 text-sm text-[#101820]">
                    <input
                      type="checkbox"
                      checked={tags.hiddenCharges}
                      onChange={(e) =>
                        setTags((t) => ({
                          ...t,
                          hiddenCharges: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    Hidden Charges
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm text-[#101820]">
                    <input
                      type="checkbox"
                      checked={tags.accuratePhotos}
                      onChange={(e) =>
                        setTags((t) => ({
                          ...t,
                          accuratePhotos: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    Accurate Photos
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm text-[#101820]">
                    <input
                      type="checkbox"
                      checked={tags.badAgentBehavior}
                      onChange={(e) =>
                        setTags((t) => ({
                          ...t,
                          badAgentBehavior: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    Bad Agent Behavior
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm text-[#101820]">
                    <input
                      type="checkbox"
                      checked={tags.greatInvestment}
                      onChange={(e) =>
                        setTags((t) => ({
                          ...t,
                          greatInvestment: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    Great Investment
                  </label>
                  <div className="col-span-2 flex items-center gap-3">
                    <label className="inline-flex items-center gap-2 text-sm text-[#101820]">
                      <input
                        type="checkbox"
                        checked={!!tags.other}
                        onChange={(e) =>
                          setTags((t) => ({
                            ...t,
                            other: e.target.checked ? t.other : "",
                          }))
                        }
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      Other
                    </label>
                    <div className="flex-1 h-px bg-gray-300" />
                  </div>
                </div>
              </div>

              {/* Upload Media */}
              <div className="rounded-2xl border-2 border-dashed border-[#4EA8A1]/30 bg-[#F9F9F9] p-6 text-center">
                <h5 className="text-sm font-semibold text-[#101820]">
                  Upload Media (Optional)
                </h5>
                <p className="text-xs text-[#101820]/60 mt-1">
                  Add photos or videos to your review
                </p>
                <div className="mt-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    className="hidden"
                    onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded-full border border-[#E2E4E8] bg-white px-5 py-2 text-sm text-[#101820] hover:bg-gray-50"
                  >
                    <FaUpload className="text-[#4EA8A1]" /> Upload
                  </button>
                </div>
                {files.length > 0 && (
                  <div className="mt-3 text-xs text-[#101820]/70">
                    {files.length} file(s) selected
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <Button
                  disabled={!canSubmit}
                  className={`rounded-full px-6 py-3 text-sm sm:text-base flex items-center gap-2 ${
                    canSubmit
                      ? "bg-[#4EA8A1] text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <FaCheckCircle /> Submit Property Review
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </Container>
  );
};

export default AgentReviewPage;
