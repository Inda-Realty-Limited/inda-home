import Script from "next/script";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  lat: number;
  lng: number;
  zoom?: number; // 3 - 21
  useOblique?: boolean; // try 45° tilt where available
  heading?: number; // 0-360 for rotate when oblique is on
  mapType?: "satellite" | "hybrid"; // hybrid shows labels
  className?: string;
  showMarker?: boolean;
};

declare global {
  interface Window {
    google: any;
  }
}

const AerialMap: React.FC<Props> = ({
  lat,
  lng,
  zoom = 19,
  useOblique = true,
  heading = 0,
  mapType = "hybrid",
  className,
  showMarker = true,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!apiKey) return; // iframe fallback below
    if (!scriptReady || !containerRef.current) return;

    let map: any;
    let marker: any;
    try {
      const g = window.google;
      map = new g.maps.Map(containerRef.current, {
        center: { lat, lng },
        zoom,
        mapTypeId:
          mapType === "satellite"
            ? g.maps.MapTypeId.SATELLITE
            : g.maps.MapTypeId.HYBRID,
        tilt: useOblique ? 45 : 0,
        heading: useOblique ? heading : 0,
        disableDefaultUI: false,
        rotateControl: true,
        streetViewControl: false,
        mapTypeControl: true,
        fullscreenControl: true,
        gestureHandling: "greedy",
      });

      if (useOblique) {
        // Attempt to keep 45° tilt at high zoom; fallback handled by Maps API if not available
        const enforceTilt = () => {
          if (map.getTilt?.() !== 45) {
            map.setTilt?.(45);
          }
          map.setHeading?.(heading);
        };
        g.maps.event.addListenerOnce(map, "tilesloaded", enforceTilt);
        g.maps.event.addListener(map, "zoom_changed", () => {
          if (map.getZoom?.() >= 18) enforceTilt();
        });
      }

      if (showMarker) {
        marker = new g.maps.Marker({ position: { lat, lng }, map });
      }
    } catch (_) {
      // ignore; iframe fallback covers UI
    }

    return () => {
      if (marker) marker.setMap(null);
      // Maps API cleans up DOM nodes when container is removed
    };
  }, [
    scriptReady,
    apiKey,
    lat,
    lng,
    zoom,
    mapType,
    useOblique,
    heading,
    showMarker,
  ]);

  const iframe = (
    <iframe
      title="aerial-map"
      className="w-full h-full"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      src={`https://www.google.com/maps?q=${lat},${lng}&t=${
        mapType === "satellite" ? "k" : "h"
      }&z=${zoom}&hl=en&output=embed`}
    />
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
        </>
      ) : (
        iframe
      )}
    </div>
  );
};

export default AerialMap;
