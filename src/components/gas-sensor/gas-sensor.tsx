import { useMQTTClient } from "$/src/app/mqtt-provider";
import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { SensorConnectionStatus } from "$/src/app/sensors/page";
import { Skeleton } from "../ui/skeleton";
import GasSensorChart from "./GasSensorChart";
import GasIndicator from "./gas-indicator";
import { toast } from "../hooks/use-toast";

const keyList = ["co", "h2", "ch4", "lpg", "propane", "alcohol", "smoke"];

type GasSensorDataType = {
  gasDetected: boolean;
  data: {
    co: number;
    h2: number;
    ch4: number;
    lpg: number;
    propane: number;
    alcohol: number;
    smoke: number;
  };
};

type Props = {};

export default function GasSensorComponent(props: Props) {
  const { data } = useMQTTClient();
  const [isActive, setIsActive] = React.useState<boolean>(false);

  const gasSensorData: GasSensorDataType = data["raspi/sensors/mq2/data"];
  const gasSensorStatus: SensorConnectionStatus =
    data["raspi/sensors/mq2/status"];

  React.useEffect(() => {
    if (gasSensorData) {
      if (gasSensorData?.gasDetected && !isActive) {
        setIsActive(true);
        toast({
          variant: "destructive",
          title: "Smoke Detected",
          description: "Smoke has been detected within the area.",
        });
      } else if (gasSensorData?.gasDetected == false) {
        setIsActive(false);
      }
    }
  }, [gasSensorData]);

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
        <CardContent className="p-0">
          <div className="space-y-1 px-6">
            <span className="font-medium tracking-tight text-muted-foreground">
              MQ2 Status
            </span>
            {gasSensorStatus?.isActive ? (
              gasSensorData?.gasDetected ? (
                <p className="text-3xl font-semibold uppercase tracking-tighter text-rose-500">
                  GAS DETECTED
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
          <div className="space-y-2 px-6 pb-4 pt-2">
            <span className="font-medium tracking-tight text-muted-foreground">
              Gas Concentrations
            </span>
            <div className="flex w-full flex-col justify-center gap-1">
              {keyList.map((key) => (
                <GasIndicator
                  key={key} // Ensure unique key for each GasIndicator
                  label={key}
                  value={gasSensorData?.data?.[key]} // Access the value dynamically
                />
              ))}
            </div>
          </div>
          {/* <GasSensorChart /> */}
        </CardContent>
      </Card>
    </div>
  );
}
