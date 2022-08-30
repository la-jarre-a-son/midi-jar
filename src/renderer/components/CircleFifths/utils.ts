import { Note } from '@tonaljs/tonal';
import { Chord } from '@tonaljs/chord';

import { range } from 'renderer/helpers';
import { formatSharpsFlats } from 'renderer/helpers/note';

// Types

export type Section = {
  enabled: boolean;
  size: number;
  start: number;
  end: number;
  middle: number;
  align: number;
};

export type SectionType =
  | 'alt'
  | 'modes'
  | 'degreesMajor'
  | 'major'
  | 'dom'
  | 'degreesMinor'
  | 'minor'
  | 'dim'
  | 'arrow';

export type Sections = Record<SectionType, Section>;

export type CircleOfFifthsConfig = {
  scale?: 'major' | 'minor';
  highlightSector?: 'chord' | 'notes';
  highlightInScale?: boolean;
  displayMajor?: boolean;
  displayMinor?: boolean;
  displayDominants?: boolean;
  displaySuspended?: boolean;
  displayDiminished?: boolean;
  displayAlterations?: boolean;
  displayModes?: boolean;
  displayDegrees?: boolean;
  displayDegreeLabels?: boolean;
};

// Constants

export const SIZE = 100; // SVG viewport size
export const CX = SIZE / 2; // Circle origin X
export const CY = SIZE / 2; // Circle origin Y

export const SUSPENDED_OFFSET = 0.15;

export const FIFTHS_INDEXES = range(0, 11);
export const FIFTHS_MAJOR = 'C G D A E B/Cb F#/Gb C#/Db Ab Eb Bb F'
  .split(' ')
  .map((v) => v.split('/'));
export const FIFTHS_MINOR = 'A E B F# C# G#/Ab D#/Eb A#/Bb F C G D'
  .split(' ')
  .map((v) => v.split('/'));
export const FIFTHS_DIMINISHED = 'B F# C# G# D# A#/Bb E#/F B#/C G D A E'
  .split(' ')
  .map((v) => v.split('/'));
export const FIFTHS_DOMINANTS =
  'G/Bb/Db/E D/F/Ab/B A/C/Eb/F# E/G/Bb/C# B/D/F/G# F#/A/C/D# C#/E/G/A# Ab/Cb/D/F Eb/Gb/A/C Bb/Db/E/G F/Ab/Cb/D C/Eb/Gb/A'
    .split(' ')
    .map((v) => v.split('/'));
export const FIFTHS_ALTERATIONS =
  '• # ## ### #### 5#/7b 6#/6b 7#/5b bbbb bbb bb b'
    .split(' ')
    .map((v) => v.split('/'));

export const DEGREE_NAMES =
  'tonic,supertonic,mediant,subdominant,dominant,submediant,leading tone'
    .toUpperCase()
    .split(',');

export const DEGREE_COLORS = [
  '#6F8CDD',
  '#958FF2',
  '#DEB54E',
  '#F28FCF',
  '#F2777B',
  '#F2DE6B',
  '#64DE84',
];

export const DEGREE_OFFSETS_MAJOR = [0, 2, 4, -1, 1, 3, 5];
export const DEGREE_OFFSETS_MINOR = [0, 2, -3, -1, 1, -4, -2];

export const DEGREES_MAJOR = 'I ii iii IV V vi vii°'.split(' ');
export const DEGREES_MINOR = 'i ii bIII iv v bVI bVII'.split(' ');

export const MODE_OFFSETS = [0, 2, 4, -1, 1, 3, 5];

export const MODE_NAMES =
  'ionian dorian phrygian lydian mixolydian aeolian locrian'
    .toUpperCase()
    .split(' ');

const SECTIONS_TOTAL = 0.46;

const SECTIONS: Sections = {
  alt: {
    size: 0.03,
    enabled: true,
    start: 0.5,
    end: 0.47,
    middle: 0.476,
    align: 0.2,
  },
  modes: {
    size: 0.02,
    enabled: true,
    start: 0.47,
    end: 0.45,
    middle: 0.466,
    align: 0.3,
  },
  degreesMajor: {
    size: 0.02,
    enabled: true,
    start: 0.45,
    end: 0.43,
    middle: 0.446,
    align: 0.25,
  },
  major: {
    size: 0.1,
    enabled: true,
    start: 0.43,
    end: 0.33,
    middle: 0.38,
    align: 0.5,
  },
  dom: {
    size: 0.03,
    enabled: true,
    start: 0.33,
    end: 0.3,
    middle: 0.31,
    align: 0.3,
  },
  degreesMinor: {
    size: 0.02,
    enabled: true,
    start: 0.3,
    end: 0.28,
    middle: 0.286,
    align: 0.25,
  },
  minor: {
    size: 0.1,
    enabled: true,
    start: 0.28,
    end: 0.18,
    middle: 0.24,
    align: 0.5,
  },
  dim: {
    size: 0.09,
    enabled: true,
    start: 0.18,
    end: 0.09,
    middle: 0.135,
    align: 0.5,
  },
  arrow: {
    size: 0.04,
    enabled: true,
    start: 0.09,
    end: 0.06,
    middle: 0.075,
    align: 0.5,
  },
};

