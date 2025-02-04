'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon issue in Next.js
const DefaultIcon = L.icon({
  iconUrl: '/images/marker-icon.png',
  iconRetinaUrl: '/images/marker-icon-2x.png',
  shadowUrl: '/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function Map() {
  const position: [number, number] = [47.4817101, 8.2110072]; // FHNW Campus coordinates

  return (
    <MapContainer 
      center={position} 
      zoom={17} 
      scrollWheelZoom={false}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          <div className="p-2">
            <h3 className="font-semibold">FHNW Campus Brugg-Windisch</h3>
            <p className="text-sm text-gray-600">Bahnhofstrasse 6, 5210 Windisch</p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
} 