"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Динамічно завантажуємо Leaflet компоненти тільки на клієнті
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

interface Property {
  id: string;
  title: string;
  coordinates: { lat: number; lng: number };
  price: number;
  currency: string;
  type: string;
}

interface OpenStreetMapProps {
  properties: Property[];
  center: { lat: number; lng: number };
  zoom?: number;
  className?: string;
  onMarkerClick?: (property: Property) => void;
}

export const OpenStreetMap: React.FC<OpenStreetMapProps> = ({
  properties,
  center,
  zoom = 13,
  className = "",
  onMarkerClick,
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Динамічно завантажуємо та налаштовуємо Leaflet
    if (typeof window !== "undefined") {
      import("leaflet").then((L) => {
        // Виправляємо іконки маркерів Leaflet
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        });
      });
    }
  }, []);

  // Показуємо плейсхолдер поки компонент не змонтований на клієнті
  if (!isClient) {
    return (
      <div className={`bg-gray-200 dark:bg-gray-700 flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-600 dark:text-gray-400">Завантаження карти...</p>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat("uk-UA").format(price) + " " + currency;
  };

  return (
    <MapContainer
      center={[center.lat, center.lng] as [number, number]}
      zoom={zoom}
      className={className}
      style={{ height: "100%", width: "100%", zIndex: 1 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {properties.map((property) => (
        <Marker
          key={property.id}
          position={[property.coordinates.lat, property.coordinates.lng] as [number, number]}
          eventHandlers={{
            click: () => {
              onMarkerClick?.(property);
            },
          }}
        >
          <Popup>
            <div className="p-2 min-w-[200px]">
              <h3 className="font-semibold text-sm mb-1 line-clamp-2">
                {property.title}
              </h3>
              <div className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                {formatPrice(property.price, property.currency)}
              </div>
              <div className="text-xs text-gray-600 mt-1 capitalize">
                {property.type}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};
