"use client";

import React, { useRef, useState } from "react";
import {
  Autocomplete,
  DirectionsRenderer,
  GoogleMap,
  Marker,
  useLoadScript,
} from "@react-google-maps/api";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Circle,
  EllipsisVertical,
  Loader2,
  Locate,
  MapPin,
} from "lucide-react";

type Props = {
  data: {
    lat: number;
    long: number;
  };
};

const containerStyle = {
  width: "100%",
  height: "400px",
};

type LocationType = {
  lat: number;
  lng: number;
};

const GoogleMapsComponent = ({ data }: Props) => {
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [directionsResponse, setDirectionsResponse] =
    useState<google.maps.DirectionsResult | null>(null);

  const [searchLngLat, setSearchLngLat] = useState<LocationType | null>({
    lat: data?.lat || 0,
    lng: data?.long || 0,
  });
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY! as string,
    libraries: ["places"],
  });

  if (!isLoaded)
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );

  const handlePlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place?.geometry && place?.geometry.location) {
        const lat = place?.geometry.location.lat();
        const lng = place?.geometry.location.lng();
        setSearchLngLat({ lat, lng });
      }
    }
  };

  const handleResetLocation = () => {
    setSearchLngLat({
      lat: data?.lat || 0,
      lng: data?.long || 0,
    });
    setOrigin("");
    setDestination("");
    setDirectionsResponse(null);
  };

  const handleLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const calculateRoute = () => {
    if (!origin || !destination) {
      alert("Please enter both origin and destination.");
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirectionsResponse(result);
        } else {
          console.error(`Error fetching directions ${status}`);
        }
      },
    );
  };

  return (
    <div className="relative">
      <div className="absolute right-4 top-4 z-10 flex flex-col gap-2 rounded-lg border bg-white p-4">
        <span className="text-xs font-medium text-muted-foreground">
          Get Custom Direction
        </span>
        <div className="flex flex-row items-center gap-2">
          <div className="flex flex-col items-center gap-1">
            <Circle className="h-3 w-3 text-muted-foreground" />
            <EllipsisVertical className="h-4 w-4 text-muted-foreground" />
            <MapPin className="h-4 w-4 text-rose-500" />
          </div>
          <div className="flex flex-col gap-2">
            <Autocomplete
              onLoad={handleLoad}
              onPlaceChanged={handlePlaceChanged}
              options={{ fields: ["address_components", "geometry", "name"] }}
            >
              <Input
                type="text"
                placeholder="Choose start location"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
              />
            </Autocomplete>
            <Autocomplete
              onLoad={handleLoad}
              onPlaceChanged={handlePlaceChanged}
              options={{ fields: ["address_components", "geometry", "name"] }}
            >
              <Input
                size={4}
                type="text"
                placeholder="Choose destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </Autocomplete>
          </div>
        </div>
        <Button
          onClick={calculateRoute}
          size={"sm"}
          disabled={!(destination.length > 0 && origin.length > 0)}
        >
          Get Directions
        </Button>
      </div>
      <div className="absolute bottom-4 right-4 z-10">
        <Button size={"icon"} variant={"outline"} onClick={handleResetLocation}>
          <Locate className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
      <GoogleMap
        options={{ fullscreenControl: false, disableDefaultUI: true }}
        mapContainerStyle={containerStyle}
        center={searchLngLat || { lat: data?.lat, lng: data?.long }}
        zoom={10}
      >
        {directionsResponse && (
          <DirectionsRenderer directions={directionsResponse} />
        )}
        <Marker
          position={searchLngLat || { lat: data?.lat, lng: data?.long }}
        />
      </GoogleMap>
    </div>
  );
};

export default GoogleMapsComponent;
