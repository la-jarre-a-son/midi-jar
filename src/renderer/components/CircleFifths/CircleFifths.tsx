import React, { useEffect, useState, useMemo } from 'react';
import classnames from 'classnames/bind';

import { Chord } from '@tonaljs/chord';

import { getKeySignature, KeySignatureConfig } from 'renderer/helpers/note';

import {
  SIZE,
  CX,
  CY,
  FIFTHS_INDEXES,
  FIFTHS_MAJOR,
  FIFTHS_MINOR,
  FIFTHS_DOMINANTS,
  FIFTHS_DIMINISHED,
  FIFTHS_ALTERATIONS,
  getCurrentKey,
  getSectors,
} from './utils';

import {
  SectorAlteration,
  SectorDominants,
  SectorMajor,
  SectorMinor,
  SectorDiminished,
  SectorSuspended,
  Degrees,
} from './Sectors';

import styles from './CircleFifths.module.scss';

const cx = classnames.bind(styles);

export type Props = {
  className?: string;
  children?: React.ReactNode;
  keySignature?: KeySignatureConfig;
  chord?: Chord | null;
  onChange?: (key: string) => unknown;
  displayDominants?: boolean;
  displayMajor?: boolean;
  displayMinor?: boolean;
  displayDiminished?: boolean;
  displayAlt?: boolean;
  displaySuspended?: boolean;
  displayDegrees?: boolean;
};

const defaultProps = {
  className: undefined,
  children: undefined,
  onChange: undefined,
  chord: undefined,
  keySignature: getKeySignature('C'),
  displayDominants: true,
  displayMajor: true,
  displayMinor: true,
  displayDiminished: true,
  displayAlt: true,
  displaySuspended: true,
  displayDegrees: true,
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
  displayDominants = true,
  displayMajor = true,
  displayMinor = true,
  displayDiminished = true,
  displayAlt = true,
  displaySuspended = true,
  displayDegrees = true,
}) => {
  const displayConfig = useMemo(
    () => ({
      displayDominants,
      displayMajor,
      displayMinor,
      displayDiminished,
      displayAlt,
      displaySuspended,
      displayDegrees,
    }),
    [
      displayDominants,
      displayMajor,
      displayMinor,
      displayDiminished,
      displayAlt,
      displaySuspended,
      displayDegrees,
    ]
  );

  const SECTORS = useMemo(() => getSectors(displayConfig), [displayConfig]);

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
        className={cx('circle')}
        width="100vw"
        height="100vh"
        viewBox={`0 0 ${SIZE} ${SIZE}`}
      >
        <g
          className={cx('wheel')}
          transform={`rotate(${-rotation}, ${CX}, ${CY})`}
        >
          {/* ALTERATIONS */}
          {displayConfig.displayAlt &&
            FIFTHS_INDEXES.map((value) => (
              <SectorAlteration
                key={value}
                value={value}
                current={current}
                tonic={keySignature?.tonic}
                label={FIFTHS_ALTERATIONS[value]}
                radius={SECTORS.alt.middle * SIZE}
              />
            ))}
          {/* MAJOR */}
          {displayConfig.displayMajor &&
            FIFTHS_INDEXES.map((value) => (
              <SectorMajor
                label={FIFTHS_MAJOR[value]}
                key={`major_${value}`}
                value={value}
                current={current}
                rotation={rotation}
                sector={SECTORS.major}
                onClick={handleClick}
                displaySuspended={displayConfig.displaySuspended}
                chord={chord}
                keySignature={keySignature}
              />
            ))}
          {/* SUSPENDED MAJOR */}
          {displayConfig.displayMajor &&
            displayConfig.displaySuspended &&
            FIFTHS_INDEXES.map((value) => (
              <g key={`sus_maj_${value}`}>
                <SectorSuspended
                  value={value}
                  current={current}
                  quality="sus4"
                  sector={SECTORS.major}
                  sectorType="major"
                  onClick={handleClick}
                  chord={chord}
                  keySignature={keySignature}
                />
                <SectorSuspended
                  value={value}
                  current={current}
                  quality="sus2"
                  sector={SECTORS.major}
                  sectorType="major"
                  onClick={handleClick}
                  chord={chord}
                  keySignature={keySignature}
                />
              </g>
            ))}
          {/* SUSPENDED MINOR */}
          {displayConfig.displayMinor &&
            displayConfig.displaySuspended &&
            FIFTHS_INDEXES.map((value) => (
              <g key={`sus_min_${value}`}>
                <SectorSuspended
                  value={value}
                  current={current}
                  quality="sus4"
                  sector={SECTORS.minor}
                  sectorType="minor"
                  onClick={handleClick}
                  chord={chord}
                  keySignature={keySignature}
                />
                <SectorSuspended
                  value={value}
                  current={current}
                  quality="sus2"
                  sector={SECTORS.minor}
                  sectorType="minor"
                  onClick={handleClick}
                  chord={chord}
                  keySignature={keySignature}
                />
              </g>
            ))}
          {/* MINOR */}
          {displayConfig.displayMinor &&
            FIFTHS_INDEXES.map((value) => (
              <SectorMinor
                key={`minor_${value}`}
                label={FIFTHS_MINOR[value]}
                value={value}
                current={current}
                rotation={rotation}
                sector={SECTORS.minor}
                onClick={handleClick}
                displaySuspended={displayConfig.displaySuspended}
                chord={chord}
                keySignature={keySignature}
              />
            ))}
          {/* DIMINISHED */}
          {displayConfig.displayDiminished &&
            FIFTHS_INDEXES.map((value) => (
              <SectorDiminished
                key={`diminished_${value}`}
                label={FIFTHS_DIMINISHED[value]}
                value={value}
                current={current}
                rotation={rotation}
                sector={SECTORS.dim}
                onClick={handleClick}
                chord={chord}
                keySignature={keySignature}
              />
            ))}
          {/* DOMINANTS */}
          {displayConfig.displayDominants &&
            FIFTHS_INDEXES.map((value) => (
              <SectorDominants
                key={`dom_${value}`}
                value={value}
                current={current}
                label={FIFTHS_DOMINANTS[value]}
                radius={SECTORS.dom.middle * SIZE}
                chord={chord}
                keySignature={keySignature}
              />
            ))}
        </g>
        {/* DEGREES */}
        {displayConfig.displayDegrees && displayConfig.displayMajor && (
          <Degrees
            scale="major"
            sectors={SECTORS}
            displayConfig={displayConfig}
          />
        )}
        {displayConfig.displayDegrees && displayConfig.displayMinor && (
          <Degrees
            scale="minor"
            sectors={SECTORS}
            displayConfig={displayConfig}
          />
        )}
      </svg>
      <div className={cx('content')}>{children}</div>
    </div>
  );
};

CircleFifths.defaultProps = defaultProps;

export default CircleFifths;
