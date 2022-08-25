import React, { useEffect, useState } from 'react';
import classnames from 'classnames/bind';

import { Chord } from '@tonaljs/chord';

import {
  formatSharpsFlats,
  getKeySignature,
  KeySignatureConfig,
} from 'renderer/helpers/note';

import {
  FIFTHS_INDEXES,
  FIFTHS_MAJOR,
  FIFTHS_MINOR,
  FIFTHS_DIMINISHED,
  FIFTHS_ALTERATIONS,
  polar,
  cPolar,
  arc,
  sector,
  isInScale,
  isPressed,
  getCurrentKey,
  isKeySelected,
} from './utils';

import styles from './CircleFifths.module.scss';

const SIZE = 100; // SVG viewport size
const CX = SIZE / 2; // Circle origin X
const CY = SIZE / 2; // Circle origin Y

const SECTORS = [0.43 * SIZE, 0.33 * SIZE, 0.23 * SIZE, 0.13 * SIZE];

const cx = classnames.bind(styles);

export type Props = {
  className?: string;
  children?: React.ReactNode;
  keySignature?: KeySignatureConfig;
  chord?: Chord | null;
  onChange?: (key: string) => unknown;
};

const defaultProps = {
  className: undefined,
  children: undefined,
  onChange: undefined,
  chord: undefined,
  keySignature: getKeySignature('C'),
};

type SectorLabelProps = {
  value: number;
  label: string | string[];
  rotation: number;
  radius: number;
  fontSize: number;
  tonic: string | undefined;
  quality: string;
};

