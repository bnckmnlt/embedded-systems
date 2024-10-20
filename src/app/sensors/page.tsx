"use client";

import React, { useEffect } from "react";
import {
  Axis3D,
  Bell,
  ServerCrash,
  Settings,
  Thermometer,
  TrendingUp,
  TriangleAlertIcon,
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
  Bar,
  BarChart,
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
import CameraModuleComponent from "$/src/components/camera-components/CameraModuleComponent";
import GasSensorComponent from "$/src/components/gas-sensor/gas-sensor";
import VibrationSensorComponents from "$/src/components/vibration-sensor/vibration-sensor";
import RaindropSensorComponent from "$/src/components/raindrop-sensor/raindrop-sensor";
import SoundSensorComponent from "$/src/components/sound-sensor/sound-sensor";
import GpsSensor from "$/src/components/google-maps-component/gps-sensor";
import VoiceControlledComponent from "$/src/components/voice-controlled-component/voice-controlled";

export type SensorConnectionStatus = {
  isActive: boolean;
};

export default function Sensors() {
  const { data } = useMQTTClient();

  const cameraModuleStatus: SensorConnectionStatus =
    data["raspi/camera/status"];
  const cameraModuleData: {
    recording: boolean;
    sending: boolean;
    error: boolean;
    success: boolean;
  } = data["raspi/camera/data"];
  const pirModuleStatus: SensorConnectionStatus =
    data["raspi/sensors/pir/status"];
  const pirModuleData: {
    objectDetected: boolean;
  } = data["raspi/sensors/pir/data"];
  const dhtStatus: SensorConnectionStatus = data["raspi/sensors/dht11/status"];
  const dhtData: {
    temperature: number;
    humidity: number;
  } = data["raspi/sensors/dht11/data"];
  const hcsr04Status: SensorConnectionStatus =
    data["raspi/sensors/hc-sr04/1/status"];
  const hcsr04Data: {
    distance: number;
  } = data["raspi/sensors/hc-sr04/1/data"];
  const hcsr042ndStatus: SensorConnectionStatus =
    data["raspi/sensors/hc-sr04/2/status"];
  const hcsr042ndData: {
    distance: number;
  } = data["raspi/sensors/hc-sr04/2/data"];

  return (
    <div>
      <div className="w-full space-y-4">
        <h2 className="text-lg font-semibold">Sensors</h2>
        <div className="flex w-full flex-col flex-wrap items-start justify-start gap-6 sm:flex-row">
          <div className="grid w-full flex-1 gap-6 lg:max-w-[24rem]">
            <RaindropSensorComponent />
            <VibrationSensorComponents />
            <DHTSensorComponent dhtStatus={dhtStatus} dhtData={dhtData} />
          </div>
          <div className="grid w-full grow gap-6 md:grid-cols-2 lg:max-w-[28rem] lg:grid-cols-1 xl:max-w-[40rem]">
            <div className="grid-col-1 grid w-full gap-6 md:grid-cols-2">
              <HCSR04Component
                hcsr04Status={hcsr04Status}
                hcsr04Data={hcsr04Data}
                api="get-ultrasonic"
              />
              <HCSR04Component
                hcsr04Status={hcsr042ndStatus}
                hcsr04Data={hcsr042ndData}
                api="get-ultrasonic-2nd"
              />
            </div>
            <CameraModuleComponent
              cameraModuleStatus={cameraModuleStatus}
              cameraModuleData={cameraModuleData}
              pirModuleStatus={pirModuleStatus}
              pirModuleData={pirModuleData}
            />
            <VoiceControlledComponent />
          </div>
          <div className="grid w-full flex-1 gap-6 lg:max-w-[24rem]">
            <SoundSensorComponent />
            <GasSensorComponent />
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
  api: string;
}

function HCSR04Component({
  hcsr04Status,
  hcsr04Data,
  api,
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
      clientRef.current?.publish(
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
          description: (
            <div className="flex flex-row items-center justify-start gap-2">
              <TriangleAlertIcon size={32} /> Distance reached. Adjust the
              object.
            </div>
          ),
        });
      } else if (hcsr04Data.distance < 12 && toastEnabled) {
        setToastEnabled(false);
      }
    }
  }, [hcsr04Data, toastEnabled]);

  React.useEffect(() => {
    if (currentFrequency || currentUnit) {
      clientRef.current?.publish(
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
      color: `${chartData[0].value >= 12 ? "hsl(var(--chart-1))" : "hsl(var(--chart-2))"}`,
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
      <CardContent className="bg-transparent p-0">
        <div className="ml-8 mt-8">
          <div className="text-7xl font-bold tracking-tight">
            {distance}
            <span className="text-2xl font-semibold tracking-tight">
              {" "}
              {currentUnit}
            </span>
          </div>
        </div>
        <ChartContainer config={chartConfig} className="mb-12 mt-4 h-16">
          <BarChart
            className="h-12"
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: -20,
            }}
          >
            <YAxis
              dataKey="ultrasonic"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <XAxis
              type="number"
              dataKey="value"
              domain={[0, calculatedEndAngle]}
              hide
            />
            <Bar dataKey="value" fill="var(--color-ultrasonic)" radius={5} />
          </BarChart>
        </ChartContainer>
        <UltrasonicChartComponent api={api} />
      </CardContent>
    </Card>
  );
}

interface UltrasonicChartComponentProps {
  api: string;
}

function UltrasonicChartComponent({ api }: UltrasonicChartComponentProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["ultrasonic"],
    queryFn: async () => {
      const response = await axios.get(
        `/api/${api === "get-ultrasonic" ? "get-ultrasonic" : "get-ultrasonic-2nd"}`,
      );
      return response.data.reverse();
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
          active={true}
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
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
    queryKey: ["unit", currentUnit],
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
