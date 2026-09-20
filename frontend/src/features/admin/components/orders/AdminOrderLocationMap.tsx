"use client";

import {
  Circle,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface AdminOrderLocationMapProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  radiusKm?: number;
}

const customerIcon = L.divIcon({
  className: "freshfold-map-marker",
  html: `
    <div
      style="
        width: 34px;
        height: 34px;
        border-radius: 50% 50% 50% 0;
        background: #111827;
        border: 3px solid white;
        transform: rotate(-45deg);
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      "
    >
      <div
        style="
          width: 10px;
          height: 10px;
          background: white;
          border-radius: 50%;
        "
      ></div>
    </div>
  `,
  iconSize: [34, 34],
  iconAnchor: [17, 34],
  popupAnchor: [0, -34],
});

export default function AdminOrderLocationMap({
  latitude,
  longitude,
  zoom = 15,
  radiusKm = 5,
}: AdminOrderLocationMapProps) {
  const center: [number, number] = [latitude, longitude];

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom
        className="h-[400px] w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={center} icon={customerIcon}>
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">Customer Location</p>
              <p className="mt-1 text-gray-600">
                Latitude: {latitude.toFixed(6)}
              </p>
              <p className="text-gray-600">
                Longitude: {longitude.toFixed(6)}
              </p>
            </div>
          </Popup>
        </Marker>

        <Circle
          center={center}
          radius={radiusKm * 1000}
          pathOptions={{ fillOpacity: 0.08 }}
        />
      </MapContainer>

      <div className="flex flex-col gap-2 border-t border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            Customer pickup location
          </p>
          <p className="font-mono text-xs text-gray-500">
            {latitude.toFixed(6)}, {longitude.toFixed(6)}
          </p>
        </div>

        <div className="text-left sm:text-right">
          <p className="text-xs text-gray-500">
            Delivery-agent search radius
          </p>
          <p className="text-sm font-semibold text-gray-900">
            {radiusKm} km
          </p>
        </div>
      </div>
    </div>
  );
}
