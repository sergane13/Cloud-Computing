import React, { useState, useRef } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import countryToContinent from "../data/countries.json";
import { useLocationContext } from "../context/LocationContext";

const containerStyle: React.CSSProperties = {
    width: "100%",
    height: "60vh",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.2)"
};

const defaultCenter = {
    lat: 0,
    lng: 0
};

interface MarkerData {
    position: google.maps.LatLngLiteral;
    title: string;
}

const NewsMap: React.FC = () => {
    const [zoom, setZoom] = useState<number>(2);
    const [location, setLocation] = useState<google.maps.LatLngLiteral>(defaultCenter);
    const [markers, setMarkers] = useState<MarkerData[]>([]);
    const mapRef = useRef<google.maps.Map | null>(null);
    const debounceTimerRef = useRef<number | null>(null);

    const { city, region, country, continent, setLocation: setGlobalLocation } = useLocationContext();

    const fetchLocationDetails = async (lat: number, lng: number, zoomLevel: number) => {
        if (zoomLevel <= 3) {
            setGlobalLocation({ city: "", region: "", country: "Worldwide", continent: "" });
            return;
        }

        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
            );
            const data = await response.json();
            if (data.status === "OK") {
                const addressComponents = data.results[0]?.address_components || [];

                let cityName = "";
                let regionName = "";
                let countryName = "";
                let continentName = "";

                const countryComponent = addressComponents.find((comp: any) =>
                    comp.types.includes("country")
                );
                countryName = countryComponent?.long_name || "";

                if (zoomLevel >= 12) {
                    const cityComponent = addressComponents.find((comp: any) =>
                        comp.types.includes("locality")
                    );
                    cityName = cityComponent?.long_name || "";
                }

                if (zoomLevel >= 7) {
                    const regionComponent = addressComponents.find((comp: any) =>
                        comp.types.includes("administrative_area_level_1")
                    );
                    regionName = regionComponent?.long_name || "";
                }

                if (zoomLevel > 3 && zoomLevel <= 5) {
                    continentName = (countryToContinent as Record<string, string>)[countryName] || "";
                }

                setGlobalLocation({
                    city: cityName,
                    region: regionName,
                    country: countryName,
                    continent: continentName
                });
            }
        } catch (error) {
            console.error("Error fetching location info:", error);
        }
    };

    const onIdle = () => {
        if (!mapRef.current) return;
        const center = mapRef.current.getCenter();
        const newZoom = mapRef.current.getZoom();

        if (center && newZoom !== undefined) {
            const newLocation = { lat: center.lat(), lng: center.lng() };

            if (
                Math.abs(newLocation.lat - location.lat) > 0.001 ||
                Math.abs(newLocation.lng - location.lng) > 0.001
            ) {
                setZoom(newZoom);
                setLocation(newLocation);

                if (debounceTimerRef.current !== null) {
                    clearTimeout(debounceTimerRef.current);
                }

                debounceTimerRef.current = window.setTimeout(() => {
                    fetchLocationDetails(newLocation.lat, newLocation.lng, newZoom);
                }, 1000);
            }
        }
    };

    return (
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={location}
                zoom={zoom}
                onLoad={(map) => {
                    mapRef.current = map;
                }}
                onIdle={onIdle}
            >
                {markers.map((m, index) => (
                    <Marker key={index} position={m.position} title={m.title} />
                ))}
            </GoogleMap>
            <div style={{ marginTop: "1rem", textAlign: "center" }}>
                <strong>Location:</strong> {city ? `${city}, ` : ""}{region ? `${region}, ` : ""}{country} {continent && `(${continent})`}
            </div>
        </LoadScript>
    );
};

export default NewsMap;