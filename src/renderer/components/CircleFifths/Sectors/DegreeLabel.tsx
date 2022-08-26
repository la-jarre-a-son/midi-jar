import React from 'react';

import { formatSharpsFlats } from 'renderer/helpers/note';

import { SIZE, CX, CY, SUSPENDED_OFFSET, polar, Sector } from '../utils';

type DegreeLabelProps = {
  offset: number;
  sector: Sector;
  label: string;
  anchor?: 'left' | 'right';
  displaySuspended?: boolean;
  displayed?: boolean;
};

export const DegreeLabel: React.FC<DegreeLabelProps> = ({
  offset,
  sector,
  anchor,
  label,
  displaySuspended,
  displayed,
}) => {
  if (!displayed) return null;
  const value = offset < 0 ? 12 + offset : offset;
  const radius = sector.start * SIZE;
  const suspendedOffset = displaySuspended ? SUSPENDED_OFFSET : 0;
  const ANGLE_OFFSET =
    anchor === 'left' ? -0.46 + suspendedOffset : 0.46 - suspendedOffset;
  const WHEEL_OFFSET = -2.25;
  const COORDS = polar(
    CX,
    CY,
    radius + WHEEL_OFFSET,
    (value + ANGLE_OFFSET) / 12
  );

  return (
    <text
      x={COORDS[0]}
      y={COORDS[1]}
      textAnchor={anchor === 'left' ? 'start' : 'end'}
      fontSize={2}
      transform={`rotate(${(value + ANGLE_OFFSET) * 30}, ${COORDS[0]}, ${
        COORDS[1]
      })`}
    >
      {formatSharpsFlats(label)}
    </text>
  );
};

DegreeLabel.defaultProps = {
  anchor: 'left',
  displaySuspended: false,
  displayed: false,
};
