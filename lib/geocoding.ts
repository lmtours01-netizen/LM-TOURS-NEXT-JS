/// <reference types="vite/client" />
export interface GeocodeSuggestion {
    description: string;
    lat: number;
    lng: number;
    source: 'mapbox' | 'nominatim' | 'photon';
}

export async function fetchAddressSuggestions(input: string): Promise<GeocodeSuggestion[]> {
    if (input.length < 3) {
        return [];
    }

    const mapboxKey = import.meta.env.VITE_MAPBOX_API_KEY;

    if (!mapboxKey) {
        console.error("CRITICAL: VITE_MAPBOX_API_KEY is missing from environment. Mapbox geocoding will not work.");
    } else {
        console.log("Mapbox Search v6: Fetching suggestions...");
        try {
            const PROXIMITY_JOBURG = "28.0473,-26.2041"; // Johannesburg center
            
            // Search v6 Forward API is the modern replacement for Geocoding v5
            // It is much better at finding POIs (hospitals, malls, etc.)
            const url = `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(input)}&access_token=${mapboxKey}&country=za&proximity=${PROXIMITY_JOBURG}&limit=8&types=poi,address,place&autocomplete=true`;
            
            const res = await fetch(url);
            
            if (!res.ok) {
                const errorData = await res.json();
                console.error("Mapbox Search v6 Error:", errorData);
                throw new Error(`Mapbox Search API v6 returned ${res.status}`);
            }

            const data = await res.json();
            if (data.features && data.features.length > 0) {
                console.log(`Mapbox Search v6 success: found ${data.features.length} results.`);
                return data.features.map((f: any) => {
                    // Search v6 has a rich properties object
                    const name = f.properties.name;
                    const address = f.properties.place_formatted;
                    const description = address ? `${name}, ${address}` : name;

                    return {
                        description: description,
                        lng: f.geometry.coordinates[0],
                        lat: f.geometry.coordinates[1],
                        source: 'mapbox'
                    };
                });
            }
            console.warn("Mapbox Search v6 returned no results for:", input);
        } catch (error) {
            console.error("Detailed Mapbox Search v6 failure:", error);
        }
    }

    console.warn("Falling back to alternative geocoders (Nominatim/Photon)...");
    try {
        const nominatimRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(input)}&countrycodes=za&format=json&addressdetails=1&limit=5&viewbox=27.2,-25.1,29.1,-26.9&bounded=1`, {
            headers: {
                'Accept-Language': 'en-US,en;q=0.9'
            }
        });
        
        if (nominatimRes.ok) {
            const data = await nominatimRes.json();
            if (data && data.length > 0) {
                 return data.map((item: any) => ({
                     description: item.display_name,
                     lng: parseFloat(item.lon),
                     lat: parseFloat(item.lat),
                     source: 'nominatim'
                 }));
            }
        }

        // Fallback to Photon
        const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(input)}&lat=-26.2041&lon=28.0473&limit=5&bbox=27.2,-26.9,29.1,-25.1`;
        const res = await fetch(photonUrl);
        if (res.ok) {
            const data = await res.json();
            return data.features.map((s: any) => {
                const props = s.properties;
                const addressParts = [props.name, props.street, props.city, props.state].filter(Boolean);
                return {
                    description: addressParts.join(', '),
                    lng: s.geometry.coordinates[0],
                    lat: s.geometry.coordinates[1],
                    source: 'photon'
                };
            });
        }
        
        return [];
    } catch (error) {
        console.error("Error fetching autocomplete suggestions:", error);
        return [];
    }
}
