import React from "react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { Area, AreaChart, XAxis } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { fetchRaindropRecords } from "$/server/actions/actions";

type Props = {};

const RaindropSensorChart = (props: Props) => {
  const [formattedDate, setFormattedDate] = React.useState<string>("");

  const { data: dataRecords } = useQuery({
    queryKey: ["raindrop"],
    queryFn: async () => await fetchRaindropRecords(),
  });

  const chartConfig = {
    moisture: {
      label: "Rain Percentage",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  return (
    <div>
      <span className="px-6 text-xs italic tracking-tight text-muted-foreground">
        Last record on {formattedDate}
      </span>
      <ChartContainer config={chartConfig}>
        <AreaChart
          accessibilityLayer
          data={dataRecords}
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
            <linearGradient id="fillMoisture" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="var(--color-moisture)"
                stopOpacity={0.2}
              />
              <stop
                offset="75%"
                stopColor="var(--color-moisture)"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <Area
            dataKey="moisture"
            type="natural"
            fill="url(#fillMoisture)"
            fillOpacity={0.4}
            stroke="var(--color-moisture)"
            stackId="a"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
};

export default RaindropSensorChart;
