import React from "react";

const extractAmenities = (snap: any): string[] => {
  // Alias mapping to unify common phrases
  const aliasMap: Record<string, string> = {
    "car park": "Parking",
    "car parking": "Parking",
    "parking space": "Parking",
    "swimming pool": "Swimming Pool",
    "walk in closet": "Walk-in Closet",
    wardrobes: "Wardrobes",
    "water heater": "Water Heater",
    "heat extractor": "Kitchen Heat Extractor",
    "modern day pop ceiling": "POP Ceiling",
    "pop ceiling": "POP Ceiling",
    elevator: "Elevator",
    lift: "Elevator",
    "fully furnished": "Fully Furnished",
    "private terrace": "Private Terrace",
    "outdoor kitchen": "Outdoor Kitchen",
    "communal gym": "Communal Gym",
    "24/7 power supply": "24/7 Power Supply",
    "24/7 security guards": "24/7 Security",
  };

  const cleanAmenity = (txt: string): string => {
    if (!txt) return "";
    let s = String(txt);
    // Remove zero-width/invisible chars
    s = s.replace(/[\u200B-\u200D\uFEFF\u2060]/g, "");
    // Remove leading checkbox markers like [ ], [x], including with invisible char prefix
    s = s.replace(/^\s*(?:\[\s*[xX]?\s*\])\s*/i, "");
    // Remove common bullet prefixes or dashes
    s = s.replace(/^[\-\u2022\u2219\*·•]+\s*/, "");
    s = s.replace(/^[–—]\s*/, "");
    // Collapse spaces
    s = s.replace(/\s+/g, " ").trim();
    const lower = s.toLowerCase();
    return aliasMap[lower] || s;
  };

  const fromField = Array.isArray(snap?.amenities)
    ? snap.amenities
        .filter(Boolean)
        .map((x: any) => cleanAmenity(String(x)))
        .filter(Boolean)
    : [];
  if (fromField.length) return fromField;
  const title: string = String(snap?.title || "");
  const desc: string = String(snap?.description || "");
  const lines = desc
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  let feats: string[] = [];
  const headerIdx = lines.findIndex((l) => /^features\s*:?.*$/i.test(l));
  if (headerIdx !== -1) {
    const headerLine = lines[headerIdx];
    const afterColon = headerLine.split(/:/)[1];
    if (afterColon) {
      afterColon
        .split(/,|·|•|\||\/|;|\s{2,}/)
        .map((s) => cleanAmenity(s))
        .filter(Boolean)
        .forEach((s) => feats.push(s));
    }
    for (let i = headerIdx + 1; i < lines.length; i++) {
      const l = lines[i];
      if (
        /^title\s*:|^price\s*:|^location\s*:|^video\s*:|^documents?\s*:|^[A-Z][A-Za-z ]+\s*:\s*$/.test(
          l
        )
      )
        break;
      if (/^[\-•*·\[]/.test(l)) {
        feats.push(cleanAmenity(l));
      } else if (/,/.test(l)) {
        l.split(/,|·|•|\||\/|;|\s{2,}/)
          .map((s) => cleanAmenity(s))
          .filter(Boolean)
          .forEach((s) => feats.push(s));
      } else {
        const cleaned = cleanAmenity(l);
        if (cleaned) feats.push(cleaned);
      }
    }
  } else {
    feats = lines
      .filter((l) => /^[\-•*·\[]/.test(l))
      .map((l) => cleanAmenity(l));
  }
  const textBank = `${title}\n${desc}`.toLowerCase();
  const hints = [
    { re: /\bgated\b/, label: "Gated" },
    { re: /\bfenc(e|ed|ing)\b/, label: "Fenced" },
    { re: /\bsecurity|secure|estate security\b/, label: "24/7 Security" },
    {
      re: /\btarred road|good road|paved road|access road\b/,
      label: "Good Road Access",
    },
    { re: /\bdrainage\b/, label: "Drainage" },
    { re: /\bwater( supply)?\b/, label: "Water Supply" },
    { re: /\belectric(it(y|ies))?|power|light(s)?\b/, label: "Electricity" },
    { re: /\bparking|car park\b/, label: "Parking" },
  ];
  hints.forEach((h) => {
    if (h.re.test(textBank)) feats.push(h.label);
  });
  const typeStd = String(snap?.propertyTypeStd || "").toLowerCase();
  if (typeStd.includes("land")) {
    if (/\bgated\b/.test(title.toLowerCase())) feats.push("Gated");
    if (/\bfenc(e|ed|ing)\b/.test(title.toLowerCase())) feats.push("Fenced");
  }
  const uniq: string[] = [];
  feats.forEach((f) => {
    const norm = cleanAmenity(f);
    if (norm && !uniq.some((u) => u.toLowerCase() === norm.toLowerCase()))
      uniq.push(norm);
  });
  return uniq.slice(0, 20);
};

type Props = { result: any };

const AmenitiesSection: React.FC<Props> = ({ result }) => {
  const source = result?.snapshot || result;
  const amenities = extractAmenities(source);

  return (
    <div className="w-full px-6">
      <div className="rounded-lg py-8">
        <h3 className="text-2xl md:text-3xl font-bold mb-6 text-inda-teal">
          Amenities
        </h3>
        {!amenities || amenities.length === 0 ? (
          <div className="flex items-center justify-center min-h-[120px] rounded-xl border border-dashed border-gray-300 text-gray-600">
            No amenities listed.
          </div>
        ) : (
          <div className="bg-[#E8F4F3] rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8">
              {amenities.map((amenity, index) => (
                <div key={`${amenity}-${index}`} className="flex items-center gap-3">
                  {/* Checkmark icon */}
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="flex-shrink-0"
                  >
                    <circle cx="12" cy="12" r="12" fill="#4EA8A1" />
                    <path
                      d="M7 12l3 3 7-7"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {/* Amenity name */}
                  <span className="text-sm text-gray-900">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AmenitiesSection;
