import React from "react";

type Props = {
  value: number;
};

const RaindropModule = ({ value }: Props) => {
  const getColor = () => {
    if (value === 0) return "text-emerald-500";
    if (value === 25) return "text-yellow-500";
    if (value === 50) return "text-amber-500";
    if (value === 75) return "text-rose-500";
    return "text-muted-foreground";
  };

  return (
    <div className={`text-base font-medium tracking-tight ${getColor()}`}>
      RAIN DETECTED
    </div>
  );
};

export default RaindropModule;
