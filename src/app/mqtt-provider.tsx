import React from "react";

interface MQTTContextType {
  connectionStatus: string;
  data: {
    [key: string]: any;
  };
  clientRef: any
}

export const MQTTContext = React.createContext<MQTTContextType | undefined>(
  undefined,
);

export const useMQTTClient = () => {
  const context = React.useContext(MQTTContext);
  if (!context) {
    throw new Error("useMQTTClient must be used within a MQTTProvider");
  }
  return context;
};
