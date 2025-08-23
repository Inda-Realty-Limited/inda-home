import { Button, Container, Footer, Input, Navbar } from "@/components";
import React, { useMemo, useRef, useState } from "react";
import { FaCheckCircle, FaUpload } from "react-icons/fa";

type Chip = "Bought" | "Visited" | "Inquired Only";

const sliderBg = (value: number) => {
  const pct = ((value - 1) / 4) * 100;
  return {
    background: `linear-gradient(to right, #0A0A0A ${pct}%, #e5e7eb ${pct}%)`,
  } as React.CSSProperties;
};

const ReviewPage: React.FC = () => {
  const [propertyName, setPropertyName] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [chips, setChips] = useState<Chip[]>([]);
  const [trust, setTrust] = useState(3);
  const [valueForMoney, setValueForMoney] = useState(3);
  const [locationAccuracy, setLocationAccuracy] = useState(3);
  const [hiddenFees, setHiddenFees] = useState(3);
  const [details, setDetails] = useState("");
  const [tags, setTags] = useState({
    hiddenCharges: false,
    accuratePhotos: false,
    badAgent: false,
    greatInvestment: false,
    other: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleChip = (c: Chip) => {
    setChips((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  const canSubmit = useMemo(
    () => propertyName.trim() !== "" && location.trim() !== "",
    [propertyName, location]
  );

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
                Leave a Property Review
              </h1>
              <p className="text-sm text-[#101820]/70 mt-1">
                Share your experience to help others make informed decisions.
              </p>
            </div>

            {/* Two column layout matching screenshot exactly */}
            <div className="flex flex-col gap-8">
              <div className="space-y-6">
                {/* Basic Info Inputs */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-sm text-[#101820] font-semibold block">
                      Property Name
                    </label>
                    <Input
                      value={propertyName}
                      onChange={(e) => setPropertyName(e.target.value)}
                      placeholder="Enter property name"
                      className="bg-white border-gray-300 focus:border-[#101820] w-full"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm text-[#101820] font-semibold block">
                      Location or Address
                    </label>
                    <Input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Enter address"
                      className="bg-white border-gray-300 focus:border-[#101820] w-full"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm text-[#101820] font-semibold block">
                      Transaction Date (Optional)
                    </label>
                    <Input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="bg-white border-gray-300 focus:border-[#101820] w-full"
                    />
                  </div>

                  {/* Chips */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {["🧾 Bought", "👀 Visited", "📞 Inquired Only"].map(
                      (label) => {
                        const c = label.replace(
                          /^.*?\s/,
                          ""
                        ) as unknown as Chip;
                        const active = chips.includes(c);
                        return (
                          <button
                            key={label}
                            type="button"
                            onClick={() => toggleChip(c)}
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

                {/* Rate Your Experience section */}
                <div className="">
                  <h3 className="text-sm font-semibold text-[#101820] mb-4">
                    Rate Your Experience
                  </h3>
                  <div className="space-y-4">
                    {/* Trust Level */}
                    <div className="space-y-2">
                      <label className="text-sm text-[#101820] font-semibold block">
                        Trust Level
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min={1}
                          max={5}
                          step={1}
                          value={trust}
                          onChange={(e) => setTrust(parseInt(e.target.value))}
                          className="flex-1 h-[2px] appearance-none rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#0A0A0A]"
                          style={sliderBg(trust)}
                        />
                        <span className="text-xs text-[#101820]/60">5</span>
                      </div>
                    </div>

                    {/* Value for Money */}
                    <div className="space-y-2">
                      <label className="text-sm text-[#101820] font-semibold block">
                        Value for Money
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min={1}
                          max={5}
                          step={1}
                          value={valueForMoney}
                          onChange={(e) =>
                            setValueForMoney(parseInt(e.target.value))
                          }
                          className="flex-1 h-[2px] appearance-none rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#0A0A0A]"
                          style={sliderBg(valueForMoney)}
                        />
                        <span className="text-xs text-[#101820]/60">5</span>
                      </div>
                    </div>

                    {/* Location Accuracy */}
                    <div className="space-y-2">
                      <label className="text-sm text-[#101820] font-semibold block">
                        Location Accuracy
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min={1}
                          max={5}
                          step={1}
                          value={locationAccuracy}
                          onChange={(e) =>
                            setLocationAccuracy(parseInt(e.target.value))
                          }
                          className="flex-1 h-[2px] appearance-none rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#0A0A0A]"
                          style={sliderBg(locationAccuracy)}
                        />
                        <span className="text-xs text-[#101820]/60">5</span>
                      </div>
                    </div>

                    {/* Disclosed Hidden Fees */}
                    <div className="space-y-2">
                      <label className="text-sm text-[#101820] font-semibold block">
                        Disclosed Hidden Fees
                      </label>
                      <div className="flex items-center gap-4">
                        <input
                          type="range"
                          min={1}
                          max={5}
                          step={1}
                          value={hiddenFees}
                          onChange={(e) =>
                            setHiddenFees(parseInt(e.target.value))
                          }
                          className="flex-1 h-[2px] appearance-none rounded-full [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#0A0A0A]"
                          style={sliderBg(hiddenFees)}
                        />
                        <span className="text-xs text-[#101820]/60">5</span>
                      </div>
                    </div>
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
                        checked={tags.badAgent}
                        onChange={(e) =>
                          setTags((t) => ({ ...t, badAgent: e.target.checked }))
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
              </div>
            </div>

            {/* Full width sections at bottom */}
            <div className="mt-8 space-y-6">
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

export default ReviewPage;
