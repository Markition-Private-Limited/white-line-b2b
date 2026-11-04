"use client";

import { T, useT } from "@/i18n/I18nProvider";
import React, { useState, useCallback, useRef, useEffect } from "react";
import { X, MapPin, Search, Navigation } from "lucide-react";
import { GoogleMap, useJsApiLoader, MarkerF, Autocomplete } from "@react-google-maps/api";
import { GOOGLE_MAPS_LIBRARIES, GOOGLE_MAPS_SCRIPT_ID, GOOGLE_MAPS_API_KEY } from "@/config/googleMaps";

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (location: { lat: number; lng: number; address: string }) => void;
  title?: string;
  initialPos?: { lat: number; lng: number } | null;
  initialAddress?: string;
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

// Clean Uber/Careem minimalist map styles
const mapStyles = [
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { elementType: "geometry", stylers: [{ color: "#f5f5f5" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#e0e0e0" }, { weight: 1 }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#d1d5db" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#616161" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#f5f5f5" }] }
];

export default function LocationPickerModal({
  isOpen,
  onClose,
  onSelectLocation,
  title = "Select Location",
  initialPos,
  initialAddress = ""
}: LocationPickerModalProps) {
  const { t } = useT();
  const { isLoaded, loadError } = useJsApiLoader({
    id: GOOGLE_MAPS_SCRIPT_ID,
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedPos, setSelectedPos] = useState<{ lat: number; lng: number } | null>(initialPos || null);
  const [address, setAddress] = useState<string>(initialAddress || "");
  const [searchInput, setSearchInput] = useState<string>("");
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // Default to Riyadh center if no position provided
  const defaultCenter = initialPos || { lat: 24.7136, lng: 46.6753 };

  useEffect(() => {
    if (isOpen) {
      if (initialPos) {
        setSelectedPos(initialPos);
      }
      if (initialAddress) {
        setAddress(initialAddress);
        setSearchInput(initialAddress);
      }
    }
  }, [isOpen, initialPos, initialAddress]);

  const onLoad = useCallback(function callback(mapInstance: google.maps.Map) {
    setMap(mapInstance);
    if (initialPos) {
      mapInstance.panTo(initialPos);
      mapInstance.setZoom(15);
    }
  }, [initialPos]);

  const onUnmount = useCallback(function callback() {
    setMap(null);
  }, []);

  const onAutocompleteLoad = (auto: google.maps.places.Autocomplete) => {
    autocompleteRef.current = auto;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const formatted = place.formatted_address || place.name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        
        setSelectedPos({ lat, lng });
        setAddress(formatted);
        setSearchInput(formatted);

        if (map) {
          map.panTo({ lat, lng });
          map.setZoom(16);
        }
      }
    }
  };

  const fetchAddress = (lat: number, lng: number) => {
    if (!window.google?.maps?.Geocoder) return;
    setIsLoadingAddress(true);
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      setIsLoadingAddress(false);
      if (status === window.google.maps.GeocoderStatus.OK && results && results[0]) {
        const foundAddress = results[0].formatted_address;
        setAddress(foundAddress);
        setSearchInput(foundAddress);
      } else {
        const fallback = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        setAddress(fallback);
        setSearchInput(fallback);
      }
    });
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setSelectedPos({ lat, lng });
      fetchAddress(lat, lng);
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setSelectedPos({ lat, lng });
          fetchAddress(lat, lng);
          if (map) {
            map.panTo({ lat, lng });
            map.setZoom(16);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 sm:p-6 transition-opacity overflow-y-auto" onClick={onClose}>
      <div 
        className="bg-white rounded-[24px] w-full max-w-[1200px] h-[82vh] max-h-[82vh] my-auto shadow-2xl overflow-hidden flex flex-col relative" 
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[18px] font-bold text-text-primary leading-tight">{title}</h2>
              <p className="text-[12px] text-gray-500 mt-0.5"><T>Search an address or click directly on the map</T></p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map Container with Search Overlay */}
        <div className="flex-1 min-h-0 relative w-full bg-gray-100 overflow-hidden">
          {/* Floating Search Bar */}
          {isLoaded && (
            <div className="absolute top-4 left-4 right-4 sm:left-6 sm:right-auto sm:w-[440px] z-20">
              <Autocomplete
                onLoad={onAutocompleteLoad}
                onPlaceChanged={onPlaceChanged}
              >
                <div className="relative flex items-center shadow-lg rounded-full bg-white border border-gray-200">
                  <Search className="absolute left-4 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder={t("Search address, landmark, or area...")}
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full h-[46px] pl-11 pr-10 bg-transparent rounded-full text-fs-13 text-text-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  {searchInput && (
                    <button
                      onClick={() => setSearchInput("")}
                      className="absolute right-3.5 p-1 rounded-full text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </Autocomplete>
            </div>
          )}

          {/* Current Location Quick Button */}
          <button
            onClick={handleUseCurrentLocation}
            title={t("Use Current Location")}
            className="absolute bottom-6 right-6 z-20 w-11 h-11 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center text-gray-700 hover:text-primary hover:bg-gray-50 transition-all"
          >
            <Navigation className="w-5 h-5" />
          </button>

          {!isLoaded ? (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500 bg-gray-50">
              <T>{loadError ? "Failed to load Google Maps" : "Loading Google Maps..."}</T>
            </div>
          ) : (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={selectedPos || defaultCenter}
              zoom={selectedPos ? 15 : 11}
              onLoad={onLoad}
              onUnmount={onUnmount}
              onClick={handleMapClick}
              options={{
                zoomControl: true,
                streetViewControl: false,
                mapTypeControl: false,
                fullscreenControl: false,
                styles: mapStyles
              }}
            >
              {selectedPos && (
                <MarkerF 
                  position={selectedPos}
                  animation={window.google?.maps?.Animation?.DROP}
                />
              )}
            </GoogleMap>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 sm:px-6 border-t border-gray-100 shrink-0 bg-white z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase block mb-1">
              <T>Selected Location &amp; Coordinates</T></span>
            <div className="text-fs-13 font-semibold text-text-primary truncate">
              <T>{isLoadingAddress ? (
                <span className="text-primary font-normal animate-pulse">Resolving address...</span>
              ) : (
                address || "Click on the map or search to select a location"
              )}</T>
            </div>
            {selectedPos && (
              <div className="text-[11px] text-gray-400 mt-0.5 font-mono">
                <T>Lat:</T> {selectedPos.lat.toFixed(6)}<T>, Lng:</T> {selectedPos.lng.toFixed(6)}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={onClose}
              className="px-6 py-2.5 rounded-full border border-gray-200 text-text-secondary font-medium text-fs-13 hover:bg-gray-50 transition-colors"
            >
              <T>Cancel</T></button>
            <button 
              onClick={() => {
                if (selectedPos) {
                  onSelectLocation({ ...selectedPos, address });
                  onClose();
                }
              }}
              disabled={!selectedPos || isLoadingAddress}
              className="px-7 py-2.5 rounded-full bg-primary text-white font-medium text-fs-13 hover:bg-primary/90 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <T>Confirm Location</T></button>
          </div>
        </div>
      </div>
    </div>
  );
}
