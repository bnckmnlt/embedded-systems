"use client";

import React from "react";
import Typewriter from "typewriter-effect";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { useMQTTClient } from "$/src/app/mqtt-provider";
import { SensorConnectionStatus } from "$/src/app/sensors/page";
import Lottie from "lottie-react";
import animationGradient from "$/public/lottiefiles/gradient-circular.json";
import animationVoice from "$/public/lottiefiles/audio-moving.json";
import { useQuery } from "@tanstack/react-query";
import { fetchMessages } from "$/server/actions/actions";
import MessageList from "./MessageList";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import VoiceSelector from "./VoiceSelector";

type VoiceControlledDataRequestType = {
  speechRequest: string;
};

type VoiceControlledDataResponseType = {
  speechResponse: string;
};

type Props = {};

const VoiceControlledComponent = (props: Props) => {
  const [voices, setVoices] = React.useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = React.useState<number>(0);
  const { data } = useMQTTClient();

  const voiceControlledDataRequest: VoiceControlledDataRequestType =
    data["raspi/sensors/voice/data/request"];
  const voiceControlledDataResponse: VoiceControlledDataResponseType =
    data["raspi/sensors/voice/data/response"];
  const voiceControlledStatus: SensorConnectionStatus =
    data["raspi/sensors/voice/status"];
  const redLedStatus: SensorConnectionStatus = data["raspi/sensors/led/red"];
  const blueLedStatus: SensorConnectionStatus = data["raspi/sensors/led/blue"];
  const orangeLedStatus: SensorConnectionStatus =
    data["raspi/sensors/led/orange"];

  const { data: messages, isLoading } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => await fetchMessages(),
  });

  React.useEffect(() => {
    if (voiceControlledDataResponse) {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(
        voiceControlledDataResponse?.speechResponse,
      );

      utterance.voice = synth.getVoices()[selectedVoice];

      synth.speak(utterance);
    }
  }, [voiceControlledDataResponse]);

  return (
    <Card>
      <CardHeader className="flex h-min flex-row items-center justify-between">
        <div className="flex flex-row items-center space-y-1.5">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10">
              <Lottie animationData={animationGradient} loop={true} />
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium leading-none">RecoSpeed</p>
              <Badge
                variant={"outline"}
                className="!mt-0 flex h-min items-center gap-1.5 rounded-full py-[3px]"
              >
                <div className="relative flex items-center justify-center">
                  {voiceControlledStatus?.isActive ? (
                    <div className="absolute h-3 w-3 animate-ping rounded-full bg-emerald-500/50 delay-1000 duration-1000" />
                  ) : null}
                  <div
                    className={`relative h-2.5 w-2.5 rounded-full ${voiceControlledStatus?.isActive ? "bg-emerald-500" : "bg-rose-500"} `}
                  />
                </div>
                {voiceControlledStatus?.isActive ? "Active" : "Disconnected"}
              </Badge>
            </div>
          </div>
        </div>
        <VoiceSelector
          selected={selectedVoice}
          setSelected={setSelectedVoice}
        />
      </CardHeader>
      <CardContent>
        <div>
          {messages && (
            <MessageList messages={messages} isLoading={isLoading} />
          )}
          <div className="space-y-4">
            {voiceControlledDataRequest?.speechRequest && (
              <div className="ml-auto flex w-max max-w-[75%] flex-col items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground">
                <div className="flex flex-row items-center gap-1">
                  <div className="h-8 w-8">
                    <Lottie animationData={animationVoice} loop={true} />
                  </div>
                  <p>{voiceControlledDataRequest?.speechRequest}</p>
                </div>
              </div>
            )}
            {voiceControlledDataResponse?.speechResponse && (
              <div className="flex flex-row items-center gap-2">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex w-max max-w-[75%] flex-col items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm">
                  <Typewriter
                    key={voiceControlledDataResponse?.speechResponse}
                    onInit={(typewriter) => {
                      typewriter
                        .typeString(voiceControlledDataResponse.speechResponse)
                        .pauseFor(1500)
                        .start();
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2 pt-6">
            <div className="flex flex-row items-center gap-2 rounded-md border px-4 py-2 font-mono text-sm leading-none">
              <div className="relative flex items-center justify-center">
                {orangeLedStatus?.isActive ? (
                  <div className="absolute h-3 w-3 animate-ping rounded-full bg-emerald-500/50 delay-1000 duration-1000" />
                ) : null}
                <div
                  className={`relative h-2.5 w-2.5 rounded-full ${orangeLedStatus?.isActive ? "bg-emerald-500" : "bg-rose-500"} `}
                />
              </div>
              Orange LED
            </div>
            <div className="flex flex-row items-center gap-2 rounded-md border px-4 py-2 font-mono text-sm leading-none">
              <div className="relative flex items-center justify-center">
                {blueLedStatus?.isActive ? (
                  <div className="absolute h-3 w-3 animate-ping rounded-full bg-emerald-500/50 delay-1000 duration-1000" />
                ) : null}
                <div
                  className={`relative h-2.5 w-2.5 rounded-full ${blueLedStatus?.isActive ? "bg-emerald-500" : "bg-rose-500"} `}
                />
              </div>
              Blue LED
            </div>
            <div className="flex flex-row items-center gap-2 rounded-md border px-4 py-2 font-mono text-sm leading-none">
              <div className="relative flex items-center justify-center">
                {redLedStatus?.isActive ? (
                  <div className="absolute h-3 w-3 animate-ping rounded-full bg-emerald-500/50 delay-1000 duration-1000" />
                ) : null}
                <div
                  className={`relative h-2.5 w-2.5 rounded-full ${redLedStatus?.isActive ? "bg-emerald-500" : "bg-rose-500"} `}
                />
              </div>
              Red LED
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceControlledComponent;
