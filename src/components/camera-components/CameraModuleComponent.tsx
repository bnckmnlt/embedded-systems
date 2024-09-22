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
  CircleCheck,
  CloudUpload,
  VideoIcon,
  XIcon,
} from "lucide-react";
import CameraModuleGraph from "./camera-module-graph";
import { DataTableComponent } from "./data-table-captures";
import { Button } from "../ui/button";
import { fetchImagesTable } from "$/server/actions/actions";

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
            <Button
              variant={"outline"}
              size={"icon"}
              onClick={() => setSwitched(!switched)}
            >
              <ArrowRightLeftIcon className="h-4 w-4" />
            </Button>
          </div>
          {!switched ? (
            <div className="grid items-center gap-4 md:grid-cols-2">
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
