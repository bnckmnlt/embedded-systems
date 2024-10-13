import React from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { useMQTTClient } from "$/src/app/mqtt-provider";
import { SensorConnectionStatus } from "$/src/app/sensors/page";
import { Skeleton } from "../ui/skeleton";
import RaindropSensorChart from "./RaindropSensorChart";
import { toast } from "../hooks/use-toast";
import Lottie from "lottie-react";
import moderateAnimation from "$/public/lottiefiles/moderate.json";
import intenseAnimation from "$/public/lottiefiles/intense.json";
import norainAnimation from "$/public/lottiefiles/no-rain.json";
import lightAnimation from "$/public/lottiefiles/light.json";
import RaindropModule from "./color-change";
import MoistureChange from "./moisture-change";

type RaindropSensorDataType = {
  rainDetected: boolean;
  moistureLevel: number;
  voltageValue: number;
};

type Props = {};

const animationList = [
  {
    id: 1,
    animation: norainAnimation,
  },
  {
    id: 2,
    animation: lightAnimation,
  },
  {
    id: 3,
    animation: moderateAnimation,
  },
  {
    id: 4,
    animation: intenseAnimation,
  },
];

const RaindropSensorComponent = (props: Props) => {
  const [moisture, setMoisture] = React.useState<number>(0);

  const getAnimation = (moisture: number) => {
    if (moisture > 75) return intenseAnimation;
    if (moisture > 50) return moderateAnimation;
    if (moisture > 25) return lightAnimation;
    if (moisture >= 0) return norainAnimation;
    return norainAnimation;
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: lightAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const [toastActive, setToastActive] = React.useState<boolean>(false);

  const { data } = useMQTTClient();

  const raindropSensorStatus: SensorConnectionStatus =
    data["raspi/sensors/raindrop/status"];
  const raindropSensorData: RaindropSensorDataType =
    data["raspi/sensors/raindrop/data"];

  React.useEffect(() => {
    if (raindropSensorData) {
      if (raindropSensorData?.rainDetected && !toastActive) {
        setToastActive(true);
        toast({
          variant: "destructive",
          title: "Rain Detected",
          description: "Rain detected. The duration is being monitored.",
        });
      } else if (raindropSensorData?.rainDetected == false) {
        setToastActive(false);
      }
    }
  }, [raindropSensorData]);

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
      <CardContent className="space-y-2 p-0">
        <div className="flex flex-row items-center justify-between pr-6">
          <div className="space-y-2">
            <div className="space-y-1 px-6">
              <div className="text-base font-medium tracking-tight text-muted-foreground">
                Raindrop Module
              </div>
              {raindropSensorStatus?.isActive ? (
                raindropSensorData?.rainDetected ? (
                  <RaindropModule value={raindropSensorData?.moistureLevel} />
                ) : (
                  <p className="text-3xl font-semibold uppercase tracking-tighter text-amber-500">
                    SENSOR IDLE
                  </p>
                )
              ) : (
                <Skeleton className="h-12 w-1/2 rounded-md" />
              )}
            </div>
            <div className="space-y-1 px-6">
              <div className="text-base font-medium tracking-tight text-muted-foreground">
                Moisture Level
              </div>
              {raindropSensorStatus?.isActive ? (
                raindropSensorData?.rainDetected ? (
                  <div
                    className={`text-3xl font-semibold uppercase tracking-tighter ${raindropSensorData?.moistureLevel >= 70 ? "animate-pulse text-rose-500" : "text-sky-500"}`}
                  >
                    <MoistureChange value={moisture} />
                  </div>
                ) : (
                  <p className="text-3xl font-semibold uppercase tracking-tighter text-amber-500">
                    SENSOR IDLE
                  </p>
                )
              ) : (
                <Skeleton className="h-12 w-1/2 rounded-md" />
              )}
            </div>
            <div className="space-y-1 px-6">
              <div className="text-sm font-medium tracking-tight text-muted-foreground">
                Voltage Value
              </div>
              {raindropSensorStatus?.isActive ? (
                raindropSensorData?.rainDetected ? (
                  <p
                    className={`text-xl font-semibold uppercase tracking-tighter ${raindropSensorData?.moistureLevel >= 70 ? "animate-pulse text-rose-500" : "text-sky-500"}`}
                  >
                    {raindropSensorData?.voltageValue}V
                  </p>
                ) : (
                  <p className="text-xl font-semibold uppercase tracking-tighter text-amber-500">
                    0V
                  </p>
                )
              ) : (
                <Skeleton className="h-8 w-1/2 rounded-md" />
              )}
            </div>
          </div>
          <div>
            {/* <Lottie
              animationData={intenseAnimation}
              loop={true}
              height={154}
              width={154}
            /> */}
          </div>
        </div>
        <RaindropSensorChart />
      </CardContent>
    </Card>
  );
};

export default RaindropSensorComponent;
