'use client';

import React from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { DriverLocation } from '@/app/api/react-query/driverLocation';
import { MAP_CONFIG, generateMarkerIcon, getStatusColor } from './util';
import { MapPin, Car, Bike, Star, Phone, Mail } from 'lucide-react';

interface MapViewProps {
  drivers: DriverLocation[];
  selectedDriver: DriverLocation | null;
  onDriverSelect: (driver: DriverLocation | null) => void;
}

const MapView: React.FC<MapViewProps> = ({ drivers, selectedDriver, onDriverSelect }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places']
  });

  
  const getVehicleIcon = (vehicleType: string) => {
    switch (vehicleType) {
      case 'motorcycle':
      case 'bicycle':
        return <Bike size={16} />;
      case 'car':
        return <Car size={16} />;
      default:
        return <MapPin size={16} />;
    }
  };

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-red-600 dark:text-red-400 text-xl mb-4">Map Error</div>
          <p className="text-gray-600 dark:text-gray-400">Failed to load Google Maps: {loadError.message}</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={MAP_CONFIG.containerStyle}
      center={MAP_CONFIG.center}
      zoom={MAP_CONFIG.zoom}
      options={MAP_CONFIG.options}
    >
      {/* Test marker to verify map is working */}
      <Marker
        position={MAP_CONFIG.center}
        title="Test Marker - Map Center"
      />
      
      {drivers.map((driver: DriverLocation) => {
        console.log('Rendering marker for driver:', driver.name, 'at position:', driver.currentLocation);
        
        // Try to generate custom marker, fallback to default if it fails
        let markerIcon;
        try {
          markerIcon = {
            url: generateMarkerIcon(driver),
            scaledSize: new window.google.maps.Size(40, 40),
          };
        } catch (error) {
          console.error('Error generating marker icon for driver:', driver.name, error);
          // Use a simple colored circle as fallback
          markerIcon = {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" r="8" fill="${getStatusColor(driver.status)}" stroke="white" stroke-width="2"/>
              </svg>
            `)}`,
            scaledSize: new window.google.maps.Size(20, 20),
          };
        }
        
        return (
          <Marker
            key={driver.id}
            position={driver.currentLocation}
            onClick={() => onDriverSelect(driver)}
            icon={markerIcon}
          />
        );
      })}

      {selectedDriver && (
        <InfoWindow
          position={selectedDriver.currentLocation}
          onCloseClick={() => onDriverSelect(null)}
        >
          <div className="p-2 max-w-xs">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getStatusColor(selectedDriver.status) }}></div>
              <h3 className="font-semibold text-gray-900">{selectedDriver.name}</h3>
            </div>
            
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                {getVehicleIcon(selectedDriver.vehicleType)}
                <span className="capitalize">{selectedDriver.vehicleType}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Star size={14} className="text-yellow-500" />
                <span>{selectedDriver.rating} ({selectedDriver.totalDeliveries} deliveries)</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Phone size={14} />
                <span>{selectedDriver.phone}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Mail size={14} />
                <span>{selectedDriver.email}</span>
              </div>
            </div>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default MapView; 