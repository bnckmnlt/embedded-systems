"use client";

import React, { useRef, useState } from "react";
import {
  Autocomplete,
  DirectionsRenderer,
  GoogleMap,
  Marker,
  Polyline, // Import Polyline
  useLoadScript,
} from "@react-google-maps/api";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Circle,
  Clock,
  EllipsisVertical,
  LandPlot,
  Loader2,
  Locate,
  MapPin,
} from "lucide-react";

type Props = {
  data: {
    lat: number;
    long: number;
  };
  areaName: string;
};

const containerStyle = {
  width: "100%",
  height: "748px",
};

type LocationType = {
  lat: number;
  lng: number;
};

const GoogleMapsComponent = ({ data, areaName }: Props) => {
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [directionsResponse, setDirectionsResponse] =
    useState<google.maps.DirectionsResult | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
  const [duration, setDuration] = useState<string | null>(null);
  const [polylinePath, setPolylinePath] = useState<LocationType[]>([]); // Store path for the trail

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
    setDistance(null);
    setDuration(null);
    setPolylinePath([]); // Reset the trail
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

          const leg = result.routes[0].legs[0];
          setDistance(leg.distance?.text || null);
          setDuration(leg.duration?.text || null);

          // Extract the polyline path from the directions result
          const polylinePoints = result.routes[0].overview_path.map(
            (point) => ({
              lat: point.lat(),
              lng: point.lng(),
            }),
          );
          setPolylinePath(polylinePoints); // Set the polyline path
        } else {
          console.error(`Error fetching directions ${status}`);
        }
      },
    );
  };

  return (
    <div className="relative h-auto">
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
      <div className="absolute bottom-4 left-4 z-10 h-auto w-96 space-y-2">
        <Button size={"icon"} variant={"outline"} onClick={handleResetLocation}>
          <Locate className="h-4 w-4 text-muted-foreground" />
        </Button>
        <div>
          <div className="flex flex-col gap-1 rounded-md bg-white px-6 py-5">
            <span className="font-medium tracking-tight text-muted-foreground">
              Location
            </span>
            <p className="text-3xl font-medium leading-none tracking-tight">
              {areaName}
            </p>
          </div>
        </div>
      </div>
      {distance && duration && (
        <div className="absolute bottom-4 left-4 z-10 rounded-md border bg-white/90 px-4 py-2">
          <div className="text-sm">
            <div className="flex flex-row items-center gap-1.5 text-muted-foreground">
              <LandPlot className="h-4 w-4" />
              <p className="leading-snug tracking-tight">
                Distance:{" "}
                <span className="font-medium text-amber-500">{distance}</span>
              </p>
            </div>
            <div className="flex flex-row items-center gap-1.5 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <p className="leading-snug tracking-tight">
                Estimated Time:{" "}
                <span className="font-medium text-sky-500">{duration}</span>
              </p>
            </div>
          </div>
        </div>
      )}
      <GoogleMap
        options={{}}
        mapContainerStyle={containerStyle}
        center={searchLngLat || { lat: data?.lat, lng: data?.long }}
        zoom={20}
      >
        {directionsResponse && (
          <DirectionsRenderer directions={directionsResponse} />
        )}

        {polylinePath.length > 0 && (
          <Polyline
            path={polylinePath}
            options={{
              strokeColor: "#FF0000",
              strokeOpacity: 0.8,
              strokeWeight: 5,
            }}
          />
        )}

        <Marker
          position={searchLngLat || { lat: data?.lat, lng: data?.long }}
        />
      </GoogleMap>
    </div>
  );
};

export default GoogleMapsComponent;
