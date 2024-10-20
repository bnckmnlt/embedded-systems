"use effect";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const synth = window.speechSynthesis;

type VoiceSelectorProps = {
  selected: number;
  setSelected: React.Dispatch<React.SetStateAction<number>>;
};

const VoiceSelector = ({ selected = 0, setSelected }: VoiceSelectorProps) => {
  const [voices, setVoices] = React.useState<SpeechSynthesisVoice[]>([]);

  React.useEffect(() => {
    const fetchVoices = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
    };

    fetchVoices();

    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = fetchVoices;
    }
  }, []);

  return (
    <Select
      onValueChange={(value) => setSelected(parseInt(value))}
      value={selected.toString()}
    >
      <SelectTrigger className="border-none! w-[180px]">
        <SelectValue placeholder="Select Voice" />
      </SelectTrigger>
      <SelectContent>
        {voices.map((voice, index) => (
          <SelectItem key={index} value={index.toString()}>
            {voice.name} ({voice.lang}) {voice.default && " [Default]"}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default VoiceSelector;
