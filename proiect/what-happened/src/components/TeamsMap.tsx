import React, { useState, useRef, useEffect } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import countryToContinent from "../data/countries.json";
import { useLocationContext } from "../context/LocationContext";
import { TeamItem } from "./TeamLists";
import { MarkerClusterer } from "@googlemaps/markerclusterer";

interface AddressComponent {
    long_name: string;
    short_name: string;
    types: string[];
}

interface TeamsMapProps {
    items: TeamItem[];
    onClusterTeamsSelect: (teams: TeamItem[]) => void;
}

const containerStyle: React.CSSProperties = {
    width: "100%",
    height: "60vh",
    position: "relative",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.2)"
};

const defaultCenter = {
    lat: 0,
    lng: 0
};

const TeamsMap: React.FC<TeamsMapProps> = ({ items, onClusterTeamsSelect}) => {
    const [zoom, setZoom] = useState<number>(2);
    const [location, setLocation] = useState<google.maps.LatLngLiteral>(defaultCenter);
    const mapRef = useRef<google.maps.Map | null>(null);
    const debounceTimerRef = useRef<number | null>(null);

    const { setLocation: setGlobalLocation } = useLocationContext();

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
                const addressComponents: AddressComponent[] = data.results[0]?.address_components || [];

                let cityName = "";
                let regionName = "";
                let countryName = "";
                let continentName = "";

                const countryComponent = addressComponents.find((comp) =>
                    comp.types.includes("country")
                );
                countryName = countryComponent?.long_name || "";

                if (zoomLevel >= 12) {
                    const cityComponent = addressComponents.find((comp) =>
                        comp.types.includes("locality")
                    );
                    cityName = cityComponent?.long_name || "";
                }

                if (zoomLevel >= 7) {
                    const regionComponent = addressComponents.find((comp) =>
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

    const markerToTeam = useRef(new Map<google.maps.Marker, TeamItem>());
    const markersRef = useRef<google.maps.Marker[]>([]);

    useEffect(() => {
        if (!mapRef.current || !items.length) return;

        markerToTeam.current.clear();
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];

        const markers: google.maps.Marker[] = items.map(team => {
            const marker = new google.maps.Marker({
                position: team.position,
                title: team.team.name,
                icon: {
                url: team.team.logo,
                scaledSize: new google.maps.Size(40, 40),
                },
            });

            markerToTeam.current.set(marker, team);
            markersRef.current.push(marker);
            return marker;
        });

        const clusterer = new MarkerClusterer({
            map: mapRef.current!,
            markers,
        });
        
        const map = mapRef.current;
        const listener = map.addListener('idle', () => {
            const bounds = map.getBounds();
            if (!bounds) return;

            const visibleTeams = markersRef.current
                .filter(marker => bounds.contains(marker.getPosition()!))
                .map(marker => markerToTeam.current.get(marker))
                .filter((t): t is TeamItem => t !== undefined);

            onClusterTeamsSelect(visibleTeams);
        });

        return () => {
            google.maps.event.removeListener(listener);
            clusterer.clearMarkers();
            markersRef.current.forEach(marker => marker.setMap(null));
        };
    }, [items, onClusterTeamsSelect]);


    return (
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <div style={containerStyle}>
                <GoogleMap
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    center={location}
                    zoom={zoom}
                    onLoad={(map) => {
                        mapRef.current = map;
                    }}
                    onIdle={onIdle}
                >
                </GoogleMap>

                <div style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -100%)",
                    zIndex: 1,
                    pointerEvents: "none",
                    fontSize: "30px"
                }}>
                    📍
                </div>
            </div>
        </LoadScript>
    );
};

export default TeamsMap;
