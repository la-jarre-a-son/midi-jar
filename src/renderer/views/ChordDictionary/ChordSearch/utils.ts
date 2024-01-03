import { getChordTypes, tokenizeChord } from 'renderer/helpers';
import { Chord } from 'tonal';
import { ChordSearchResult } from './types';

export function cleanupText(text: string) {
  if (!text) return '';

  const capitalized = text.charAt(0).toUpperCase() + text.slice(1);

  return capitalized
    .replace(/ /g, '')
    .replace(/♭/gi, 'b')
    .replace(/♯/gi, '#')
    .replace(/maj/gi, 'maj')
    .replace(/min/gi, 'min')
    .replace(/sus/gi, 'sus')
    .replace(/dom/gi, 'dom')
    .replace(/dim/gi, 'dim')
    .replace(/aug/gi, 'aug')
    .replace(/add/gi, 'add')
    .replace(/\^/g, 'Δ')
    .replace(/°/g, 'o');
}

export function searchChords(searchText: string): ChordSearchResult[] {
  try {
    const [tonic, type, root] = tokenizeChord(cleanupText(searchText));

    if (!type) {
      const chord = Chord.getChord('maj', tonic, root);
      if (chord) {
        return [{ chord, parts: [tonic, 'maj'] }];
      }
    }

    const matches = getChordTypes()
      .reduce<ChordSearchResult[]>((m, c) => {
        const match = c.aliases.reduce<string | undefined>((found, a) => {
          if (a === type) {
            return a;
          }
          if (!found && a.startsWith(type)) {
            return a;
          }
          return found;
        }, undefined);

        if (match) {
          const parts: [string, string] = [
            tonic + match.slice(0, type.length),
            match.slice(type.length),
          ];

          const chord = Chord.getChord(c.aliases[0], tonic, root);
          if (chord.tonic) {
            if (parts[1]) {
              m.push({
                chord,
                parts,
              });
            } else {
              m.unshift({
                chord,
                parts,
              });
            }
          }
        }

        return m;
      }, [])
      .slice(0, 10);

    return matches;
  } catch (err) {
    return [];
  }
}
