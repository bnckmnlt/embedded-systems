import { fetchVibrationRecords } from "$/server/actions/actions";
import { useQuery } from "@tanstack/react-query";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { Area, AreaChart, XAxis } from "recharts";
import React from "react";
import { formatLastRecordDate } from "$/src/lib/utils";

export interface Vibration {
  id: number;
  duration: number;
  createdAt: string;
}

type Props = {};

const VibrationSensorChart = (props: Props) => {
  const [formattedDate, setformattedDate] = React.useState<string>("");

  const { data: dataRecords } = useQuery({
    queryKey: ["vibration"],
    queryFn: async () => await fetchVibrationRecords(),
  });

  const chartConfig = {
    duration: {
      label: "Vibration Duration",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  React.useEffect(() => {
    if (dataRecords) {
      let formatDate = formatLastRecordDate(dataRecords[0].createdAt as string);

      setformattedDate(formatDate);
    }
  }, [dataRecords]);

  return (
    <div>
      <span className="px-6 text-xs italic tracking-tight text-muted-foreground">
        Last record on {formattedDate}
      </span>
      <div className="pt-12">
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
              <linearGradient id="fillDuration" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--color-duration)"
                  stopOpacity={0.2}
                />
                <stop
                  offset="75%"
                  stopColor="var(--color-duration)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="duration"
              type="natural"
              fill="url(#fillDuration)"
              fillOpacity={0.4}
              stroke="var(--color-duration)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  );
};

export default VibrationSensorChart;
