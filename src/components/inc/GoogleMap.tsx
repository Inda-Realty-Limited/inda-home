import Script from "next/script";
import React, { useEffect, useRef, useState } from "react";

type GoogleMapProps = {
  lat: number;
  lng: number;
  zoom?: number;
  showMarker?: boolean;
  className?: string;
};

declare global {
  interface Window {
    google: any;
  }
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  lat,
  lng,
  zoom = 15,
  showMarker = true,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!apiKey || !scriptReady || !containerRef.current) return;

    let map: any;
    let marker: any;
    try {
      const g = window.google;
      map = new g.maps.Map(containerRef.current, {
        center: { lat, lng },
        zoom,
        mapTypeId: g.maps.MapTypeId.ROADMAP,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: true,
        gestureHandling: "greedy",
      });

      if (showMarker) {
        marker = new g.maps.Marker({ position: { lat, lng }, map });
      }
    } catch (_) {
      // iframe fallback covers the UI
    }

    return () => {
      if (marker) marker.setMap(null);
    };
  }, [scriptReady, apiKey, lat, lng, zoom, showMarker]);

  const iframe = (
    <iframe
      title="map"
      className="w-full h-full"
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      src={`https://www.google.com/maps?q=${lat},${lng}&z=${zoom}&hl=en&output=embed`}
    />
  );

  return (
    <div className={"w-full h-full " + (className || "")}>
      {apiKey ? (
        <>
          <Script
            src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}`}
            strategy="lazyOnload"
            onLoad={() => setScriptReady(true)}
          />
          <div ref={containerRef} className="w-full h-full rounded-lg overflow-hidden" />
        </>
      ) : (
        iframe
      )}
    </div>
  );
};

export default GoogleMap;
