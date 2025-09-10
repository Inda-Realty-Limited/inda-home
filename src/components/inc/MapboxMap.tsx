"use client";
import React, { useEffect, useRef, useState } from "react";

type MapboxMapProps = {
  lat: number;
  lng: number;
  zoom?: number;
  mapStyle?: string;
  pitch?: number;
  bearing?: number;
  showMarker?: boolean;
  className?: string;
};

const MapboxMap: React.FC<MapboxMapProps> = ({
  lat,
  lng,
  zoom = 16,
  mapStyle = "mapbox://styles/mapbox/streets-v12",
  pitch = 45,
  bearing = -17.6,
  showMarker = true,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  useEffect(() => {
    if (!containerRef.current) return;
    if (!token) return;
    let map: any;
    let marker: any;
    (async () => {
      const mapboxgl = (await import("mapbox-gl")).default;
      mapboxgl.accessToken = token as string;
      map = new mapboxgl.Map({
        container: containerRef.current!,
        style: mapStyle,
        center: [lng, lat],
        zoom,
        pitch,
        bearing,
        antialias: true,
      });

      map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }));
      map.addControl(new mapboxgl.FullscreenControl());

      map.on("load", () => {
        setReady(true);
        // 3D buildings layer
        const layers = (map.getStyle() && map.getStyle().layers) || [];
        const labelLayerId = layers.find(
          (l: any) => l.type === "symbol" && l.layout && l.layout["text-field"]
        )?.id;
        map.addLayer(
          {
            id: "3d-buildings",
            source: "composite",
            "source-layer": "building",
            filter: ["==", "extrude", "true"],
            type: "fill-extrusion",
            minzoom: 15,
            paint: {
              "fill-extrusion-color": "#aaa",
              "fill-extrusion-height": ["get", "height"],
              "fill-extrusion-base": ["get", "min_height"],
              "fill-extrusion-opacity": 0.6,
            },
          },
          labelLayerId
        );
      });

      if (showMarker) {
        marker = new mapboxgl.Marker({ color: "#0A655E" })
          .setLngLat([lng, lat])
          .addTo(map);
      }
    })();

    return () => {
      try {
        marker?.remove?.();
      } catch {}
      try {
        map?.remove?.();
      } catch {}
    };
  }, [lat, lng, zoom, mapStyle, pitch, bearing, showMarker, token]);

  if (!token) {
    return (
      <div
        className={
          "w-full h-full grid place-items-center rounded-lg border border-dashed border-gray-300 bg-white " +
          (className || "")
        }
      >
        <div className="text-center text-sm text-gray-600 px-4">
          Mapbox token not set. Add NEXT_PUBLIC_MAPBOX_TOKEN to your env.
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={
        "w-full h-full rounded-lg overflow-hidden " + (className || "")
      }
      aria-busy={!ready}
    />
  );
};

export default MapboxMap;
