import React from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

type Props = {
  isOpen: boolean;
  toggle: () => void;
  aiSummary?: string | null;
};

const MapInsights: React.FC<Props> = ({ isOpen, toggle, aiSummary }) => {
  const embed = process.env.NEXT_PUBLIC_RESULTS_MAP_EMBED_URL;
  const lat = Number(process.env.NEXT_PUBLIC_MAP_DEFAULT_LAT ?? 6.6018);
  const lng = Number(process.env.NEXT_PUBLIC_MAP_DEFAULT_LNG ?? 3.3515);
  const zoom = Number(process.env.NEXT_PUBLIC_MAP_DEFAULT_ZOOM ?? 16);
  let AerialMap: any = null;
  if (!embed) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      AerialMap = require("@/components/inc/AerialMap").default;
    } catch {}
  }
  return (
    <div className="w-full px-4">
      <div className=" rounded-lg p-4">
        <h3 className="text-2xl md:text-3xl font-bold mb-8 text-inda-teal">
          Microlocation Insights
        </h3>
        <div className="flex flex-col gap-6">
          <div>
            <div className="h-[360px] sm:h-[480px] md:h-[560px] lg:h-[640px] xl:h-[700px] rounded-lg overflow-hidden bg-white">
              {embed ? (
                <iframe
                  title="results-map-embed"
                  className="w-full h-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={embed}
                />
              ) : AerialMap ? (
                <AerialMap
                  lat={lat}
                  lng={lng}
                  zoom={zoom}
                  useOblique={false}
                  heading={0}
                  mapType="hybrid"
                  className="relative w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  Map unavailable
                </div>
              )}
            </div>
          </div>
          <div>
            <div
              className="flex items-center justify-between cursor-pointer mb-2"
              onClick={toggle}
            >
              <h4 className="text-xl font-bold text-inda-teal">AI Summary</h4>
              {isOpen ? (
                <FaChevronUp className="text-inda-teal" />
              ) : (
                <FaChevronDown className="text-inda-teal" />
              )}
            </div>
            {isOpen && (
              <div className="bg-transparent rounded-lg">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {aiSummary || (
                    <span className="text-[#101820]/70">
                      We’re still compiling micro‑location signals (flood risk,
                      access roads, market depth, safety indices).
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapInsights;
