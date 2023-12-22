/* eslint-disable no-param-reassign */
import { ChordType } from '@tonaljs/chord-type';
import {
  KeySignatureConfig,
  containsInterval,
  getChordTypes,
  getChordsInKey,
} from 'renderer/helpers';

export type ChordItem = {
  type: 'item';
  chordType: ChordType;
};

export type ChordGroup = {
  type: 'group';
  value: string;
  label: string;
  items: (ChordGroup | ChordItem)[];
};

export const groupValues = {
  none: 'All Chords',
  quality: 'By Quality',
  intervals: 'By Intervals',
};

type GroupObject = {
  [key: string]: ChordType[] | GroupObject;
};

const SORT_GROUP_NAMES = [
  // Quality Groups
  'Major',
  'Minor',
  'Dominant',
  'Minor/Major',
  'Suspended / No 3rd',
  'Diminished',
  'Augmented',
  // Interval Groups
  'No 3rd / Suspended',
  'Minor 3rd',
  'Major 3rd',
  'No 5th',
  'Perfect 5th',
  'Diminished 5th',
  'Augmented 5th',
  'No 7th',
  'Minor 7th',
  'Major 7th',
];

function sortItemsFn(a: ChordGroup | ChordItem, b: ChordGroup | ChordItem) {
  if (a.type === 'group' && b.type === 'group') {
    return SORT_GROUP_NAMES.indexOf(a.value) < SORT_GROUP_NAMES.indexOf(b.value) ? -1 : 1;
  }

  if (a.type === 'group' && b.type === 'item') {
    return -1;
  }
  if (a.type === 'item' && b.type === 'group') {
    return 1;
  }

  return 0;
}

export function groupObjectToChordGroup(
  groups: GroupObject | ChordType[],
  currentKey = 'root'
): ChordGroup | ChordItem[] {
  if (Array.isArray(groups)) {
    return groups.map((i) => ({ type: 'item', chordType: i }));
  }

  const items = Object.keys(groups).reduce(
    (i, key: string) => {
      const group = groupObjectToChordGroup((groups as GroupObject)[key], key);

      if (Array.isArray(group)) {
        return i.concat(group);
      }
      return i.concat([group]);
    },
    [] as (ChordGroup | ChordItem)[]
  );

  items.sort(sortItemsFn);

  return {
    type: 'group',
    value: currentKey,
    label: currentKey,
    items,
  };
}

function getChordQuality(chordType: ChordType) {
  if (chordType.quality === 'Unknown') return 'Suspended / No 3rd';

  if (chordType.quality === 'Major') {
    if (containsInterval(chordType, '7m')) {
      return 'Dominant';
    }
  }

  if (chordType.quality === 'Minor') {
    if (containsInterval(chordType, '7M')) {
      return 'Minor/Major';
    }
    return 'Minor';
  }

  return chordType.quality;
}

function buildGroupObject(
  obj: GroupObject | ChordType[],
  path: string[],
  value: ChordType
): GroupObject | ChordType[] {
  if (path.length === 0) {
    if (obj) {
      if (Array.isArray(obj)) {
        obj.push(value);
        return obj;
      }
      obj.items = (obj.items ?? []) as ChordType[];
      obj.items.push(value);

      return obj;
    }
    return { items: [value] };
  }

  const [key, ...nextPath] = path;

  // eslint-disable-next-line no-param-reassign
  obj = (obj ?? {}) as GroupObject;

  // eslint-disable-next-line no-param-reassign
  obj[key] = buildGroupObject(obj[key], nextPath, value);

  return obj;
}

function getChordIntervals(chordType: ChordType) {
  const intervals = [];

  if (containsInterval(chordType, '3m')) {
    intervals.push('Minor 3rd');
  } else if (containsInterval(chordType, '3M')) {
    intervals.push('Major 3rd');
  } else {
    intervals.push('No 3rd / Suspended');
  }

  if (containsInterval(chordType, '5P')) {
    intervals.push('Perfect 5th');
  } else if (containsInterval(chordType, '5d')) {
    intervals.push('Diminished 5th');
  } else if (containsInterval(chordType, '5A')) {
    intervals.push('Augmented 5th');
  } else {
    intervals.push('No 5th');
  }

  if (containsInterval(chordType, '7m')) {
    intervals.push('Minor 7th');
  } else if (containsInterval(chordType, '7M')) {
    intervals.push('Major 7th');
  } else {
    intervals.push('No 7th');
  }

  return intervals;
}

export function getChordGroups(
  group: keyof typeof groupValues,
  keySignature: KeySignatureConfig,
  chroma: number | null,
  filterChordsInKey: boolean
): (ChordGroup | ChordItem)[] {
  const chordTypes = filterChordsInKey ? getChordsInKey(keySignature, chroma) : getChordTypes();

  if (group === 'none') {
    return chordTypes.map((chordType) => ({
      type: 'item',
      chordType,
    }));
  }

  if (group === 'quality') {
    const groups = chordTypes.reduce<GroupObject | ChordType[]>((g, c) => {
      const quality = getChordQuality(c);

      g = buildGroupObject(g, [quality], c);

      return g;
    }, {} as GroupObject);

    const chordGroup = groupObjectToChordGroup(groups);

    return Array.isArray(chordGroup) ? chordGroup : chordGroup.items;
  }
  if (group === 'intervals') {
    const groups = chordTypes.reduce<GroupObject | ChordType[]>((g, c) => {
      const intervals = getChordIntervals(c);

      g = buildGroupObject(g, intervals, c);

      return g;
    }, {} as GroupObject);

    const chordGroup = groupObjectToChordGroup(groups);

    return Array.isArray(chordGroup) ? chordGroup : chordGroup.items;
  }

  return [];
}