const SECTIONS_ORDER_MAJOR: (keyof typeof SECTIONS)[] = [
  'alt',
  'modes',
  'degreesMajor',
  'major',
  'dom',
  'degreesMinor',
  'minor',
  'dim',
  'arrow',
];
const SECTIONS_ORDER_MINOR: (keyof typeof SECTIONS)[] = [
  'alt',
  'modes',
  'degreesMinor',
  'minor',
  'dom',
  'degreesMajor',
  'major',
  'dim',
  'arrow',
];

/**
 * Returns true if the section is displayed
 * @param type - The type of section
 * @param config - the display config
 * @returns
 */
export const isSectionDisplayed = (
  type: SectionType,
  config?: CircleOfFifthsConfig
) => {
  if (config) {
    if (type === 'alt' && !config.displayAlterations) return false;
    if (type === 'major' && !config.displayMajor) return false;
    if (type === 'minor' && !config.displayMinor) return false;
    if (type === 'dim' && !config.displayDiminished) return false;
    if (type === 'dom' && !config.displayDominants) return false;
    if (type === 'modes' && !config.displayModes) return false;
    if (
      type === 'degreesMajor' &&
      !(config.displayDegrees && config.displayMajor)
    )
      return false;
    if (
      type === 'degreesMinor' &&
      !(config.displayDegrees && config.displayMinor)
    )
      return false;
  }

  return true;
};

/**
 * Get the sections radius ranges
 * @returns
 */
export const getSections = (config: CircleOfFifthsConfig = {}) => {
  const order =
    config.scale === 'minor' ? SECTIONS_ORDER_MINOR : SECTIONS_ORDER_MAJOR;

  const sectionsObj = order.reduce(
    (obj, type: keyof typeof SECTIONS) => {
      const { size } = SECTIONS[type];

      const enabled = isSectionDisplayed(type, config);

      obj.sections[type] = { ...obj.sections[type], enabled };
      obj.total += enabled ? size : 0;

      return obj;
    },
    { total: 0, sections: { ...SECTIONS } }
  );

  const newTotal = (SECTIONS_TOTAL + sectionsObj.total) / 2;
  let start = 0.5;
  order.forEach((type) => {
    const { size: initialSize, enabled } = sectionsObj.sections[type];

    if (enabled) {
      const end = start - (initialSize / sectionsObj.total) * newTotal;
      const size = start - end;

      sectionsObj.sections[type].start = start * SIZE;
      sectionsObj.sections[type].end = end * SIZE;
      sectionsObj.sections[type].middle =
        sectionsObj.sections[type].end +
        size * sectionsObj.sections[type].align * SIZE;

      start = end;
    }
  });

  return sectionsObj.sections;
};

export const getDegreePosition = (
  scale: 'major' | 'minor',
  degree: number,
  config?: CircleOfFifthsConfig
): [SectionType, number, string] | null => {
  if (scale === 'minor') {
    const offset = DEGREE_OFFSETS_MINOR[degree];
    const label = DEGREES_MINOR[degree];

    if (config?.displayMinor) {
      if (
        offset - 2 === 0 &&
        config?.displayDiminished &&
        config?.highlightInScale
      ) {
        return ['dim', offset - 2, label];
      }

      if (
        (offset < -1 || offset > 1) &&
        config?.displayMajor &&
        config?.highlightInScale
      ) {
        return ['major', offset + 3, label];
      }

      return ['minor', offset, label];
    }

    if (config?.displayMajor) {
      return ['major', offset + 3, label];
    }
  }

  if (scale === 'major') {
    const offset = DEGREE_OFFSETS_MAJOR[degree];
    const label = DEGREES_MAJOR[degree];

    if (config?.displayMajor) {
      if (
        offset - 5 === 0 &&
        config?.displayDiminished &&
        config?.highlightInScale
      ) {
        return ['dim', offset - 5, label];
      }

      if (
        (offset < -1 || offset > 1) &&
        config?.displayMinor &&
        config?.highlightInScale
      ) {
        return ['minor', offset - 3, label];
      }

      return ['major', offset, label];
    }
  }

  return null;
};

/**
 * Transform polar coordinates to cartesian
 *
 * @param ox - origin x
 * @param oy - origin y
 * @param r - radius
 * @param a - angle
 * @returns [x, y]
 */
