import {
  formatSharpsFlats,
  getPreferredNoteName,
  setNoteNamingPreference,
} from 'renderer/helpers/note';

describe('note naming preference', () => {
  afterEach(() => setNoteNamingPreference('auto', 'C'));

  it('converts sharp spellings to flats while preserving chord suffixes and octaves', () => {
    expect(getPreferredNoteName('A#4', 'flat')).toBe('Bb4');
    expect(getPreferredNoteName('D#maj7', 'flat')).toBe('Ebmaj7');
  });

  it('converts flat spellings to sharps', () => {
    expect(getPreferredNoteName('Bb', 'sharp')).toBe('A#');
    expect(getPreferredNoteName('Eb7', 'sharp')).toBe('D#7');
  });

  it('leaves natural and theoretical spellings unchanged', () => {
    expect(getPreferredNoteName('E#', 'flat')).toBe('E#');
    expect(getPreferredNoteName('Cb', 'sharp')).toBe('Cb');
    expect(getPreferredNoteName('C', 'flat')).toBe('C');
  });

  it('uses flats in Auto mode for C major / A minor', () => {
    setNoteNamingPreference('auto', 'C');
    expect(getPreferredNoteName('A#')).toBe('Bb');
  });

  it('uses sharps in Auto mode for sharp key signatures', () => {
    setNoteNamingPreference('auto', 'G');
    expect(getPreferredNoteName('Bb')).toBe('A#');
  });

  it('uses flats in Auto mode for flat key signatures', () => {
    setNoteNamingPreference('auto', 'F');
    expect(getPreferredNoteName('A#')).toBe('Bb');
  });

  it('uses the selected preference in the formatted note display', () => {
    setNoteNamingPreference('flat', 'C');
    expect(formatSharpsFlats('A#')).toBe('B♭');
  });
});
