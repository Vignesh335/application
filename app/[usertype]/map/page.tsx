"use client"
import AppLayout from "@/app/Components/Layout";
import L from "leaflet";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Dynamically import the map to avoid server-side rendering issues
const Map = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), {
    ssr: false,
});
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), {
    ssr: false,
});
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), {
    ssr: false,
});
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), {
    ssr: false,
});


export default function MapComponent() {
    const [mapLoaded, setMapLoaded] = useState(false);
    const [places, setPlaces] = useState([]);

    function getMapData() {
        fetch(`/api/map`)
            .then((response) => response.json())
            .then((data) => {
                if (data) {
                    setPlaces(data.map((row: any, index: any) => {
                        row.id = index
                        row.name = row.text
                        return {
                            ...row
                        }
                    }))
                }
            })
            .catch((error) => console.error('Error fetching subadmin data:', error));
    }

    useEffect(() => {
        getMapData()
        setMapLoaded(true);
    }, []);

    if (!mapLoaded) return <div>Loading Map...</div>;

    return (
        <AppLayout pathIndex={2} defaultpath={'/trustadmin'}>
            <Map center={[51.505, -0.09]} zoom={13} style={{ width: "100%", height: "500px" }}>
                <TileLayer
                    url="https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=Cc5OwwEIfY0lIuQYcR6q"
                    attribution='&copy; <a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
                />
                {places.map((place: any) => {
                    // Validate latitude and longitude
                    const isValidLatitude = place.lat >= -90 && place.lat <= 90;
                    const isValidLongitude = place.lon >= -180 && place.lon <= 180;

                    if (isValidLatitude && isValidLongitude) {
                        const customIcon = new L.Icon({
                            iconUrl: `http://localhost:3001/${place.icon}`,
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                            popupAnchor: [1, -34],
                            tooltipAnchor: [16, -28],
                            shadowSize: [41, 41]
                        });

                        return (
                            <Marker
                                key={place.id}
                                position={[place.lat, place.lon]}
                                icon={customIcon}
                            >
                                <Popup>{place.name}</Popup>
                            </Marker>
                        );
                    }

                    return null;
                })}
            </Map>
        </AppLayout>
    );
};
