import React, { createContext, useContext, useState } from "react";

interface LocationData {
    city: string;
    region: string;
    country: string;
    continent: string;
}

interface LocationContextType extends LocationData {
    setLocation: (data: LocationData) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [city, setCity] = useState("");
    const [region, setRegion] = useState("");
    const [country, setCountry] = useState("Worldwide");
    const [continent, setContinent] = useState("");

    const setLocation = ({ city, region, country, continent }: LocationData) => {
        setCity(city);
        setRegion(region);
        setCountry(country);
        setContinent(continent);
    };

    return (
        <LocationContext.Provider value={{ city, region, country, continent, setLocation }}>
            {children}
        </LocationContext.Provider>
    );
};

export const useLocationContext = () => {
    const context = useContext(LocationContext);
    if (!context) {
        throw new Error("useLocationContext must be used within a LocationProvider");
    }
    return context;
};
