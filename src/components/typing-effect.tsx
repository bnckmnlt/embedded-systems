import React, { useState, useEffect } from "react";

type Props = {
  text: string;
  speed: number;
};

const TypingEffect = ({ text, speed }: Props) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;

    const typeCharacter = () => {
      if (index < text.length) {
        setDisplayedText((prev) => prev + text[index]);
        index++;

        setTimeout(typeCharacter, speed);
      }
    };

    typeCharacter();

    return () => {
      index = text.length;
    };
  }, [text, speed]);

  return <p>{displayedText}</p>;
};

export default TypingEffect;
