import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { useMQTTClient } from "$/src/app/mqtt-provider";
import { SensorConnectionStatus } from "$/src/app/sensors/page";
import { Skeleton } from "../ui/skeleton";
import RaindropSensorChart from "./RaindropSensorChart";

type RaindropSensorDataType = {
  rainDetected: boolean;
  moistureLevel: number;
};

type Props = {};

const RaindropSensorComponent = (props: Props) => {
  const { data } = useMQTTClient();

  const raindropSensorStatus: SensorConnectionStatus =
    data["raspi/sensor/raindrop/status"];
  const raindropSensorData: RaindropSensorDataType =
    data["raspi/sensor/raindrop/data"];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div></div>
        <Badge
          variant={"secondary"}
          className="!mt-0 flex items-center gap-1.5 rounded-full py-[3px]"
        >
          <div className="relative flex items-center justify-center">
            {raindropSensorStatus?.isActive ? (
              <div className="absolute h-3 w-3 animate-ping rounded-full bg-emerald-500/50 delay-1000 duration-1000" />
            ) : null}
            <div
              className={`relative h-2.5 w-2.5 rounded-full ${raindropSensorStatus?.isActive ? "bg-emerald-500" : "bg-rose-500"} `}
            />
          </div>
          {raindropSensorStatus?.isActive ? "Active" : "Disconnected"}
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1 px-6">
          <div className="text-base font-medium tracking-tight text-muted-foreground">
            Raindrop Module
          </div>
          {raindropSensorStatus?.isActive ? (
            raindropSensorData?.rainDetected ? (
              <p className="animate-pulse text-2xl font-semibold uppercase tracking-tighter text-rose-500">
                RAIN DETECTED
              </p>
            ) : (
              <p className="text-3xl font-semibold uppercase tracking-tighter text-amber-500">
                SENSOR IDLE
              </p>
            )
          ) : (
            <Skeleton className="h-12 w-1/2 rounded-md" />
          )}
        </div>
        <RaindropSensorChart />
      </CardContent>
    </Card>
  );
};

export default RaindropSensorComponent;
