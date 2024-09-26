"use client";

import React from "react";
import axios from "axios";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { toast } from "../hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Captures, columns } from "./columns-captures";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { SensorConnectionStatus } from "@/app/sensors/page";
import {
  ArrowRightLeft,
  ArrowRightLeftIcon,
  Camera,
  CircleCheck,
  CloudUpload,
  VideoIcon,
  XIcon,
} from "lucide-react";
import CameraModuleGraph from "./camera-module-graph";
import { DataTableComponent } from "./data-table-captures";
import { Button } from "../ui/button";
import { fetchImagesTable } from "$/server/actions/actions";
import { useMQTTClient } from "$/src/app/mqtt-provider";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";

type CameraModuleComponentProps = {
  cameraModuleStatus: SensorConnectionStatus;
  cameraModuleData: {
    recording: boolean;
    sending: boolean;
    error: boolean;
    success: boolean;
  };
  pirModuleStatus: SensorConnectionStatus;
  pirModuleData: {
    objectDetected: boolean;
  };
};

export default function CameraModuleComponent({
  cameraModuleStatus,
  cameraModuleData,
  pirModuleStatus,
  pirModuleData,
}: CameraModuleComponentProps) {
  const [motionDetected, setMotionDetected] = React.useState<boolean>(false);
  const [switched, setSwitched] = React.useState<boolean>(false);
  const [lastData, setLastData] = React.useState<string | null>(null);
  const { clientRef } = useMQTTClient();
  const [cameraMode, setcameraMode] = React.useState<string>("video");

  const { data, isLoading } = useQuery({
    queryKey: ["images_table"],
    queryFn: async () => await fetchImagesTable(),
  });

  React.useEffect(() => {
    if (pirModuleData) {
      if (pirModuleData?.objectDetected && !motionDetected) {
        setMotionDetected(true);
        toast({
          variant: "destructive",
          title: "Motion Detected",
          description: "An object has been detected within the vicinity.",
        });
      } else if (!pirModuleData?.objectDetected && motionDetected) {
        setMotionDetected(false);
      }
    }
  }, [pirModuleData, motionDetected]);

  React.useEffect(() => {
    if (data) {
      let rawDate = data[0].date;
      const date = new Date(rawDate.replace(" ", "T"));

      // Array of month names
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      const month = monthNames[date.getMonth()];
      const day = date.getDate();
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");

      const formattedDate = `${month} ${day}, ${year} at ${hours}:${minutes}`;
      setLastData(formattedDate);
    }
  }, [data]);

  async function captureImage() {
    clientRef.current.publish(
      "raspi/camera/manual",
      Buffer.from(JSON.stringify({ capture: 1 })),
      { qos: 0 },
    );
  }

  function setCamera() {
    if (cameraMode == "camera") {
      setcameraMode("video");
      clientRef.current.publish(
        "raspi/camera/manual/mode",
        Buffer.from(JSON.stringify({ mode: 1 })),
        { qos: 0 },
      );
    } else {
      setcameraMode("camera");
      clientRef.current.publish(
        "raspi/camera/manual/mode",
        Buffer.from(JSON.stringify({ mode: 0 })),
        { qos: 0 },
      );
    }
  }

  return (
    !isLoading && (
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex w-full flex-row-reverse items-center justify-between">
            <Badge
              variant={"secondary"}
              className="!mt-0 flex items-center gap-1.5 rounded-full py-[3px]"
            >
              <div className="relative flex items-center justify-center">
                {cameraModuleStatus?.isActive ? (
                  <div className="absolute h-3 w-3 animate-ping rounded-full bg-emerald-500/50 delay-1000 duration-1000" />
                ) : null}
                <div
                  className={`relative h-2.5 w-2.5 rounded-full ${cameraModuleStatus?.isActive ? "bg-emerald-500" : "bg-rose-500"} `}
                />
              </div>
              {cameraModuleStatus?.isActive ? "Active" : "Disconnected"}
            </Badge>
            <div className="flex flex-row gap-2">
              <Button
                variant={"outline"}
                size={"icon"}
                onClick={() => setSwitched(!switched)}
              >
                <ArrowRightLeftIcon className="h-4 w-4" />
              </Button>
              <Button size={"icon"} variant={"outline"} onClick={captureImage}>
                <Camera className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-2 pl-1">
                <Switch id="airplane-mode" onCheckedChange={setCamera} />
                <Label
                  htmlFor="airplane-mode"
                  className="text-xs tracking-tight"
                >
                  Switch to Capture Mode
                </Label>
              </div>
            </div>
          </div>
          {!switched ? (
            <div className="md:grid-row-4 grid-flow- grid items-center gap-4">
              <div className="space-y-1">
                <div className="text-base font-medium tracking-tight text-muted-foreground">
                  Camera status
                </div>
                <div className="">
                  {cameraModuleStatus?.isActive ? (
                    cameraModuleData?.recording ? (
                      <div className="flex flex-row items-center gap-2">
                        <VideoIcon size={38} />
                        <p className="text-3xl font-semibold tracking-tight">
                          Recording...
                        </p>
                      </div>
                    ) : cameraModuleData?.sending ? (
                      <div className="flex flex-row items-center gap-2">
                        <CloudUpload size={38} />
                        <p className="text-3xl font-semibold tracking-tight">
                          Uploading...
                        </p>
                      </div>
                    ) : cameraModuleData?.error ? (
                      <div className="flex flex-row items-center gap-2 text-rose-500">
                        <XIcon size={38} />
                        <p className="text-3xl font-semibold tracking-tight">
                          Error: {cameraModuleData.error}
                        </p>
                      </div>
                    ) : cameraModuleData?.success ? (
                      <div className="flex flex-row items-center gap-2 text-emerald-500">
                        <CircleCheck size={32} />
                        <p className="text-3xl font-semibold tracking-tight">
                          SUCCESS
                        </p>
                      </div>
                    ) : (
                      <Skeleton className="h-12 w-1/2" />
                    )
                  ) : (
                    <Skeleton className="h-12 w-1/2" />
                  )}
                  <div className="mt-2 text-xs italic tracking-tight text-muted-foreground">
                    Last captured on <span>{lastData}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-base font-medium tracking-tight text-muted-foreground">
                  PIR Module
                </div>
                <p
                  className={`text-3xl font-semibold tracking-tight ${pirModuleData?.objectDetected ? "text-rose-500" : "text-amber-500"}`}
                >
                  {pirModuleStatus?.isActive ? (
                    pirModuleData?.objectDetected ? (
                      "Motion Detected"
                    ) : (
                      "IDLE STATE"
                    )
                  ) : (
                    <Skeleton className="h-12 w-1/2" />
                  )}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-1 pt-4">
              <CardTitle>Captured media records</CardTitle>
              <CardDescription>
                Shows the list of media recorded for every motion being
                monitored
              </CardDescription>
            </div>
          )}
        </CardHeader>
        <CardContent className={`p-0 ${!switched ? "pt-8" : ""}`}>
          {!switched ? (
            <CameraModuleGraph />
          ) : (
            data && <DataTableComponent data={data} columns={columns} />
          )}
        </CardContent>
      </Card>
    )
  );
}
