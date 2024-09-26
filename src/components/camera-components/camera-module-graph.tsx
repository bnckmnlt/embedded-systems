"use client";

import React from "react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { Area, AreaChart, XAxis } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "../ui/skeleton";
import { fetchImages } from "$/server/actions/actions";

type Props = {};

type CapturesChartType = {
  date: string;
  time: string;
  count: number;
};

export default function CameraModuleGraph(props: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ["images_graph"],
    queryFn: async () => await fetchImages(),
  });

  const chartConfig = {
    captures: {
      label: "Captured Movements",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  if (isLoading) {
    return <Skeleton className="h-48 w-full" />;
  }

  return (
    data && (
      <ChartContainer config={chartConfig}>
        <AreaChart
          accessibilityLayer
          data={data}
          margin={{
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <XAxis
            hide
            dataKey="datetime"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={32}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="line" />}
            labelFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleTimeString("en-US", {
                day: "numeric",
                month: "long",
                hour: "numeric",
                minute: "numeric",
              });
            }}
          />  
          <defs>
            <linearGradient id="fillCaptures" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="var(--color-captures)"
                stopOpacity={0.2}
              />
              <stop
                offset="75%"
                stopColor="var(--color-captures)"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <Area
            dataKey="captures"
            type="natural"
            fill="url(#fillCaptures)"
            fillOpacity={0.4}
            stroke="var(--color-captures)"
            stackId="a"
          />
        </AreaChart>
      </ChartContainer>
    )
  );
}
