"use client";

import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "./ui/card";
import { SensorConnectionStatus } from "@/app/sensors/page";
import { DataTableComponent } from "./data-table-captures";
import { Captures, columns } from "./columns-captures";
import { Badge } from "./ui/badge";

type CameraModuleComponentProps = {
  cameraModuleStatus: SensorConnectionStatus;
};

export default function CameraModuleComponent({
  cameraModuleStatus,
}: CameraModuleComponentProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["status", cameraModuleStatus],
    queryFn: async (): Promise<Captures[]> => {
      const response = await axios.get("/api/get-images");
      return response.data;
    },
  });

  return (
    !isLoading && (
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex w-full flex-row items-center justify-between">
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
            <div></div>
          </div>
        </CardHeader>
        <CardContent>
          {data && <DataTableComponent data={data} columns={columns} />}
        </CardContent>
      </Card>
    )
  );
}
