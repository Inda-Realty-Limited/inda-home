import Script from "next/script";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  lat: number;
  lng: number;
  heading?: number;
  pitch?: number;
  fov?: number; // 30-120
  className?: string;
};

declare global {
  interface Window {
    google: any;
  }
}

const StreetView: React.FC<Props> = ({
  lat,
  lng,
  heading = 210,
  pitch = 0,
  fov = 90,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [noCoverage, setNoCoverage] = useState(false);
  // Demo mode shows a known-covered residential area with houses
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  // Default demo location to a well-known urban area with coverage
  const demoLat = Number(process.env.NEXT_PUBLIC_SV_DEMO_LAT ?? 40.758);
  const demoLng = Number(process.env.NEXT_PUBLIC_SV_DEMO_LNG ?? -73.9855);
  const [useDemo, setUseDemo] = useState<boolean>(!apiKey);

  useEffect(() => {
    if (!apiKey) return; // we'll render iframe fallback below
    if (!scriptReady || !containerRef.current) return;

    const init = () => {
      const sv = new window.google.maps.StreetViewService();
      const tryRadii = [50, 100, 250, 500, 1000, 2000, 5000];

      const target = useDemo ? { lat: demoLat, lng: demoLng } : { lat, lng };

      const tryFind = (i: number) => {
        if (i >= tryRadii.length) {
          // No coverage near target; auto-switch to demo area once
          if (!useDemo) {
            setUseDemo(true);
            setNoCoverage(false);
          } else {
            setNoCoverage(true);
          }
          return;
        }
        sv.getPanorama(
          {
            location: target,
            radius: tryRadii[i],
            source: window.google.maps.StreetViewSource.OUTDOOR,
          },
          (data: any, status: any) => {
            const OK = window.google.maps.StreetViewStatus.OK;
            if (status === OK && data?.location?.pano) {
              const zoom = Math.max(
                0,
                Math.min(5, Math.round(1 + (90 - fov) / 20))
              );
              new window.google.maps.StreetViewPanorama(containerRef.current!, {
                pano: data.location.pano,
                pov: { heading, pitch },
                zoom,
                addressControl: false,
                fullscreenControl: false,
                panControl: true,
                zoomControl: true,
                motionTracking: false,
                linksControl: true,
              });
              setNoCoverage(false);
            } else {
              tryFind(i + 1);
            }
          }
        );
      };

      tryFind(0);
    };

    init();
  }, [scriptReady, apiKey, lat, lng, heading, pitch, fov, useDemo]);

  // If no API key provided, fall back to keyless Street View iframe (use demo if requested)
  const fallbackIframe = (
    <div className="w-full h-full relative">
      <iframe
        title="street-view-fallback"
        className="w-full h-full"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://maps.google.com/?layer=c&cbll=${
          useDemo ? demoLat : lat
        },${useDemo ? demoLng : lng}&cbp=11,${heading},0,0,0&output=svembed`}
      />
      <div className="absolute bottom-2 right-2">
        <button
          onClick={() => setUseDemo(true)}
          className="px-3 py-1 text-xs rounded bg-white/90 shadow border"
        >
          View sample Street View
        </button>
      </div>
    </div>
  );

  return (
    <div className={className}>
      {apiKey ? (
        <>
          <Script
            src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}`}
            strategy="lazyOnload"
            onLoad={() => setScriptReady(true)}
          />
          <div ref={containerRef} className="w-full h-full" />
          {noCoverage && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80">
              <div className="text-center p-4">
                <p className="text-sm text-gray-700 mb-2">
                  No Street View coverage here.
                </p>
                <div className="w-full h-48 md:h-64 rounded overflow-hidden">
                  <iframe
                    title="map-fallback"
                    className="w-full h-full"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps?q=${
                      useDemo ? demoLat : lat
                    },${useDemo ? demoLng : lng}&t=k&z=18&output=embed`}
                  />
                </div>
                <button
                  onClick={() => setUseDemo(true)}
                  className="mt-3 px-3 py-1 text-xs rounded bg-inda-teal text-white"
                >
                  View sample Street View
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        // No API key: show keyless Street View (demo by default)
        <iframe
          title="street-view-demo"
          className="w-full h-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://maps.google.com/?layer=c&cbll=${
            useDemo ? demoLat : lat
          },${useDemo ? demoLng : lng}&cbp=11,${heading},0,0,0&output=svembed`}
        />
      )}
    </div>
  );
};

export default StreetView;
