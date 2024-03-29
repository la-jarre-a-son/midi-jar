/* eslint-disable no-bitwise */
/* tslint:enable:no-bitwise */
import { all, ChordType } from '@tonaljs/chord-type';
import { note } from '@tonaljs/core';
import { modes, chroma as pcsetChroma } from '@tonaljs/pcset';

const DETECT_INVERSION_SCORE = 0.5;
const DETECT_OMISSION_SCORE = 0.75;

interface FoundChord {
  readonly weight: number;
  readonly name: string;
}

const getOmissions = (chordType: ChordType) => {
  return chordType.intervals.filter((interval: string) => interval.endsWith('*'));
};

type ChordTypeWithOmission = ChordType & { omissions: string[]; omissionChroma: string };

const chordTypesWithOmissions = all().map((chordType: ChordType): ChordTypeWithOmission => {
  const omissions = getOmissions(chordType);
  return {
    ...chordType,
    omissions,
    omissionChroma: pcsetChroma(omissions),
  };
});

const namedSet = (notes: string[]) => {
  const pcToName = notes.reduce<Record<number, string>>((record, n) => {
    const { chroma } = note(n);
    if (chroma !== undefined) {
      record[chroma] = record[chroma] || note(n).name;
    }
    return record;
  }, {});

  return (chroma: number) => pcToName[chroma];
};

function withOmissions(chroma: string, omissionChroma: string): string {
  const chromaNumber = parseInt(chroma, 2);
  const omissionChromaNumber = parseInt(omissionChroma, 2);
  return (chromaNumber | omissionChromaNumber).toString(2);
}

type FindMatchesOptions = {
  allowOmissions: boolean;
  disabledChords: string[];
};
function findMatches(
  notes: string[],
  weight: number,
  options: Partial<FindMatchesOptions>
): FoundChord[] {
  const tonic = notes[0];
  const tonicChroma = note(tonic).chroma;
  const noteName = namedSet(notes);
  // we need to test all chromas to get the correct baseNote
  const allModes = modes(notes, false);

  const found: FoundChord[] = [];
  allModes.forEach((mode, index) => {
    // some chords could have the same chroma but different interval spelling
    const chordTypes = chordTypesWithOmissions.filter((chordType) => {
      if (options.disabledChords && options.disabledChords.includes(chordType.aliases[0])) {
        return false;
      }

      if (options.allowOmissions) {
        const modeWithOmissions = withOmissions(mode, chordType.omissionChroma);
        return chordType.chroma === modeWithOmissions;
      }
      return chordType.chroma === mode;
    });

    chordTypes.forEach((chordType) => {
      const chordName = chordType.aliases[0];
      const baseNote = noteName(index);
      const modeWithOmissions = withOmissions(mode, chordType.omissionChroma);
      const isInversion = index !== tonicChroma;
      const hasOmissions = mode !== modeWithOmissions;

      if (isInversion && hasOmissions) {
        found.push({
          weight: DETECT_INVERSION_SCORE * DETECT_OMISSION_SCORE * weight,
          name: `${baseNote}${chordName}/${tonic}`,
        });
      } else if (isInversion) {
        found.push({
          weight: DETECT_INVERSION_SCORE * weight,
          name: `${baseNote}${chordName}/${tonic}`,
        });
      } else if (hasOmissions) {
        found.push({ weight: DETECT_OMISSION_SCORE * weight, name: `${baseNote}${chordName}` });
      } else {
        found.push({ weight, name: `${baseNote}${chordName}` });
      }
    });
  });

  return found;
}

type DetectOptions = {
  allowOmissions: boolean;
  disabledChords: string[];
};
export function detect(source: string[], options: Partial<DetectOptions> = {}): string[] {
  const notes = source.map((n) => note(n).pc).filter((x) => x);
  if (note.length === 0) {
    return [];
  }

  const found: FoundChord[] = findMatches(notes, 1, options);

  return found
    .filter((chord) => chord.weight)
    .sort((a, b) => b.weight - a.weight)
    .map((chord) => chord.name);
}

export default { detect };
