import React, { useState, useRef } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle: React.CSSProperties = {
    width: "100%",
    height: "80vh",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.2)"
};

const defaultCenter = {
    lat: 48.8566,
    lng: 2.3522
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

    const handleOnLoad = (map: google.maps.Map): void => {
        mapRef.current = map;

        map.addListener("idle", () => {
            const center = map.getCenter();
            const newZoom = map.getZoom();
            if (center && newZoom !== undefined) {
                const newLocation = { lat: center.lat(), lng: center.lng() };

                if (
                    newZoom !== zoom ||
                    newLocation.lat !== location.lat ||
                    newLocation.lng !== location.lng
                ) {
                    setZoom(newZoom);
                    setLocation(newLocation);
                }
            }
        });
    };

    return (
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={location}
                zoom={zoom}
                onLoad={handleOnLoad}
            >
                {markers.map((m, index) => (
                    <Marker key={index} position={m.position} title={m.title} />
                ))}
            </GoogleMap>
        </LoadScript>
    );
};

export default NewsMap;