export const polar = (
  ox: number,
  oy: number,
  r: number,
  a: number
): [number, number] => {
  const rad = (a - 0.25) * 2 * Math.PI;
  const x = ox + r * Math.cos(rad);
  const y = oy + r * Math.sin(rad);
  return [x, y];
};

/**
 * Returns polar coordinates from cartesian, as string "x,y"
 */
export const cPolar = (ox: number, oy: number, r: number, a: number): string =>
  polar(ox, oy, r, a).join(',');

/**
 * Returns the svg path for an arc of the circle
 *
 * @param ox - origin X of the center
 * @param oy - origin Y of the center
 * @param d -  distance of the arc
 * @param a1 - start angle of the arc
 * @param a2 - end angle of the arc
 * @returns {string} - the svg path of the arc
 */
export const drawArc = (
  ox: number,
  oy: number,
  d: number,
  a1: number,
  a2: number
) => `
  M ${cPolar(ox, oy, d, a1)}
  A ${d},${d} 0 ${a2 - a1 <= 0.5 ? 0 : 1} 1 ${cPolar(ox, oy, d, a2)}
`;

/**
 * Returns the svg path for a section of the circle
 *
 * @param ox - origin X of the center
 * @param oy - origin Y of the center
 * @param d1 - close distance of the section
 * @param d2 - far distance of the section
 * @param a1 - start angle of the section
 * @param a2 - end angle of the section
 * @returns {string} - the svg path of the section
 */
export const drawSection = (
  ox: number, // origin X
  oy: number, // origin Y
  d1: number, // distance 1
  d2: number, // distance 2
  a1: number, // angle 1
  a2: number // angle 2
) => `
  M ${cPolar(ox, oy, d2, a1)}
  A ${d2},${d2} 0 ${a2 - a1 <= 0.5 ? 0 : 1} 1 ${cPolar(ox, oy, d2, a2)}
  L ${cPolar(ox, oy, d1, a2)}
  A ${d1},${d1} 0 ${a2 - a1 <= 0.5 ? 0 : 1} 0 ${cPolar(ox, oy, d1, a1)}
  Z
`;

export const drawLineSeparator = (
  ox: number, // origin X
  oy: number, // origin Y
  d1: number, // distance 1
  d2: number, // distance 2
  a: number // angle
) => `
  M ${cPolar(ox, oy, d1, a)}
  L ${cPolar(ox, oy, d2, a)}
`;

export const drawRegularPolygon = (
  n: number, // number of sides
  ox: number, // origin X
  oy: number, // origin Y
  r: number, // radius
  a: number // angle
) =>
  range(0, n - 1)
    .map((i) => cPolar(ox, oy, r, i / n + a))
    .join(' ');

/**
 * Returns true if the current section is in the corresponding scale of the circle of fifths
 *
 * @param current - the current key index in the circle of fifths
 * @param value - the section index in the circle of fifths
 * @returns {boolean}
 */
export const isInScale = (current: number, value: number) => {
  if (
    value === current + 1 ||
    value === current - 1 ||
    value === current + 11 ||
    value === current - 11
  )
    return true;

  return false;
};

export const isSusInScale = (
  current: number,
  value: number,
  suspended: 'sus2' | 'sus4',
  scale: 'major' | 'minor'
) => {
  if (
    scale === 'major' &&
    suspended === 'sus4' &&
    (value === current + 1 || value === current - 11)
  )
    return true;

  if (
    scale === 'minor' &&
    suspended === 'sus2' &&
    (value === current - 1 || value === current + 11)
  )
    return true;

  if (
    (scale === 'major' && suspended === 'sus2') ||
    (scale === 'minor' && suspended === 'sus4')
  )
    return isInScale(current, value);

  return false;
};

export const isSameNote = (a?: string | null, b?: string | null) =>
  a && b && Note.chroma(a) === Note.chroma(b);

const DOMINANT_CHORDS = ['7', '7no5', '9', '9no5', '7b9'];

export const isDiminished = (chord?: Chord | null, tonic?: string) =>
  (chord &&
    chord.quality === 'Diminished' &&
    chord.quality === 'Diminished' &&
    (!tonic || isSameNote(tonic, chord.tonic))) ||
  (chord?.aliases[0] === 'dim7' &&
    (!tonic ||
      isSameNote(tonic, chord?.notes[0]) ||
      isSameNote(tonic, chord?.notes[1]) ||
      isSameNote(tonic, chord?.notes[2]) ||
      isSameNote(tonic, chord?.notes[3])));

export const isDominantChord = (chord?: Chord | null, tonic?: string) =>
  chord &&
  DOMINANT_CHORDS.includes(chord.aliases[0]) &&
  (!tonic || isSameNote(chord.tonic, tonic));

export const isMajorChord = (chord?: Chord | null, tonic?: string) =>
  chord &&
  chord.quality === 'Major' &&
  !isDominantChord(chord) &&
  (!tonic || isSameNote(chord.tonic, tonic));

