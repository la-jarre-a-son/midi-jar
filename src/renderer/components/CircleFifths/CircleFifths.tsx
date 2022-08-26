import React, { useEffect, useState, useMemo } from 'react';
import classnames from 'classnames/bind';

import { Chord } from '@tonaljs/chord';

import {
  formatSharpsFlats,
  getKeySignature,
  getNoteInKeySignature,
  KeySignatureConfig,
} from 'renderer/helpers/note';

import {
  FIFTHS_INDEXES,
  FIFTHS_MAJOR,
  FIFTHS_MINOR,
  FIFTHS_DOMINANTS,
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
  isSameDominant,
  isSusInScale,
  getSectors,
} from './utils';

import styles from './CircleFifths.module.scss';

const SIZE = 100; // SVG viewport size
const CX = SIZE / 2; // Circle origin X
const CY = SIZE / 2; // Circle origin Y

const SUSPENDED_OFFSET = 0.15;

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
  tonic?: string;
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

type SectorSusLabelProps = {
  value: number;
  label: string | string[];
  radius: number;
  fontSize: number;
  keySignature?: KeySignatureConfig;
  quality: string;
};

const SectorSusLabel: React.FC<SectorSusLabelProps> = ({
  value,
  label,
  radius,
  fontSize,
  keySignature,
  quality,
}) => {
  const labels = Array.isArray(label) ? label : [label];
  const angle =
    quality === 'sus4'
      ? (value - (0.5 - SUSPENDED_OFFSET / 2)) / 12
      : (value + (0.5 - SUSPENDED_OFFSET / 2)) / 12;

  return (
    <text
      className={cx('name', 'name--sus')}
      x={polar(CX, CY, radius, angle)[0]}
      y={polar(CX, CY, radius, angle)[1]}
      textAnchor="middle"
      fontSize={fontSize}
      dy={0.33 * fontSize}
      transform={`rotate(${
        angle * 360 + (quality === 'sus4' ? -90 : +90)
      }, ${cPolar(CX, CY, radius, angle)})`}
    >
      {formatSharpsFlats(
        getNoteInKeySignature(labels[0], keySignature?.notes)
      ) + quality}
    </text>
  );
};

