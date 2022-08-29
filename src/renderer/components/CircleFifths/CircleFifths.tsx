import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import classnames from 'classnames/bind';
import { debounce } from 'renderer/helpers/debounce';

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
  getSections,
  CircleOfFifthsConfig,
} from './utils';

import {
  SectionAlteration,
  SectionDominants,
  SectionMajor,
  SectionMinor,
  SectionDiminished,
  SectionSuspended,
  Degrees,
  DegreeLabels,
  Modes,
} from './Sections';

import styles from './CircleFifths.module.scss';

const cx = classnames.bind(styles);

export type Props = {
  className?: string;
  children?: React.ReactNode;
  keySignature?: KeySignatureConfig;
  chord?: Chord | null;
  notes?: string[];
  onChange?: (key: string) => unknown;
  config?: CircleOfFifthsConfig;
};

const defaultProps = {
  className: undefined,
  children: undefined,
  onChange: undefined,
  chord: undefined,
  notes: undefined,
  keySignature: getKeySignature('C'),
  config: {
    scale: 'major' as const,
    displayMajor: true,
    displayMinor: true,
    displayDiminished: true,
    displayDominants: true,
    displaySuspended: true,
    displayAlterations: true,
    displayModes: true,
    displayDegrees: true,
    displayDegreeLabels: true,
  },
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
  notes,
  onChange,
  config = defaultProps.config,
}) => {
  const sections = useMemo(() => getSections(config), [config]);
  const ref = useRef<SVGSVGElement | null>(null);
  const [size, setSize] = useState<number | null>(null);
  const [current, setCurrent] = useState<number>(
    getCurrentKey(keySignature?.alteration || 0)
  );

  const [rotation, setRotation] = useState<number>(((current * 1) / 12) * 360);
  const [isRotating, setIsRotating] = useState<boolean>(false);

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

      if (diff) {
        setIsRotating(true);
      }

      return newValue;
    });
  }, [keySignature]);

  // Avoids transition between other transform than rotation
  const handleTransitionEnd = useCallback(
    (e: React.TransitionEvent<SVGElement>) => {
      if (e.currentTarget.nodeName === 'g') setIsRotating(false);
    },
    []
  );

  const resize = useCallback(() => {
    if (ref) {
      const s = Math.min(
        ref.current?.parentElement?.clientHeight || 100,
        ref.current?.parentElement?.clientWidth || 100
      );

      setSize(s);
    }
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedResize: () => void = useCallback(debounce(resize, 60), []);

  useEffect(() => {
    window.addEventListener('resize', debouncedResize);
    setTimeout(resize, 0);
    return () => {
      window.removeEventListener('resize', debouncedResize);
    };
  }, [resize, debouncedResize]);

  return (
    <div className={cx('root', { 'root--interactive': !!onChange }, className)}>
      <svg
        ref={ref}
        className={cx('circle')}
        style={{ width: `${size}px`, height: `${size}px` }}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
      >
        {size && (
          <>
            <g
              className={cx('wheel', isRotating && 'wheel--isRotating')}
              transform={`rotate(${-rotation}, ${CX}, ${CY})`}
              onTransitionEnd={handleTransitionEnd}
            >
              {/* ALTERATIONS */}
              {config.displayAlterations &&
                FIFTHS_INDEXES.map((value) => (
                  <SectionAlteration
                    key={value}
                    value={value}
                    current={current}
                    tonic={keySignature?.tonic}
                    label={FIFTHS_ALTERATIONS[value]}
                    section={sections.alt}
                  />
                ))}
              {/* MAJOR */}
              {config.displayMajor &&
                FIFTHS_INDEXES.map((value) => (
                  <SectionMajor
                    label={FIFTHS_MAJOR[value]}
                    key={`major_${value}`}
                    value={value}
                    current={current}
                    rotation={rotation}
                    section={sections.major}
                    onClick={handleClick}
                    config={config}
                    chord={chord}
                    notes={notes}
                    keySignature={keySignature}
                  />
                ))}
              {/* SUSPENDED MAJOR */}
              {config.displayMajor &&
                config.displaySuspended &&
                FIFTHS_INDEXES.map((value) => (
                  <g key={`sus_maj_${value}`}>
                    <SectionSuspended
                      value={value}
                      current={current}
                      quality="sus4"
                      section={sections.major}
                      sectionType="major"
                      onClick={handleClick}
                      chord={chord}
                      keySignature={keySignature}
                      config={config}
                    />
                    <SectionSuspended
                      value={value}
                      current={current}
                      quality="sus2"
                      section={sections.major}
                      sectionType="major"
                      onClick={handleClick}
                      chord={chord}
                      keySignature={keySignature}
                      config={config}
                    />
                  </g>
                ))}
              {/* DOMINANTS */}
              {config.displayDominants &&
                FIFTHS_INDEXES.map((value) => (
                  <SectionDominants
                    key={`dom_${value}`}
                    value={value}
                    current={current}
                    label={FIFTHS_DOMINANTS[value]}
                    section={sections.dom}
                    chord={chord}
                    keySignature={keySignature}
                    config={config}
                  />
                ))}
              {/* SUSPENDED MINOR */}
              {config.displayMinor &&
                config.displaySuspended &&
                FIFTHS_INDEXES.map((value) => (
                  <g key={`sus_min_${value}`}>
                    <SectionSuspended
                      value={value}
                      current={current}
                      quality="sus4"
                      section={sections.minor}
                      sectionType="minor"
                      onClick={handleClick}
                      chord={chord}
                      keySignature={keySignature}
                      config={config}
                    />
                    <SectionSuspended
                      value={value}
                      current={current}
                      quality="sus2"
                      section={sections.minor}
                      sectionType="minor"
                      onClick={handleClick}
                      chord={chord}
                      keySignature={keySignature}
                      config={config}
                    />
                  </g>
                ))}
              {/* MINOR */}
              {config.displayMinor &&
                FIFTHS_INDEXES.map((value) => (
                  <SectionMinor
                    key={`minor_${value}`}
                    label={FIFTHS_MINOR[value]}
                    value={value}
                    current={current}
                    rotation={rotation}
                    section={sections.minor}
                    onClick={handleClick}
                    config={config}
                    chord={chord}
                    notes={notes}
                    keySignature={keySignature}
                  />
                ))}
              {/* DIMINISHED */}
              {config.displayDiminished &&
                FIFTHS_INDEXES.map((value) => (
                  <SectionDiminished
                    key={`diminished_${value}`}
                    label={FIFTHS_DIMINISHED[value]}
                    value={value}
                    current={current}
                    rotation={rotation}
                    section={sections.dim}
                    onClick={handleClick}
                    chord={chord}
                    notes={notes}
                    keySignature={keySignature}
                    config={config}
                  />
                ))}
            </g>
            {/* DEGREES */}
            {config.displayDegrees && config.displayMajor && (
              <Degrees scale="major" section={sections.degreesMajor} />
            )}
            {config.displayDegrees && config.displayMinor && (
              <Degrees scale="minor" section={sections.degreesMinor} />
            )}
            {config.displayModes && (
              <Modes section={sections.modes} config={config} />
            )}
            {config.displayDegreeLabels && (
              <DegreeLabels scale="major" sections={sections} config={config} />
            )}
            {config.displayDegreeLabels && (
              <DegreeLabels scale="minor" sections={sections} config={config} />
            )}
          </>
        )}
      </svg>
      <div className={cx('content')}>{children}</div>
    </div>
  );
};

CircleFifths.defaultProps = defaultProps;

export default CircleFifths;
