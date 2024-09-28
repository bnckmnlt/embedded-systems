"use client";

import React from "react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { formatLastRecordDate } from "$/src/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  fetchGasRecords,
  fetchSingleGasRecord,
} from "$/server/actions/actions";
import { useGetSingleGasRecord } from "$/src/data/get-gas-record";
import { Area, AreaChart, XAxis } from "recharts";

type Props = {};

const GasSensorChart = (props: Props) => {
  const [formattedDate, setformattedDate] = React.useState<string>("");

  const { data } = useQuery({
    queryKey: ["gas"],
    queryFn: async () => await fetchGasRecords(),
  });

  React.useEffect(() => {
    if (data) {
      let formatDate = formatLastRecordDate(data[0].createdAt as string);

      setformattedDate(formatDate);
    }
  }, [data]);

  const chartConfig = {
    intensity: {
      label: "Gas Intensity",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  return (
    <div>
      <span className="px-6 text-xs italic tracking-tight text-muted-foreground">
        Last record on {formattedDate}
      </span>
      <div className="pt-12">
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
              dataKey="createdAt"
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
              <linearGradient id="fillIntensity" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--color-intensity)"
                  stopOpacity={0.2}
                />
                <stop
                  offset="75%"
                  stopColor="var(--color-intensity)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="intensity"
              type="natural"
              fill="url(#fillIntensity)"
              fillOpacity={0.4}
              stroke="var(--color-intensity)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  );
};

export default GasSensorChart;