SectorSusLabel.defaultProps = {
  keySignature: undefined,
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
            'alteration--selected': isKeySelected(value, 0, tonic),
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
            'alteration--selected': isKeySelected(value, 1, tonic),
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

type SectorDominantsProps = {
  value: number;
  label: string | string[];
  radius: number;
  chord?: Chord | null;
  keySignature?: KeySignatureConfig;
};

const SectorDominants: React.FC<SectorDominantsProps> = ({
  value,
  label,
  radius,
  chord,
  keySignature,
}) => {
  const labels = Array.isArray(label) ? label : [label];

  const renderFollowPath = (
    <path
      id={`dominants_${value}_followpath`}
      d={arc(CX, CY, radius, (value - 0.5) / 12, (value + 0.5) / 12)}
    />
  );
  return (
    <>
      {renderFollowPath}
      {labels.map((l: string, index: number) => (
        <text
          className={cx({ 'dominant--active': isSameDominant(l, chord) })}
          key={l}
          fontSize="2"
          textAnchor="middle"
        >
          <textPath
            href={`#dominants_${value}_followpath`}
            startOffset={`${(index + 1) * (120 / (labels.length + 1)) - 10}%`}
          >
            {`${formatSharpsFlats(
              keySignature ? getNoteInKeySignature(l, keySignature.notes) : l
            )}7`}
          </textPath>
        </text>
      ))}
    </>
  );
};

SectorDominants.defaultProps = {
  chord: undefined,
  keySignature: getKeySignature('C'),
};

const DegreeLabel: React.FC<{
  value: number;
  radius: number;
  label: string;
  minor?: boolean;
  displaySuspended?: boolean;
  displayed?: boolean;
}> = ({ value, radius, minor, label, displaySuspended, displayed }) => {
  if (!displayed) return null;
  const suspendedOffset = displaySuspended ? SUSPENDED_OFFSET : 0;
  const ANGLE_OFFSET = minor ? 0.46 - suspendedOffset : -0.46 + suspendedOffset;
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
      textAnchor={minor ? 'end' : 'start'}
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
  minor: false,
  displaySuspended: false,
  displayed: false,
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
  const displayDominants = true;
  const displayMajor = true;
  const displayMinor = true;
  const displayDiminished = true;
  const displayAlt = true;
  const displaySuspended = true;
  const displayDegrees = true;
  const suspendedOffset = displaySuspended ? SUSPENDED_OFFSET : 0;

  const SECTORS = useMemo(
    () =>
      getSectors({
        displayDominants,
        displayMajor,
        displayMinor,
        displayDiminished,
        displayAlt,
      }),
    [
      displayDominants,
      displayMajor,
      displayMinor,
      displayDiminished,
      displayAlt,
    ]
  );

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
          {displayAlt &&
            FIFTHS_INDEXES.map((value) => (
              <g
                key={value}
                className={cx('alterations', {
                  'alterations--selected': value === current,
                })}
              >
                <SectorAlteration
                  value={value}
                  tonic={keySignature?.tonic}
                  label={FIFTHS_ALTERATIONS[value]}
                  radius={SECTORS.alt.middle * SIZE}
                />
              </g>
            ))}
          {/* MAJOR */}
          {displayMajor &&
            FIFTHS_INDEXES.map((value) => (
              <g
                key={`major_${value}`}
                className={cx('key', 'key--major', {
                  'key--selected': value === current,
                  'key--isInScale': isInScale(current, value),
                  'key--active': isPressed(
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
                    SECTORS.major.start * SIZE,
                    SECTORS.major.end * SIZE,
                    (value - (0.5 - suspendedOffset)) / 12,
                    (value + (0.5 - suspendedOffset)) / 12
                  )}
                  strokeWidth="0.5"
                />
                <circle
                  className={cx('badge')}
                  cx={polar(CX, CY, SECTORS.major.middle * SIZE, value / 12)[0]}
                  cy={polar(CX, CY, SECTORS.major.middle * SIZE, value / 12)[1]}
                  r="3.6"
                />
                <SectorLabel
                  value={value}
                  rotation={rotation}
                  radius={SECTORS.major.middle * SIZE}
                  fontSize={4}
                  label={FIFTHS_MAJOR[value]}
                  tonic={keySignature?.tonic}
                  quality=""
                />
              </g>
            ))}
          {/* SUSPENDED MAJOR */}
          {displayMajor &&
            displaySuspended &&
            FIFTHS_INDEXES.map((value) => (
              <g key={`sus_maj_${value}`}>
                <g
                  className={cx('key', 'key--suspended', {
                    'key--selected': value === current,
                    'key--isInScale': isSusInScale(
                      current,
                      value,
                      'sus4',
                      'major'
                    ),
                    'key--active': isPressed(
                      FIFTHS_MAJOR[value][0],
                      'Sus4',
                      chord
                    ),
                  })}
                  onClick={() => handleClick(value)}
                >
                  <path
                    className={cx('sector')}
                    d={sector(
                      CX,
                      CY,
                      SECTORS.major.start * SIZE,
                      SECTORS.major.end * SIZE,
                      (value - 0.5) / 12,
                      (value - 0.5 + suspendedOffset) / 12
                    )}
                    strokeWidth="0.5"
                  />
                  <SectorSusLabel
                    value={value}
                    radius={SECTORS.major.middle * SIZE}
                    fontSize={1.5}
                    label={FIFTHS_MAJOR[value]}
                    keySignature={keySignature}
                    quality="sus4"
                  />
                </g>
                <g
                  className={cx('key', 'key--suspended', {
                    'key--selected': value === current,
                    'key--isInScale': isSusInScale(
                      current,
                      value,
                      'sus2',
                      'major'
                    ),
                    'key--active': isPressed(
                      FIFTHS_MAJOR[value][0],
                      'Sus2',
                      chord
                    ),
                  })}
                  onClick={() => handleClick(value)}
                >
                  <path
                    className={cx('sector')}
                    d={sector(
                      CX,
                      CY,
                      SECTORS.major.start * SIZE,
                      SECTORS.major.end * SIZE,
                      (value + 0.5) / 12,
                      (value + 0.5 - suspendedOffset) / 12
                    )}
                    strokeWidth="0.5"
                  />
                  <SectorSusLabel
                    value={value}
                    radius={SECTORS.major.middle * SIZE}
                    fontSize={1.5}
                    label={FIFTHS_MAJOR[value]}
                    keySignature={keySignature}
                    quality="sus2"
                  />
                </g>
              </g>
            ))}
          {/* SUSPENDED MINOR */}
          {displayMinor &&
            displaySuspended &&
            FIFTHS_INDEXES.map((value) => (
              <g key={`sus_min_${value}`}>
                <g
                  className={cx('key', 'key--suspended', {
                    'key--selected': value === current,
                    'key--isInScale': isSusInScale(
                      current,
                      value,
                      'sus4',
                      'minor'
                    ),
                    'key--active': isPressed(
                      FIFTHS_MINOR[value][0],
                      'Sus4',
                      chord
                    ),
                  })}
                  onClick={() => handleClick(value)}
                >
                  <path
                    className={cx('sector')}
                    d={sector(
                      CX,
                      CY,
                      SECTORS.minor.start * SIZE,
                      SECTORS.minor.end * SIZE,
                      (value - 0.5) / 12,
                      (value - 0.5 + suspendedOffset) / 12
                    )}
                    strokeWidth="0.5"
                  />
                  <SectorSusLabel
                    value={value}
                    radius={SECTORS.minor.middle * SIZE}
                    fontSize={1.5}
                    label={FIFTHS_MINOR[value]}
                    keySignature={keySignature}
                    quality="sus4"
                  />
                </g>
                <g
                  className={cx('key', 'key--suspended', {
                    'key--selected': value === current,
                    'key--isInScale': isSusInScale(
                      current,
                      value,
                      'sus2',
                      'minor'
                    ),
                    'key--active': isPressed(
                      FIFTHS_MINOR[value][0],
                      'Sus2',
                      chord
                    ),
                  })}
                  onClick={() => handleClick(value)}
                >
                  <path
                    className={cx('sector')}
                    d={sector(
                      CX,
                      CY,
                      SECTORS.minor.start * SIZE,
                      SECTORS.minor.end * SIZE,
                      (value + 0.5) / 12,
                      (value + 0.5 - suspendedOffset) / 12
                    )}
                    strokeWidth="0.5"
                  />
                  <SectorSusLabel
                    value={value}
                    radius={SECTORS.minor.middle * SIZE}
                    fontSize={1.5}
                    label={FIFTHS_MINOR[value]}
                    keySignature={keySignature}
                    quality="sus2"
                  />
                </g>
              </g>
            ))}
          {displayMinor &&
            FIFTHS_INDEXES.map((value) => (
              <g
                key={`minor_${value}`}
                className={cx('key', 'key--minor', {
                  'key--selected': value === current,
                  'key--isInScale': isInScale(current, value),
                  'key--active': isPressed(
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
                    SECTORS.minor.start * SIZE,
                    SECTORS.minor.end * SIZE,
                    (value - (0.5 - suspendedOffset)) / 12,
                    (value + (0.5 - suspendedOffset)) / 12
                  )}
                  strokeWidth="0.5"
                />
                <circle
                  className={cx('badge')}
                  cx={polar(CX, CY, SECTORS.minor.middle * SIZE, value / 12)[0]}
                  cy={polar(CX, CY, SECTORS.minor.middle * SIZE, value / 12)[1]}
                  r="3.6"
                />
                <SectorLabel
                  rotation={rotation}
                  radius={SECTORS.minor.middle * SIZE}
                  value={value}
                  fontSize={2.5}
                  label={FIFTHS_MINOR[value]}
                  tonic={keySignature?.tonic}
                  quality="min"
                />
              </g>
            ))}
          {displayDiminished &&
            FIFTHS_INDEXES.map((value) => (
              <g
                key={`dim_${value}`}
                className={cx('key', 'key--diminished', {
                  'key--selected': value === current,
                  'key--active': isPressed(
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
                    SECTORS.dim.start * SIZE,
                    SECTORS.dim.end * SIZE,
                    (value - 0.5) / 12,
                    (value + 0.5) / 12
                  )}
                  strokeWidth="0.5"
                />
                <circle
                  className={cx('badge')}
                  cx={polar(CX, CY, SECTORS.dim.middle * SIZE, value / 12)[0]}
                  cy={polar(CX, CY, SECTORS.dim.middle * SIZE, value / 12)[1]}
                  r="3.6"
                />
                <SectorLabel
                  rotation={rotation}
                  radius={SECTORS.dim.middle * SIZE}
                  value={value}
                  fontSize={2.5}
                  label={FIFTHS_DIMINISHED[value]}
                  tonic={keySignature?.tonic}
                  quality="dim"
                />
              </g>
            ))}
          {displayDominants &&
            FIFTHS_INDEXES.map((value) => (
              <g
                key={`dom_${value}`}
                className={cx('dominants', {
                  'dominants--selected': current === value,
                })}
              >
                <SectorDominants
                  label={FIFTHS_DOMINANTS[value]}
                  radius={SECTORS.dom.middle * SIZE}
                  value={value}
                  chord={chord}
                  keySignature={keySignature}
                />
              </g>
            ))}
        </g>
        {displayDegrees && (
          <g className={cx('degrees')}>
            <DegreeLabel
              value={0}
              radius={SECTORS.major.start * SIZE}
              label="I"
              displaySuspended={displaySuspended}
              displayed={displayMajor}
            />
            <DegreeLabel
              value={11}
              radius={SECTORS.minor.start * SIZE}
              label="ii"
              displaySuspended={displaySuspended}
              displayed={displayMajor && displayMinor}
            />
            <DegreeLabel
              value={1}
              radius={SECTORS.minor.start * SIZE}
              label="iii"
              displaySuspended={displaySuspended}
              displayed={displayMajor && displayMinor}
            />
            <DegreeLabel
              value={11}
              radius={SECTORS.major.start * SIZE}
              label="IV"
              displaySuspended={displaySuspended}
              displayed={displayMajor}
            />
            <DegreeLabel
              value={1}
              radius={SECTORS.major.start * SIZE}
              label="V"
              displaySuspended={displaySuspended}
              displayed={displayMajor}
            />
            <DegreeLabel
              value={0}
              radius={SECTORS.minor.start * SIZE}
              label="vi"
              displaySuspended={displaySuspended}
              displayed={displayMajor && displayMinor}
            />
            <DegreeLabel
              value={0}
              radius={SECTORS.dim.start * SIZE}
              label="vii°"
              displayed={displayMajor && displayDiminished}
            />

            <DegreeLabel
              value={0}
              radius={SECTORS.minor.start * SIZE}
              label="i"
              minor
              displaySuspended={displaySuspended}
              displayed={displayMinor}
            />
            <DegreeLabel
              value={0}
              radius={SECTORS.dim.start * SIZE}
              label="ii°"
              minor
              displayed={displayMinor && displayDiminished}
            />
            <DegreeLabel
              value={0}
              radius={SECTORS.major.start * SIZE}
              label="bIII"
              minor
              displaySuspended={displaySuspended}
              displayed={displayMinor && displayMajor}
            />
            <DegreeLabel
              value={11}
              radius={SECTORS.minor.start * SIZE}
              label="iv"
              minor
              displaySuspended={displaySuspended}
              displayed={displayMinor}
            />
            <DegreeLabel
              value={1}
              radius={SECTORS.minor.start * SIZE}
              label="v"
              minor
              displaySuspended={displaySuspended}
              displayed={displayMinor}
            />
            <DegreeLabel
              value={11}
              radius={SECTORS.major.start * SIZE}
              label="bVI"
              minor
              displaySuspended={displaySuspended}
              displayed={displayMinor && displayMajor}
            />
            <DegreeLabel
              value={1}
              radius={SECTORS.major.start * SIZE}
              label="bVII"
              minor
              displaySuspended={displaySuspended}
              displayed={displayMinor && displayMajor}
            />
          </g>
        )}
      </svg>
      <div className={cx('content')}>{children}</div>
    </div>
  );
};

CircleFifths.defaultProps = defaultProps;

export default CircleFifths;
