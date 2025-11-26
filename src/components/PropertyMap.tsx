import React from "react";

type PropertyMapProps = {
  latitude: number;
  longitude: number;
  zoom?: number;
  className?: string;
  height?: string;
  title?: string;
};

/**
 * PropertyMap - A reusable Google Maps embed component
 * 
 * @param latitude - Latitude coordinate of the property
 * @param longitude - Longitude coordinate of the property
 * @param zoom - Map zoom level (default: 15)
 * @param className - Additional CSS classes for the container
 * @param height - Height of the map (default: "h-64")
 * @param title - Title for the iframe (default: "Property map")
 */
const PropertyMap: React.FC<PropertyMapProps> = ({
  latitude,
  longitude,
  zoom = 15,
  className = "",
  height = "h-64",
  title = "Property map",
}) => {
  // Generate Google Maps embed URL with the provided coordinates
  const mapUrl = `https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15756.0!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f${zoom}.0!5e0!3m2!1sen!2sng!4v${Date.now()}`;

  return (
    <div className={`overflow-hidden rounded-2xl border border-gray-200 bg-[#F7FCFB] ${className}`}>
      <iframe
        title={title}
        className={`w-full border-0 ${height}`}
        loading="lazy"
        src={mapUrl}
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
};

export default PropertyMap;

