"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { useMQTTClient } from "$/src/app/mqtt-provider";
import { SensorConnectionStatus } from "$/src/app/sensors/page";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import VibrationSensorChart from "./VibrationSensorChart";
import { toast } from "../hooks/use-toast";

type VibrationSensorDataType = {
  vibrationDetected: boolean;
};

type Props = {};

const VibrationSensorComponents = (props: Props) => {
  const { data } = useMQTTClient();

  const vibrationSensorData = data["raspi/sensors/sw420/data"];
  const vibrationSensorStatus: SensorConnectionStatus =
    data["raspi/sensors/sw420/status"];

  React.useEffect(() => {
    if (vibrationSensorData) {
      if (vibrationSensorData.vibrationDetected) {
        toast({
          variant: "destructive",
          title: "Vibration Detected",
          description:
            "Vibration detection ongoing. The duration is being monitored.",
        });
      }
    }
  }, [vibrationSensorData]);

  return (
    <div className="overflow-hidden">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div></div>
          <Badge
            variant={"secondary"}
            className="!mt-0 flex items-center gap-1.5 rounded-full py-[3px]"
          >
            <div className="relative flex items-center justify-center">
              {vibrationSensorStatus?.isActive ? (
                <div className="absolute h-3 w-3 animate-ping rounded-full bg-emerald-500/50 delay-1000 duration-1000" />
              ) : null}
              <div
                className={`relative h-2.5 w-2.5 rounded-full ${vibrationSensorStatus?.isActive ? "bg-emerald-500" : "bg-rose-500"} `}
              />
            </div>
            {vibrationSensorStatus?.isActive ? "Active" : "Disconnected"}
          </Badge>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-1 px-6">
            <span className="text-base font-medium tracking-tight text-muted-foreground">
              SW-420 Module
            </span>
            {vibrationSensorStatus?.isActive ? (
              vibrationSensorData?.vibrationDetected ? (
                <p className="animate-pulse text-2xl font-semibold uppercase tracking-tighter text-rose-500">
                  VIBRATION ONGOING...
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
          <VibrationSensorChart />
        </CardContent>
      </Card>
    </div>
  );
};

export default VibrationSensorComponents;
