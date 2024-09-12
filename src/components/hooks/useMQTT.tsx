import mqtt, { MqttClient } from "mqtt";
import React from "react";

interface MQTTOptions {
  topics: string | string[];
}

export const useMQTT = ({ topics }: MQTTOptions) => {
  const [connectionStatus, setConnectionStatus] =
    React.useState<string>("Disconnected");
  const [data, setData] = React.useState<{ [key: string]: any }>({});
  const clientRef = React.useRef<MqttClient | null>(null);

  React.useEffect(() => {
    setConnectionStatus("Connecting");

    const client = mqtt.connect(process.env.NEXT_PUBLIC_BROKER as string, {
      protocol: "wss",
      clientId: `clientId-${Math.random().toString(16).substr(2, 8)}`,
      username: process.env.NEXT_PUBLIC_USERNAME,
      password: process.env.NEXT_PUBLIC_KEY,
      connectTimeout: 60000,
      will: {
        topic: "raspi/board/status",
        payload: Buffer.from(JSON.stringify({ isActive: false })),
        retain: true,
      },
    });

    clientRef.current = client;

    client.on("connect", () => {
      setConnectionStatus("Connected");
      client.subscribe(topics);
    });

    client.on("error", (err) => {
      setConnectionStatus("Error");
      console.log(`Connection error: ${err}`);
    });

    client.on("close", () => {
      setConnectionStatus("Disconnected");
    });

    client.on("message", (topic, message) => {
      try {
        const payload = JSON.parse(message.toString());
        setData((prevData) => ({
          ...prevData,
          [topic]: payload,
        }));
      } catch (err) {
        console.error(`Error parsing message on topic ${topic}: ${err}`);
      }
    });

    return () => {
      if (clientRef.current) {
        client.unsubscribe(topics);
        clientRef.current?.end();
      }
    };
  }, [topics]);

  return { connectionStatus, data, clientRef };
};