const SectorLabel: React.FC<SectorLabelProps> = ({
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
            'name--selected': isKeySelected(tonic, value, 0),
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
            'name--selected': isKeySelected(tonic, value, 1),
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

type SectorAlterationProps = {
  value: number;
  label: string | string[];
  radius: number;
  tonic: string | undefined;
};

const SectorAlteration: React.FC<SectorAlterationProps> = ({
  value,
  label,
  radius,
  tonic,
}) => {
  const labels = Array.isArray(label) ? label : [label];

  const renderFollowPath = (
    <path
      id={`alteration_${value}_followpath`}
      d={arc(CX, CY, radius, (value - 0.5) / 12, (value + 0.5) / 12)}
    />
  );

  if (labels.length > 1) {
    return (
      <>
        {renderFollowPath}
        <text
          className={cx({
            'alteration--selected': isKeySelected(tonic, value, 0),
          })}
          fontSize="3"
          textAnchor="middle"
        >
          <textPath href={`#alteration_${value}_followpath`} startOffset="33%">
            {formatSharpsFlats(labels[0])}
          </textPath>
        </text>
        <text
          className={cx({
            'alteration--selected': isKeySelected(tonic, value, 1),
          })}
          fontSize="3"
          textAnchor="middle"
        >
          <textPath href={`#alteration_${value}_followpath`} startOffset="66%">
            {formatSharpsFlats(labels[1])}
          </textPath>
        </text>
      </>
    );
  }

  return (
    <>
      {renderFollowPath}
      <text
        className={cx('alteration--selected')}
        fontSize="3"
        textAnchor="middle"
      >
        <textPath href={`#alteration_${value}_followpath`} startOffset="50%">
          {formatSharpsFlats(labels[0])}
        </textPath>
      </text>
    </>
  );
};

/**
 * An inline component to display vector icons from svg with variant (normal/outline/flat).
 *
 * @version 1.0.0
 * @author Rémi Jarasson
 */
const CircleFifths: React.FC<Props> = ({
  keySignature,
  className,
  children,
  chord,
  onChange,
}) => {
  const [current, setCurrent] = useState<number>(
    getCurrentKey(keySignature?.alteration || 0)
  );
  const [rotation, setRotation] = useState<number>(((current * 1) / 12) * 360);

  const handleClick = (newValue: number) => {
    if (onChange) {
      if (
        FIFTHS_MAJOR[newValue].length > 1 &&
        keySignature?.tonic === FIFTHS_MAJOR[newValue][0]
      ) {
        onChange(FIFTHS_MAJOR[newValue][1]);
      } else {
        onChange(FIFTHS_MAJOR[newValue][0]);
      }
    }
  };

  useEffect(() => {
    const newValue = getCurrentKey(keySignature?.alteration || 0);

    setCurrent((previousValue) => {
      let diff = newValue - previousValue;
      if (diff < -6) diff += 12;
      if (diff > 6) diff -= 12;

      setRotation(
        (previousRotation) => previousRotation + ((diff * 1) / 12) * 360
      );

      return newValue;
    });
  }, [keySignature]);

  return (
    <div className={cx('root', { 'root--interactive': !!onChange }, className)}>
      <svg
        className={cx('circle-of-fifths')}
        width="100vw"
        height="100vh"
        viewBox={`0 0 ${SIZE} ${SIZE}`}
      >
        <g
          className={cx('wheel')}
          transform={`rotate(${-rotation}, ${CX}, ${CY})`}
        >
          {FIFTHS_INDEXES.map((value) => (
            <g
              key={value}
              className={cx('alteration', {
                'alteration--active': value === current,
              })}
            >
              <SectorAlteration
                value={value}
                tonic={keySignature?.tonic}
                label={FIFTHS_ALTERATIONS[value]}
                radius={SECTORS[0] + 1}
              />
            </g>
          ))}
          {FIFTHS_INDEXES.map((value) => (
            <g
              key={value}
              className={cx('key', 'key--major', {
                'key--active': value === current,
                'key--isInScale': isInScale(current, value),
                'key--isPressed': isPressed(
                  FIFTHS_MAJOR[value][0],
                  'Major',
                  chord
                ),
                'key--multiple': FIFTHS_MAJOR[value].length > 1,
              })}
              onClick={() => handleClick(value)}
            >
              <path
                className={cx('sector')}
                d={sector(
                  CX,
                  CY,
                  SECTORS[0],
                  SECTORS[1],
                  (value - 0.5) / 12,
                  (value + 0.5) / 12
                )}
                strokeWidth="1"
              />
              <circle
                className={cx('badge')}
                cx={polar(CX, CY, (SECTORS[0] + SECTORS[1]) / 2, value / 12)[0]}
                cy={polar(CX, CY, (SECTORS[0] + SECTORS[1]) / 2, value / 12)[1]}
                r="4"
              />
              <SectorLabel
                value={value}
                rotation={rotation}
                radius={(SECTORS[0] + SECTORS[1]) / 2}
                fontSize={4}
                label={FIFTHS_MAJOR[value]}
                tonic={keySignature?.tonic}
                quality=""
              />
            </g>
          ))}
          {FIFTHS_INDEXES.map((value) => (
            <g
              key={value}
              className={cx('key', 'key--minor', {
                'key--active': value === current,
                'key--isInScale': isInScale(current, value),
                'key--isPressed': isPressed(
                  FIFTHS_MINOR[value][0],
                  'Minor',
                  chord
                ),
                'key--multiple': FIFTHS_MINOR[value].length > 1,
              })}
              onClick={() => handleClick(value)}
            >
              <path
                className={cx('sector')}
                d={sector(
                  CX,
                  CY,
                  SECTORS[1],
                  SECTORS[2],
                  (value - 0.5) / 12,
                  (value + 0.5) / 12
                )}
                strokeWidth="1"
              />
              <circle
                className={cx('badge')}
                cx={polar(CX, CY, (SECTORS[1] + SECTORS[2]) / 2, value / 12)[0]}
                cy={polar(CX, CY, (SECTORS[1] + SECTORS[2]) / 2, value / 12)[1]}
                r="4"
              />
              <SectorLabel
                rotation={rotation}
                radius={(SECTORS[1] + SECTORS[2]) / 2}
                value={value}
                fontSize={2.5}
                label={FIFTHS_MINOR[value]}
                tonic={keySignature?.tonic}
                quality="min"
              />
            </g>
          ))}
          {FIFTHS_INDEXES.map((value) => (
            <g
              key={value}
              className={cx('key', 'key--diminished', {
                'key--active': value === current,
                'key--isPressed': isPressed(
                  FIFTHS_DIMINISHED[value][0],
                  'Diminished',
                  chord
                ),
                'key--multiple': FIFTHS_DIMINISHED[value].length > 1,
              })}
              onClick={() => handleClick(value)}
            >
              <path
                className={cx('sector')}
                d={sector(
                  CX,
                  CY,
                  SECTORS[2],
                  SECTORS[3],
                  (value - 0.5) / 12,
                  (value + 0.5) / 12
                )}
                strokeWidth="1"
              />
              <circle
                className={cx('badge')}
                cx={polar(CX, CY, (SECTORS[2] + SECTORS[3]) / 2, value / 12)[0]}
                cy={polar(CX, CY, (SECTORS[2] + SECTORS[3]) / 2, value / 12)[1]}
                r="4"
              />
              <SectorLabel
                rotation={rotation}
                radius={(SECTORS[2] + SECTORS[3]) / 2}
                value={value}
                fontSize={2.5}
                label={FIFTHS_DIMINISHED[value]}
                tonic={keySignature?.tonic}
                quality="dim"
              />
            </g>
          ))}
        </g>
      </svg>
      <div className={cx('content')}>{children}</div>
    </div>
  );
};

CircleFifths.defaultProps = defaultProps;

export default CircleFifths;
