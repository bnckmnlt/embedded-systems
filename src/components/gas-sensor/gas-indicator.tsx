"use client";

import * as React from "react";
import { Progress } from "../ui/progress";
import { Skeleton } from "../ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

type GasIndicatorProps = {
  label: string;
  value: number;
};

const GasIndicator = ({ label, value }: GasIndicatorProps) => {
  return (
    <div className="flex flex-row items-center gap-4">
      <span className="w-[64px] min-w-[50px] flex-none text-center text-xs font-medium uppercase tracking-tight text-muted-foreground">
        {label}
      </span>
      {value ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Progress
                value={value * 1000}
                max={2}
                className="h-4 w-full grow rounded-md bg-transparent"
              />
            </TooltipTrigger>
            <TooltipContent>
              {value ? (
                <span className="w-min flex-none text-nowrap text-right text-sm italic lining-nums">
                  Gas percentage: {value.toFixed(2)} ppm
                </span>
              ) : (
                <div className="flex-none text-right text-sm italic lining-nums">
                  None
                </div>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <Skeleton className="h-4 grow rounded-md" />
      )}
    </div>
  );
};

export default GasIndicator;
