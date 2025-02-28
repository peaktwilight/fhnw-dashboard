'use client';

import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

// Fix for default marker icons in Leaflet with Next.js
const icon = L.icon({
  iconUrl: '/images/marker-icon.png',
  iconRetinaUrl: '/images/marker-icon-2x.png',
  shadowUrl: '/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// FHNW Campus Brugg-Windisch coordinates
const position: [number, number] = [47.481221, 8.212712];

// Replace the dynamic import and Map component with the actual implementation
const MapComponent = () => {
  return (
    <MapContainer
      center={position}
      zoom={16}
      scrollWheelZoom={false}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} icon={icon}>
        <Popup>
          FHNW Campus Brugg-Windisch
        </Popup>
      </Marker>
    </MapContainer>
  );
};

// Update the MapWidget component to use the inline MapComponent
export default function MapWidget() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 backdrop-blur-sm"
    >
      <div className="w-full h-[300px] rounded-lg overflow-hidden">
        <MapComponent />
      </div>
    </motion.div>
  );
} 