"use client";

import GpsSensor from "$/src/components/google-maps-component/gps-sensor";
import React from "react";

type Props = {};

const MapsPage = (props: Props) => {
  return (
    <div className="h-full">
      <GpsSensor />
    </div>
  );
};

export default MapsPage;
