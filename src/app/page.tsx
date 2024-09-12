"use client";

import React from "react";
import { useToast } from "@/components/hooks/use-toast";
import { useMQTT } from "@/components/hooks/useMQTT";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Microchip } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { useMQTTClient } from "./mqtt-provider";

const topics = [
  "raspi/board/data",
  "raspi/board/status",
  "raspi/sensors/dht11/status",
  "raspi/sensors/dht11/data",
];

interface RaspiBoardStatus {
  isActive: boolean;
}

interface RaspiBoardData {
  uptime: {
    value: number;
    unit: string;
  };
  temp: {
    value: number;
    unit: string;
  };
  power: {
    value: number;
    unit: string;
  };
}

export default function Home() {
  const [isBuzzerOn, setIsBuzzerOn] = React.useState<boolean>(false);
  const { toast } = useToast();
  const { connectionStatus, data } = useMQTTClient();

  const raspiStatus: RaspiBoardStatus = data["raspi/board/status"];
  const raspiData: RaspiBoardData = data["raspi/board/data"];

  React.useEffect(() => {
    if (isBuzzerOn) {
      toast({
        variant: "destructive",
        title: "High Temperature Alert",
        description: `Temperature is over 38°C. Stay cool, drink water, and avoid the sun.`,
      });
    }
  }, [isBuzzerOn, toast]);

  return (
    <div className="flex flex-col">
      <div className="space-y-3">
        <h1 className="text-lg font-semibold">Devices</h1>
        <BoardComponent status={raspiStatus} data={raspiData} />
      </div>
    </div>
  );
}

interface BoardComponentProps {
  data: RaspiBoardData;
  status: RaspiBoardStatus;
}

function BoardComponent({ data, status }: BoardComponentProps) {
  return (
    <div className="mt-4 flex flex-row items-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <p>Raspberry Pi</p>
            <Badge
              variant={"secondary"}
              className="!mt-0 flex items-center gap-1.5 rounded-full py-[3px]"
            >
              <div className="relative flex items-center justify-center">
                {status?.isActive ? (
                  <div className="absolute h-3 w-3 animate-ping rounded-full bg-emerald-500/50 delay-1000 duration-1000" />
                ) : null}
                <div
                  className={`relative h-2.5 w-2.5 rounded-full ${status?.isActive ? "bg-emerald-500" : "bg-rose-500"} `}
                />
              </div>
              {status?.isActive ? "Active" : "Disconnected"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <Image
            src={"/raspi-board.png"}
            width={400}
            height={100}
            alt="Resource not found"
            className={`dark:text-white ${status?.isActive ? "" : "grayscale"}`}
          />
        </CardContent>
        <CardFooter className="flex flex-row border-t p-4">
          <div className="flex w-full items-center gap-2">
            <div className="grid flex-1 auto-rows-min gap-0.5">
              <div className="mb-0.5 text-xs text-muted-foreground">Uptime</div>
              <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                {data ? data.uptime.value : <Skeleton className="h-8 w-1/2" />}
                <span className="text-sm font-normal text-muted-foreground">
                  {data ? data.uptime.unit : <Skeleton className="h-8 w-1/2" />}
                </span>
              </div>
            </div>
            <Separator orientation="vertical" className="mx-2 h-10 w-px" />
            <div className="grid flex-1 auto-rows-min gap-0.5">
              <div className="mb-0.5 text-xs text-muted-foreground">
                Temperature
              </div>
              <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                {data ? data.temp.value : <Skeleton className="h-8 w-1/2" />}
                <span className="text-sm font-normal text-muted-foreground">
                  {data ? data.temp.unit : <Skeleton className="h-8 w-1/2" />}
                </span>
              </div>
            </div>
            <Separator orientation="vertical" className="mx-2 h-10 w-px" />
            <div className="grid flex-1 auto-rows-min gap-0.5">
              <div className="mb-0.5 text-xs text-muted-foreground">
                Power Usage
              </div>
              <div className="flex items-baseline gap-1 text-2xl font-bold tabular-nums leading-none">
                {data ? data.power.value : <Skeleton className="h-8 w-1/2" />}
                <span className="text-sm font-normal text-muted-foreground">
                  {data ? data.power.unit : <Skeleton className="h-8 w-1/2" />}
                </span>
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
