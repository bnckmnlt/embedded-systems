import { useMQTTClient } from "$/src/app/mqtt-provider";
import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { SensorConnectionStatus } from "$/src/app/sensors/page";

type GasSensorDataType = {
  gasDetected: boolean;
};

type Props = {};

export default function GasSensorComponent(props: Props) {
  const { data } = useMQTTClient();

  const gasSensorData: GasSensorDataType = data["raspi/sensors/mqt/data"];
  const gasSensorStatus: SensorConnectionStatus =
    data["raspi/sensors/mqt/status"];

  return (
    <div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div></div>
          <Badge
            variant={"secondary"}
            className="!mt-0 flex items-center gap-1.5 rounded-full py-[3px]"
          >
            <div className="relative flex items-center justify-center">
              {gasSensorStatus?.isActive ? (
                <div className="absolute h-3 w-3 animate-ping rounded-full bg-emerald-500/50 delay-1000 duration-1000" />
              ) : null}
              <div
                className={`relative h-2.5 w-2.5 rounded-full ${gasSensorStatus?.isActive ? "bg-emerald-500" : "bg-rose-500"} `}
              />
            </div>
            {gasSensorStatus?.isActive ? "Active" : "Disconnected"}
          </Badge>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </div>
  );
}
