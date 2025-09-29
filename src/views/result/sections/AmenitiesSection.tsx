import React from "react";
import {
  FaBed,
  FaBolt,
  FaBoxes,
  FaCar,
  FaCouch,
  FaHome,
  FaRoad,
  FaShieldAlt,
  FaShower,
  FaUtensils,
  FaWater,
} from "react-icons/fa";

const getAmenityMeta = (label: string) => {
  const l = label.toLowerCase();
  const entry =
    l.includes("gated") || l.includes("fence")
      ? {
          icon: FaShieldAlt,
          bg: "bg-emerald-50",
          fg: "text-emerald-700",
          ring: "ring-emerald-200",
        }
      : l.includes("drainage")
      ? {
          icon: FaWater,
          bg: "bg-cyan-50",
          fg: "text-cyan-700",
          ring: "ring-cyan-200",
        }
      : l.includes("water")
      ? {
          icon: FaWater,
          bg: "bg-sky-50",
          fg: "text-sky-700",
          ring: "ring-sky-200",
        }
      : l.includes("electric") || l.includes("power") || l.includes("light")
      ? {
          icon: FaBolt,
          bg: "bg-amber-50",
          fg: "text-amber-700",
          ring: "ring-amber-200",
        }
      : l.includes("road")
      ? {
          icon: FaRoad,
          bg: "bg-slate-50",
          fg: "text-slate-700",
          ring: "ring-slate-200",
        }
      : l.includes("parking") || l.includes("car")
      ? {
          icon: FaCar,
          bg: "bg-emerald-50",
          fg: "text-emerald-700",
          ring: "ring-emerald-200",
        }
      : l.includes("shower") || l.includes("bath")
      ? {
          icon: FaShower,
          bg: "bg-sky-50",
          fg: "text-sky-700",
          ring: "ring-sky-200",
        }
      : l.includes("kitchen")
      ? {
          icon: FaUtensils,
          bg: "bg-amber-50",
          fg: "text-amber-700",
          ring: "ring-amber-200",
        }
      : l.includes("living") || l.includes("lounge")
      ? {
          icon: FaCouch,
          bg: "bg-indigo-50",
          fg: "text-indigo-700",
          ring: "ring-indigo-200",
        }
      : l.includes("closet") || l.includes("storage")
      ? {
          icon: FaBoxes,
          bg: "bg-fuchsia-50",
          fg: "text-fuchsia-700",
          ring: "ring-fuchsia-200",
        }
      : l.includes("security") || l.includes("secure") || l.includes("estate")
      ? {
          icon: FaShieldAlt,
          bg: "bg-rose-50",
          fg: "text-rose-700",
          ring: "ring-rose-200",
        }
      : l.includes("bed") || l.includes("bedroom")
      ? {
          icon: FaBed,
          bg: "bg-teal-50",
          fg: "text-teal-700",
          ring: "ring-teal-200",
        }
      : {
          icon: FaHome,
          bg: "bg-gray-50",
          fg: "text-gray-700",
          ring: "ring-gray-200",
        };
  return entry;
};

const extractAmenities = (snap: any): string[] => {
  const fromField = Array.isArray(snap?.amenities)
    ? snap.amenities.filter(Boolean).map((x: any) => String(x))
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
        .map((s) => s.trim())
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
      if (/^[\-•*·]/.test(l)) feats.push(l.replace(/^[\-−•*·]\s*/, ""));
      else if (/,/.test(l)) {
        l.split(/,|·|•|\||\/|;|\s{2,}/)
          .map((s) => s.trim())
          .filter(Boolean)
          .forEach((s) => feats.push(s));
      } else feats.push(l);
    }
  } else {
    feats = lines
      .filter((l) => /^[\-•*·]/.test(l))
      .map((l) => l.replace(/^[\-−•*·]\s*/, ""));
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
    const norm = f.replace(/\s+/g, " ").trim();
    if (norm && !uniq.some((u) => u.toLowerCase() === norm.toLowerCase()))
      uniq.push(norm);
  });
  return uniq.slice(0, 20);
};

type Props = { result: any };

const AmenitiesSection: React.FC<Props> = ({ result }) => {
  const amenities = extractAmenities(result?.snapshot || result);
  return (
    <div className="w-full px-6">
      <div className="rounded-lg py-8">
        <h3 className="text-2xl md:text-3xl font-bold mb-8">Amenities</h3>
        {!amenities || amenities.length === 0 ? (
          <div className="flex items-center justify-center min-h-[120px] rounded-xl border border-dashed border-gray-300 text-gray-600">
            No amenities listed.
          </div>
        ) : (
          <div className="bg-[#E5E5E566] rounded-2xl p-4 sm:p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {amenities.map((a, i) => {
                const meta = getAmenityMeta(a);
                const Icon = meta.icon as any;
                return (
                  <div
                    key={`${a}-${i}`}
                    className={`group flex items-center gap-3 rounded-xl ${meta.bg} ring-1 ${meta.ring} px-3 py-3 sm:px-4 sm:py-4 transition-colors hover:bg-white hover:shadow-sm`}
                  >
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-lg ${meta.bg} ${meta.fg} ring-1 ${meta.ring} group-hover:bg-[#4EA8A1]/10 group-hover:text-[#4EA8A1] group-hover:ring-[#4EA8A1]/20`}
                    >
                      <Icon className="text-base sm:text-lg" />
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-[#101820] line-clamp-2">
                      {a}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AmenitiesSection;