export const isMinorChord = (chord?: Chord | null, tonic?: string) =>
  chord &&
  chord.quality === 'Minor' &&
  (!tonic || isSameNote(chord.tonic, tonic));

export const isSus2Chord = (chord?: Chord | null, tonic?: string) =>
  chord &&
  chord.aliases[0].match(/sus2/) &&
  (!tonic || isSameNote(tonic, chord.tonic));

export const isSus4Chord = (chord?: Chord | null, tonic?: string) =>
  chord &&
  chord.aliases[0].match(/sus24|sus4/) &&
  (!tonic || isSameNote(tonic, chord.tonic));

export const isMinorAugmentedChord = (chord?: Chord | null, tonic?: string) =>
  chord &&
  chord.quality === 'Augmented' &&
  chord.aliases[0].startsWith('m') &&
  (!tonic || isSameNote(chord.tonic, tonic));

export const isMajorAugmentedChord = (chord?: Chord | null, tonic?: string) =>
  chord &&
  chord.quality === 'Augmented' &&
  !isMinorAugmentedChord(chord) &&
  (!tonic || isSameNote(chord.tonic, tonic));

export const isMainSection = (
  section: 'major' | 'minor' | 'dim' | 'dom' | 'sus2' | 'sus4',
  config: CircleOfFifthsConfig
) =>
  (section === config.scale && config.displayMajor && config.displayMinor) ||
  (section === 'minor' && !config.displayMajor && config.displayMinor) ||
  (section === 'major' && !config.displayMinor && config.displayMajor);

/**
 * Returns true if the chord corresponds to the circle of fifths section, also depending on the sections shown
 *
 * @param tonic - the tonic of the section
 * @param section - the section being checked
 * @param chord - the currently detected chord
 * @param config - the circle config
 * @returns
 */
export const isChordPressed = (
  tonic: string,
  section: 'major' | 'minor' | 'dim' | 'dom' | 'sus2' | 'sus4',
  chord: Chord | null | undefined,
  config: CircleOfFifthsConfig
) => {
  if (!chord || !chord.tonic) return false;
  if (config.highlightSector !== 'chord') return false;

  if (
    (section === 'dim' ||
      (isMainSection(section, config) && !config.displayDiminished)) &&
    isDiminished(chord, tonic)
  )
    return true;

  if (
    (section === 'dom' ||
      (isMainSection(section, config) && !config.displayDominants)) &&
    isDominantChord(chord, tonic)
  )
    return true;

  if (
    (section === 'sus4' ||
      (isMainSection(section, config) && !config.displaySuspended)) &&
    isSus4Chord(chord, tonic)
  )
    return true;
  if (
    (section === 'sus2' ||
      (isMainSection(section, config) && !config.displaySuspended)) &&
    isSus2Chord(chord, tonic)
  )
    return true;

  if (
    (section === 'minor' ||
      (isMainSection(section, config) && !config.displayMinor)) &&
    (isMinorChord(chord, tonic) || isMinorAugmentedChord(chord, tonic))
  )
    return true;

  if (
    (section === 'major' ||
      (isMainSection(section, config) && !config.displayMajor)) &&
    (isMajorChord(chord, tonic) || isMajorAugmentedChord(chord, tonic))
  )
    return true;

  return false;
};

/**
 * Returns true if the not is in passed array
 *
 * @param note - the note to compare
 * @param notes - the pressed notes
 * @returns
 */
export const isNotePressed = (note: string, notes?: string[]) => {
  if (!notes || !notes.length) return false;

  return notes.findIndex((pressed) => isSameNote(note, pressed)) > -1;
};

/**
 * Get the key index in the circle of fifths, depending on the key signature alterations
 *
 * @param alteration - a number of flats (<0) or sharps (>0)
 * @returns {number} - the key index
 */
export const getCurrentKey = (alteration: number) =>
  alteration < 0 ? alteration + 12 : alteration;

/**
 * Returns true if the section key name is currently selected
 *
 * @param tonic - the current key signature tonic
 * @param fifthsIndex - this index of the fifths (section)
 * @param alternative - the alternative to compare - defaults to 0
 * @returns
 */
export const isKeySelected = (
  fifthsIndex: number,
  alternative = 0,
  tonic?: string
) => {
  if (!tonic) return true;

  return FIFTHS_MAJOR[fifthsIndex][alternative] === tonic;
};

export const formatLabel = (label: string, quality: string) => {
  const note = formatSharpsFlats(label);

  switch (quality) {
    case 'major':
      return note;
    case 'minor':
      return note.toLocaleLowerCase();
    case 'dim':
      return `${note}°`;
    case 'dom':
      return `${note}7`;
    default:
      return note + quality;
  }
};
