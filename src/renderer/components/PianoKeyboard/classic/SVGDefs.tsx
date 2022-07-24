import React from 'react';
import { getContrastColor } from 'renderer/helpers/color';

type Props = {
  colorNoteWhite: string;
  colorNoteBlack: string;
};

const SVGDefs: React.FC<Props> = ({ colorNoteBlack, colorNoteWhite }) => (
  <defs>
    <filter id="insetKey">
      <feOffset dx="3" dy="-7" />
      <feGaussianBlur stdDeviation="4" result="offset-blur" />
      <feComposite
        operator="out"
        in="SourceGraphic"
        in2="offset-blur"
        result="inverse"
      />
      <feFlood floodColor="black" floodOpacity="0.4" result="color" />
      <feComposite operator="in" in="color" in2="inverse" result="shadow" />
      <feComponentTransfer in="shadow" result="shadow">
        <feFuncA type="linear" slope="5" />
      </feComponentTransfer>
      <feBlend mode="soft-light" in="shadow" in2="SourceGraphic" />
    </filter>
    <linearGradient id="whiteKey" gradientTransform="rotate(90)">
      <stop offset="0%" stopColor="#000000" stopOpacity="0.25" />
      <stop
        offset="8%"
        stopColor={getContrastColor(colorNoteWhite)}
        stopOpacity="0.1"
      />
      <stop
        offset="90%"
        stopColor={getContrastColor(colorNoteWhite)}
        stopOpacity="0"
      />
      <stop
        offset="91%"
        stopColor={getContrastColor(colorNoteWhite)}
        stopOpacity="0.1"
      />
    </linearGradient>
    <linearGradient id="blackKey" gradientTransform="rotate(90)">
      <stop
        offset="0%"
        stopColor={getContrastColor(colorNoteBlack)}
        stopOpacity="0"
      />
      <stop
        offset="80%"
        stopColor={getContrastColor(colorNoteBlack)}
        stopOpacity="0.3"
      />
      <stop offset="80%" stopColor="#ffffff" stopOpacity="0.7" />
      <stop
        offset="85%"
        stopColor={getContrastColor(colorNoteBlack)}
        stopOpacity="0.15"
      />
      <stop
        offset="91%"
        stopColor={getContrastColor(colorNoteBlack)}
        stopOpacity="0"
      />
    </linearGradient>
  </defs>
);

export default SVGDefs;
