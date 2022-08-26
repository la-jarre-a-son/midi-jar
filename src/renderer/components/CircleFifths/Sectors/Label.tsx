import React from 'react';
import classnames from 'classnames/bind';

import { formatSharpsFlats } from 'renderer/helpers/note';

import { CX, CY, polar, cPolar, isKeySelected } from '../utils';

import styles from '../CircleFifths.module.scss';

const cx = classnames.bind(styles);

type SectorLabelProps = {
  value: number;
  label: string | string[];
  rotation: number;
  radius: number;
  fontSize: number;
  tonic?: string;
  quality: string;
};

export const SectorLabel: React.FC<SectorLabelProps> = ({
  value,
  label,
  rotation,
  radius,
  fontSize,
  tonic,
  quality,
}) => {
  const labels = Array.isArray(label) ? label : [label];

  if (labels.length > 1) {
    return (
      <>
        <text
          className={cx('name', {
            'name--selected': isKeySelected(value, 0, tonic),
          })}
          x={polar(CX, CY, radius, value / 12)[0]}
          y={polar(CX, CY, radius, value / 12)[1]}
          textAnchor="middle"
          fontSize={fontSize / 1.5}
          dy={-0.1 * fontSize}
          dx={-0.25 * fontSize}
          transform={`rotate(${rotation}, ${cPolar(
            CX,
            CY,
            radius,
            value / 12
          )})`}
        >
          {formatSharpsFlats(labels[0]) + quality}
        </text>
        <text
          className={cx('name', {
            'name--selected': isKeySelected(value, 1, tonic),
          })}
          x={polar(CX, CY, radius, value / 12)[0]}
          y={polar(CX, CY, radius, value / 12)[1]}
          textAnchor="middle"
          fontSize={fontSize / 1.5}
          dy={0.6 * fontSize}
          dx={0.25 * fontSize}
          transform={`rotate(${rotation}, ${cPolar(
            CX,
            CY,
            radius,
            value / 12
          )})`}
        >
          {formatSharpsFlats(labels[1]) + quality}
        </text>
      </>
    );
  }

  return (
    <text
      className={cx('name')}
      x={polar(CX, CY, radius, value / 12)[0]}
      y={polar(CX, CY, radius, value / 12)[1]}
      textAnchor="middle"
      fontSize={fontSize}
      dy={0.33 * fontSize}
      transform={`rotate(${rotation}, ${cPolar(CX, CY, radius, value / 12)})`}
    >
      {formatSharpsFlats(labels[0]) + quality}
    </text>
  );
};

SectorLabel.defaultProps = {
  tonic: undefined,
};
