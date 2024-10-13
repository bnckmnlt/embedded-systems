import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import GoogleMapsComponent from "./GoogleMapsComponent";
import { SensorConnectionStatus } from "$/src/app/sensors/page";
import { useMQTTClient } from "$/src/app/mqtt-provider";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { ArrowLeftRight } from "lucide-react";
import { DataTableComponent } from "./data-table-maps";
import { columns } from "./columns-maps";
import { useQuery } from "@tanstack/react-query";
import { fetchLocationRecords } from "$/server/actions/actions";

type GpsSensorDataType = {
  lat: 0.0;
  long: 0.0;
};

type Props = {};

const GpsSensor = (props: Props) => {
  const [currentAddress, setCurrentAddress] = React.useState("");
  const [mainEnabled, setMainEnabled] = React.useState(true);

  const { data } = useMQTTClient();

  const gpsSensorData: GpsSensorDataType = data["raspi/sensors/gps/data"];
  const gpsSensorStatus: SensorConnectionStatus =
    data["raspi/sensors/gps/status"];

  React.useEffect(() => {
    if (gpsSensorData) {
      getGeocodedAddress(gpsSensorData?.lat, gpsSensorData?.long);
    }
  }, [gpsSensorData]);

  const getGeocodedAddress = (lat: number, lng: number) => {
    const geocoder = new window.google.maps.Geocoder();

    const location = { lat, lng };

    geocoder.geocode(
      { location },
      (
        results: google.maps.GeocoderResult[] | null,
        status: google.maps.GeocoderStatus,
      ) => {
        if (status === "OK" && results && results[0]) {
          setCurrentAddress(results[0].formatted_address);
        } else {
          console.error(
            "Geocode was not successful for the following reason: " + status,
          );
        }
      },
    );
  };

  const { data: dataRecords, isLoading } = useQuery({
    queryKey: ["gps"],
    queryFn: async () => await fetchLocationRecords(),
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <span className="text-sm font-medium leading-none tracking-tight">
            NEO6M GPS Module
          </span>
        </div>
        <div className="flex flex-row gap-1">
          <Button
            variant={"link"}
            className="p-0!"
            onClick={() => setMainEnabled(!mainEnabled)}
          >
            <ArrowLeftRight className="h-3 w-3" />
          </Button>
          <Badge
            variant={"secondary"}
            className="!mt-0 flex items-center gap-1.5 rounded-full py-[3px]"
          >
            <div className="relative flex items-center justify-center">
              {gpsSensorStatus?.isActive ? (
                <div className="absolute h-3 w-3 animate-ping rounded-full bg-emerald-500/50 delay-1000 duration-1000" />
              ) : null}
              <div
                className={`relative h-2.5 w-2.5 rounded-full ${gpsSensorStatus?.isActive ? "bg-emerald-500" : "bg-rose-500"} `}
              />
            </div>
            {gpsSensorStatus?.isActive ? "Active" : "Disconnected"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {mainEnabled ? (
          <div>
            <div className="flex flex-col items-stretch space-y-0 border-y border-b p-0 md:flex-row">
              <div className="flex justify-center">
                <div className="flex flex-1 flex-col justify-center px-6 py-5">
                  <span className="text-xs text-muted-foreground">
                    Latitude
                  </span>
                  <span className="truncate text-lg font-bold leading-none sm:text-3xl">
                    {gpsSensorStatus?.isActive ? (
                      gpsSensorData?.lat ? (
                        gpsSensorData?.lat
                      ) : (
                        <p className="text-2xl font-semibold uppercase tracking-tighter text-amber-500">
                          Connecting...
                        </p>
                      )
                    ) : (
                      <Skeleton className="h-12 w-full rounded-md" />
                    )}
                  </span>
                </div>
                <div className="flex flex-1 flex-col justify-center border-x px-6 py-5">
                  <span className="text-xs text-muted-foreground">
                    Longitude
                  </span>
                  <span className="truncate text-lg font-bold leading-none sm:text-3xl">
                    {gpsSensorStatus?.isActive ? (
                      gpsSensorData?.long ? (
                        gpsSensorData?.long
                      ) : (
                        <p className="text-2xl font-semibold uppercase tracking-tighter text-amber-500">
                          Connecting...
                        </p>
                      )
                    ) : (
                      <Skeleton className="h-12 w-full rounded-md" />
                    )}
                  </span>
                </div>
                <div className="flex-3 flex flex-col px-6 py-5">
                  <span className="text-nowrap text-xs text-muted-foreground">
                    Current Location
                  </span>
                  {gpsSensorStatus?.isActive ? (
                    currentAddress.length > 0 ? (
                      <div className="font-medium leading-snug tracking-tight">
                        {currentAddress}
                      </div>
                    ) : (
                      <div className="text-2xl font-semibold uppercase tracking-tighter text-amber-500">
                        Connecting...
                      </div>
                    )
                  ) : (
                    <Skeleton className="h-12 w-full rounded-md" />
                  )}
                </div>
              </div>
            </div>
            <div>
              <GoogleMapsComponent data={gpsSensorData} />
            </div>
          </div>
        ) : (
          <div>
            {dataRecords && (
              <DataTableComponent data={dataRecords} columns={columns} />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GpsSensor;
