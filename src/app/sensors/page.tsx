"use client";

import React, { useEffect } from "react";
import {
  Bell,
  ServerCrash,
  Settings,
  Thermometer,
  TrendingUp,
  WindIcon,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Label,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useMQTTClient } from "../mqtt-provider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/hooks/use-toast";

interface SensorConnectionStatus {
  isActive: boolean;
}

export default function Sensors() {
  const { connectionStatus, data } = useMQTTClient();

  const dhtStatus: SensorConnectionStatus = data["raspi/sensors/dht11/status"];
  const dhtData: {
    temperature: number;
    humidity: number;
  } = data["raspi/sensors/dht11/data"];
  const hcsr04Status: SensorConnectionStatus =
    data["raspi/sensors/hc-sr04/status"];
  const hcsr04Data: {
    distance: number;
  } = data["raspi/sensors/hc-sr04/data"];

  return (
    <div>
      <div className="w-full space-y-4">
        <h2 className="text-lg font-semibold">Sensors</h2>
        <div className="flex w-full flex-col flex-wrap items-start justify-start gap-6 sm:flex-row">
          <div className="grid w-full gap-6 sm:grid-cols-2 lg:max-w-[28rem] lg:grid-cols-1 xl:max-w-[32rem]">
            <DHTSensorComponent dhtStatus={dhtStatus} dhtData={dhtData} />
            <Card className="flex h-64 items-start justify-end">
              <CardHeader>
                <Badge variant={"outline"} className="w-min text-nowrap">
                  GPS Module
                </Badge>
              </CardHeader>
            </Card>
          </div>
          <div className="grid w-full flex-1 gap-6 lg:max-w-[20rem]">
            <HCSR04Component
              hcsr04Status={hcsr04Status}
              hcsr04Data={hcsr04Data}
            />
            <Card className="flex h-64 items-start justify-end">
              <CardHeader>
                <Badge variant={"outline"} className="w-min text-nowrap">
                  Gas and Vibration Sensor
                </Badge>
              </CardHeader>
            </Card>
          </div>
          <div className="grid w-full flex-1 gap-6 lg:max-w-[20rem]">
            <Card className="flex h-64 items-start justify-end">
              <CardHeader>
                <Badge variant={"outline"} className="w-min text-nowrap">
                  Sound and Raindrop Sensor
                </Badge>
              </CardHeader>
            </Card>
            <Card className="flex h-64 items-start justify-end">
              <CardHeader>
                <Badge variant={"outline"} className="w-min text-nowrap">
                  Voice Controlled LED
                </Badge>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

interface DHTSensorComponentProps {
  dhtStatus: SensorConnectionStatus;
  dhtData: {
    temperature: number;
    humidity: number;
  };
}

function DHTSensorComponent({ dhtStatus, dhtData }: DHTSensorComponentProps) {
  const [currentUnit, setCurrentUnit] = React.useState<string>("temperature");

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="flex flex-row items-center justify-between">
          <Badge
            variant={"secondary"}
            className="!mt-0 flex items-center gap-1.5 rounded-full py-[3px]"
          >
            <div className="relative flex items-center justify-center">
              {dhtStatus?.isActive ? (
                <div className="absolute h-3 w-3 animate-ping rounded-full bg-emerald-500/50 delay-1000 duration-1000" />
              ) : null}
              <div
                className={`relative h-2.5 w-2.5 rounded-full ${dhtStatus?.isActive ? "bg-emerald-500" : "bg-rose-500"} `}
              />
            </div>
            {dhtStatus?.isActive ? "Active" : "Disconnected"}
          </Badge>
          <div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size={"icon"}
                    variant={"ghost"}
                    className={`relative cursor-default ${dhtData?.temperature >= 38 && "animate-pulse cursor-wait text-rose-500 delay-300 hover:text-rose-500"}`}
                  >
                    <Bell className="size-5" />
                    {dhtData?.temperature >= 38 && (
                      <div className="absolute -end-2 -top-2 inline-flex h-6 w-6 items-center justify-center bg-transparent font-bold text-rose-500">
                        !
                      </div>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  className={
                    dhtData?.temperature >= 38
                      ? `bg-destructive text-destructive-foreground`
                      : `bg-muted text-muted-foreground`
                  }
                >
                  <p>
                    {dhtData?.temperature >= 38
                      ? "Temperature reacher >= 38°C"
                      : "Indicator if object temperature reaches 38°C above"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Popover>
              <PopoverTrigger asChild>
                <Button size={"icon"} variant={"ghost"}>
                  <Settings className="size-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="mr-4 space-y-4">
                <span className="text-base font-semibold tracking-tight">
                  Settings
                </span>
                <div className="flex flex-col items-start gap-4">
                  <div className="w-full space-y-2">
                    <span>Graph Displayed</span>
                    <Select
                      onValueChange={setCurrentUnit}
                      defaultValue={currentUnit}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select graph to display" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="temperature">Temperature</SelectItem>
                        <SelectItem value="humidity">Humidity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <span className="">Temperature Unit</span>
                    <ToggleGroup type="single" defaultValue="celsius">
                      <ToggleGroupItem value="celsius">°C</ToggleGroupItem>
                      <ToggleGroupItem value="fahrenheit">°F</ToggleGroupItem>
                      <ToggleGroupItem value="kelvin">°K</ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="flex flex-col justify-start gap-1">
          <div className="flex items-center justify-between">
            <h2 className="text-sm text-muted-foreground">Temperature</h2>
            <Thermometer className="size-4 text-muted-foreground" />
          </div>
          <span className="text-5xl font-semibold tracking-tight">
            {dhtData ? (
              dhtData.temperature
            ) : (
              <Skeleton className="h-12 w-1/4" />
            )}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <h2 className="text-sm text-muted-foreground">Temperature</h2>
            <WindIcon className="size-4 text-muted-foreground" />
          </div>
          <span className="text-5xl font-semibold tracking-tight">
            {dhtData ? (
              `${dhtData.humidity}%`
            ) : (
              <Skeleton className="h-12 w-1/4" />
            )}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ChartComponent currentUnit={currentUnit} />
      </CardContent>
    </Card>
  );
}

interface HCSR04SensorComponentProps {
  hcsr04Status: SensorConnectionStatus;
  hcsr04Data: {
    distance: number;
  };
}

function HCSR04Component({
  hcsr04Status,
  hcsr04Data,
}: HCSR04SensorComponentProps) {
  const [currentUnit, setCurrentUnit] = React.useState<string>("centimeter");
  const [currentFrequency, setCurrentFrequency] =
    React.useState<string>("default");
  const [maxDistance, setMaxDistance] = React.useState<number>(0);
  const [distance, setDistance] = React.useState<number>(0);
  const { clientRef } = useMQTTClient();
  const { toast } = useToast();
  const [toastEnabled, setToastEnabled] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (distance != null) {
      if (currentUnit === "inch") {
        setMaxDistance(157);
      } else if (currentUnit === "centimeter") {
        setMaxDistance(400);
      }
      clientRef.current.publish(
        "raspi/sensors/hc-sr04/settings",
        Buffer.from(
          JSON.stringify({ unit: currentUnit, frequency: currentFrequency }),
        ),
        { qos: 0 },
      );
    }
  }, [currentUnit]);

  React.useEffect(() => {
    if (hcsr04Data && hcsr04Data.distance !== null) {
      setDistance(hcsr04Data.distance);

      if (hcsr04Data.distance >= 12 && !toastEnabled) {
        setToastEnabled(true);
        toast({
          variant: "destructive",
          title: "Distance Reached",
          description:
            "Object distance is >= 12 cm. Reposition the object near the sensor",
        });
      } else if (hcsr04Data.distance < 12 && toastEnabled) {
        setToastEnabled(false);
      }
    }
  }, [hcsr04Data, toastEnabled]);

  React.useEffect(() => {
    if (currentFrequency || currentUnit) {
      clientRef.current.publish(
        "raspi/sensors/hc-sr04/settings",
        Buffer.from(
          JSON.stringify({ unit: currentUnit, frequency: currentFrequency }),
        ),
        { qos: 0 },
      );
    }
  }, [currentFrequency]);

  const chartData = [
    {
      sensor: "ultrasonic",
      value: distance,
      fill: "var(--color-ultrasonic)",
    },
  ];

  const calculatedEndAngle =
    90 + (chartData[0].value / maxDistance) * (450 - 90);

  const chartConfig = {
    ultrasonic: {
      label: "Ultrasonic",
      color: `${chartData[0].value >= 12 ? "hsl(var(--chart-5))" : "hsl(var(--chart-1))"}`,
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader className="pb-0">
        <CardTitle className="flex flex-row items-center justify-between text-center font-medium">
          <Badge
            variant={"secondary"}
            className="!mt-0 flex items-center gap-1.5 rounded-full py-[3px]"
          >
            <div className="relative flex items-center justify-center">
              {hcsr04Status?.isActive ? (
                <div className="absolute h-3 w-3 animate-ping rounded-full bg-emerald-500/50 delay-1000 duration-1000" />
              ) : null}
              <div
                className={`relative h-2.5 w-2.5 rounded-full ${hcsr04Status?.isActive ? "bg-emerald-500" : "bg-rose-500"} `}
              />
            </div>
            {hcsr04Status?.isActive ? "Active" : "Disconnected"}
          </Badge>
          <div className="space-x-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size={"icon"}
                    variant={"ghost"}
                    className={`relative cursor-default ${distance >= 12 && "animate-pulse cursor-wait text-rose-500 delay-300 hover:text-rose-500"}`}
                  >
                    <Bell className="size-5" />
                    {distance >= 12 && (
                      <div className="absolute -end-2 -top-2 inline-flex h-6 w-6 items-center justify-center bg-transparent font-bold text-rose-500">
                        !
                      </div>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  className={
                    distance >= 12
                      ? `bg-destructive text-destructive-foreground`
                      : `bg-muted text-muted-foreground`
                  }
                >
                  <p>
                    {distance >= 12
                      ? "Distance reaches >= 12 cm. Reposition the object near the sensor"
                      : "Indicator if object distance reaches 12cm above"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Popover>
              <PopoverTrigger asChild>
                <Button size={"icon"} variant={"ghost"}>
                  <Settings className="size-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="mr-4 w-min space-y-4">
                <span className="text-base font-semibold tracking-tight">
                  Settings
                </span>
                <div className="flex flex-col items-start gap-1">
                  <span className="text-sm font-medium tracking-tight">
                    Distance unit
                  </span>
                  <ToggleGroup
                    type="single"
                    onValueChange={setCurrentUnit}
                    defaultValue={currentUnit}
                  >
                    <ToggleGroupItem value="centimeter">
                      Centimeter
                    </ToggleGroupItem>
                    <ToggleGroupItem value="inch">Inch</ToggleGroupItem>
                  </ToggleGroup>
                </div>
                <div className="flex flex-col items-start gap-1">
                  <span className="text-sm font-medium tracking-tight">
                    Frequency
                  </span>
                  <ToggleGroup
                    type="single"
                    onValueChange={setCurrentFrequency}
                    defaultValue={currentFrequency}
                  >
                    <ToggleGroupItem value="default">Default</ToggleGroupItem>
                    <ToggleGroupItem value="max">Hi</ToggleGroupItem>
                    <ToggleGroupItem value="low">Lo</ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={calculatedEndAngle}
            innerRadius={80}
            outerRadius={140}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="value" background />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-5xl font-bold tracking-tighter"
                        >
                          {chartData[0].value.toFixed(0).toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 28}
                          className="fill-muted-foreground"
                        >
                          {currentUnit}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
        <UltrasonicChartComponent />
      </CardContent>
    </Card>
  );
}

function UltrasonicChartComponent() {
  const { data, isLoading } = useQuery({
    queryKey: ["ultrasonic"],
    queryFn: async () => {
      const response = await axios.get("/api/get-ultrasonic");
      return response.data;
    },
  });

  const chartConfig = {
    lowIndex: {
      label: "Minimum",
      color: "hsl(var(--chart-2))",
    },
    highIndex: {
      label: "Maximum",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  if (isLoading) {
    return <Skeleton className="h-48 w-full" />;
  }

  return (
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
          dataKey="time"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          minTickGap={32}
          tickFormatter={(value) => {
            const date = new Date(value);
            return date.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "numeric",
            });
          }}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
          labelFormatter={(value) => {
            const date = new Date(value);
            return date.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "numeric",
            });
          }}
        />
        <defs>
          <linearGradient id="fillHighIndex" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-highIndex)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-highIndex)"
              stopOpacity={0.1}
            />
          </linearGradient>
          <linearGradient id="fillLowIndex" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-lowIndex)"
              stopOpacity={0.8}
            />
            <stop
              offset="95%"
              stopColor="var(--color-lowIndex)"
              stopOpacity={0.1}
            />
          </linearGradient>
        </defs>
        <Area
          dataKey="lowIndex"
          type="natural"
          fill="url(#fillLowIndex)"
          fillOpacity={0.4}
          stroke="var(--color-lowIndex)"
          stackId="a"
        />
        <Area
          dataKey="highIndex"
          type="natural"
          fill="url(#fillHighIndex)"
          fillOpacity={0.4}
          stroke="var(--color-highIndex)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
}

interface ChartProps {
  currentUnit: string;
}

function ChartComponent({ currentUnit }: ChartProps) {
  const { data, isLoading } = useQuery({
    queryKey: [currentUnit],
    queryFn: async () => {
      const response = await axios.get(`api/get-${currentUnit}`);
      return response.data;
    },
  });

  const chartConfig = {
    highIndex: {
      label: "High Index",
      color: "hsl(var(--chart-1))",
    },
    lowIndex: {
      label: "Low Index",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  if (isLoading) return <Skeleton className="h-48 w-full" />;

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
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
            labelFormatter={(value) => {
              return currentUnit.toUpperCase();
            }}
          />
          <defs>
            <linearGradient id="fillHighIndex" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-highIndex)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-highIndex)"
                stopOpacity={0.1}
              />
            </linearGradient>
            <linearGradient id="fillLowIndex" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-lowIndex)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-lowIndex)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <Area
            dataKey="lowIndex"
            type="natural"
            fill="url(#fillLowIndex)"
            fillOpacity={0.4}
            stroke="var(--color-lowIndex)"
            stackId="a"
          />
          <Area
            dataKey="highIndex"
            type="natural"
            fill="url(#fillHighIndex)"
            fillOpacity={0.4}
            stroke="var(--color-highIndex)"
            stackId="a"
          />
        </AreaChart>
      </ChartContainer>
    )
  );
}
