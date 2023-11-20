/**
 * @private
 * Chord List
 * Source: https://en.wikibooks.org/wiki/Music_Theory/Complete_List_of_Chord_Patterns
 * Format: ["intervals", "full name", "abrv1 abrv2"]
 * Wildcard intervals: possible ommisions in voicing
 * Abbreviations order:
 *   - Long notation
 *   - Short notation
 *   - Symbolic notation
 *   - Other names
 */
const CHORDS: string[][] = [
  // ==Intervals==
  ['1P 5P', 'fifth', '5'],

  // ==Major==
  // '''Normal'''
  ['1P 3M 5P', 'major', '   maj M'],
  ['1P 3M 5P* 7M', 'major seventh', 'maj7 M7 Δ7 Δ'],
  ['1P 3M 5P* 7M 9M', 'major ninth', 'maj9 M9 Δ9'],
  ['1P 3M 5P* 7M 9M* 11M', 'major eleventh', 'maj11 M11 Δ11'],
  ['1P 3M 5P* 7M 9M* 11M* 13M', 'major thirteenth', 'maj13 M13 Δ13'],

  ['1P 2M 3M 5P*', 'major second', 'majadd2 add2 2 Madd2 majadd9 Madd9 add9'],
  ['1P 2m 3M 5P*', 'major added flat second', 'majaddb2 addb2 addb2 Maddb2 majaddb9 Maddb9 addb9'],
  ['1P 3M 4P 5P*', 'major added fourth', 'majadd4 add4 add4 Madd4 majadd11 Madd11 add11'],
  ['1P 3M 4A 5P*', 'major added sharp fourth', 'majadd#4 add#4 add#4 Madd#4 majadd#11 Madd#11 add#11'],

  ['1P 3M 5P* 6M', 'major sixth', 'maj6 6 6 M6 add6 majadd13 Madd13 add13'],
  ['1P 3M 5P* 6m', 'major added flat sixth', 'majaddb6 addb6 addb6 Maddb6 majaddb13 Maddb13 addb13'],
  ['1P 3M 5P* 6M 9M', 'major sixth ninth', 'maj6/9 6/9 69 6add9 M69'],
  ['1P 3M 5P* 6M 11P', 'major sixth added eleventh', 'maj6add11 M6add11 6add11'],
  ['1P 3M 5P* 6M 9M* 11P', 'major sixth eleventh', 'maj6/11 6/11 6/11 maj6/13 6/13 6/13'],
  ['1P 3M 5P* 6M 11A', 'major sixth added sharp eleventh', 'maj6#11 M6#11 6#11 6b5 M6b5 6#4'],
  ['1P 3M 5P* 6M 9M 11A', 'sixth ninth added sharp eleventh', 'maj6/9add#11 6/9add#11 69#11'],

  ['1P 3M 5P* 7M 11P', 'major seventh added eleventh', 'maj7add11 M7add11 Δ7add11 Δadd11'],
  ['1P 3M 5P* 7M 11A', 'major seventh added sharp eleventh', 'maj7add#11 M7add#11 Δadd#11 majadd#4 Δadd#4'],
  ['1P 3M 5P* 7M 13M', 'major seventh added thirteenth', 'maj7add13 M7add13 Δ7add13'], // removed 9M
  ['1P 3M 5P* 7M 13m', 'major seventh added flat thirteenth', 'maj7addb13 M7addb13 Δ7addb13'],

  // '''Diminished'''
  ['1P 3M 5d', 'major diminished fifth', 'majb5 Mb5'], // sources needed
  ['1P 3M 5d 7M', 'major seventh diminished fifth', 'maj7b5 M7b5 Δ7b5 Δb5'],
  ['1P 3M 5d 7M 9M', 'major ninth diminished fifth', 'maj9b5 M9b5 Δ9b5'],

  // '''Altered'''
  // ['1P 3M 6m 7M', 'major seventh flat sixth', 'maj7b6 M7b6 Δ7b6'], // Source needed
  ['1P 3M 5P* 7M 9A', 'major sharp ninth', 'maj#9 M#9 Δ#9 maj7#9 M7#9 Δ7#9'],
  ['1P 3M 5P* 7M 9m', 'major flat ninth', 'majb9 Mb9 Δb9 maj7b9 M7b9 Δ7b9'],
  ['1P 3M 5P* 7M 9M* 11A', 'major sharp eleventh', 'maj#11 M#11 Δ#11 maj9#11 M9#11 Δ9#11'],

  ['1P 3M 5P* 7M 9M 9A', 'major ninth added sharp ninth', 'maj9#9 M9#9 Δ9#9'],
  ['1P 3M 5P* 7M 9m 9A', 'major flat ninth added sharp ninth', 'majb9#9 Mb9#9 Δb9#9 maj7b9#9 M7b9#9 Δ7b9#9'],
  ['1P 3M 5P* 7M 9A 11A', 'major seventh added sharp ninth added sharp eleventh', 'maj7#9#11 M7#9#11 Δ7#9#11 Δ#9#11'], // same as minmaj7b11#11
  ['1P 3M 5P* 7M 9m 11A', 'major sharp eleventh added flat ninth', 'maj#11b9 M#11b9 Δ#11b9 Δb9#11 maj7b9#11 M7b9#11 Δ7b9#11 Δb9#11'],

  ['1P 3M 5P* 7M 9A 11P', 'major eleventh sharp ninth', 'maj11#9 M11#9 Δ11#9'], // same as minmaj11b11
  ['1P 3M 5P* 7M 9m 11P', 'major eleventh flat ninth', 'maj11b9 M11b9 Δ11b9'],

  ['1P 3M 5P* 7M 9M* 11A 13M', 'major thirteenth sharp eleventh', 'maj13#11 M13#11 Δ13#11 maj13#4 M13#4 Δ13#4'],

  // ==Minor==
  // '''Normal'''
  ['1P 3m 5P', 'minor', 'min m -'],
  ['1P 3m 5P* 7m', 'minor seventh', 'min7 m7 -7'],
  ['1P 3m 5P* 6M', 'minor sixth', 'min6 m6 -6'],
  ['1P 3m 5P* 7m 9M', 'minor ninth', 'min9 m9 -9'],
  ['1P 3m 5P* 7m 9M* 11P', 'minor eleventh', 'min11 m11 -11'],
  ['1P 3m 5P* 7m 9M* 11P* 13M', 'minor thirteenth', 'min13 m13 -13'],

  ['1P 2m 3m 5P*', 'minor added flat second', 'minaddb2 maddb2 -addb2 minaddb9 maddb9 -addb9'],
  ['1P 3m 5P* 9M', 'minor added ninth', 'minadd9 madd9 -add9'],
  ['1P 3m 5P* 6M 9M', 'minor sixth ninth', 'min6/9 m6/9 -6/9 min69 m69 -69'],
  ['1P 3m 4P 5P*', 'minor added fourth', 'minadd4 madd4 -add4 minadd11 madd11 -add11 sus4addb3'],
  ['1P 3m 5P* 7m 11P', 'minor seventh added eleventh', 'min7add11 m7add11 -7add11 min7add4 m7add4 -7add4'],
  ['1P 3m 5P* 6m', 'minor added flat sixth', 'minaddb6 maddb6 -addb6 minb6 mb6 -b6'],
  ['1P 3m 5P* 6m 9m', 'minor added flat sixth added flat ninth', 'minaddb6addb9 maddb6addb9 -addb6addb9 minb6b9 mb6b9 -b6b9'],

  // '''Augmented'''
  ['1P 3m 5A', 'minor augmented fifth', 'min#5 m#5 -#5 m+'],
  ['1P 3m 5A 7m', 'minor seventh augmented fifth', 'min7#5 m7#5 -7#5'],
  ['1P 3m 5A 7m 9M', 'minor ninth augmented fifth', 'min9#5 m9#5 -9#5'],
  ['1P 3m 5A 7m 9M* 11P', 'minor eleventh augmented fifth', 'min11#5 m11#5 -11#5'],
  ['1P 3m 5A 7m 9M* 11P* 13M', 'minor thirteenth augmented fifth', 'min13#5 m13#5 -13#5'],

  // '''Altered'''
  ['1P 3m 5P* 7m 9m', 'minor flat ninth', 'minb9 mb9 -b9 min7b9 m7b9 -7b9'],
  ['1P 3m 5P* 7m 9M* 11d', 'minor flat eleventh', 'minb11 mb11 -b11 min9b11 m9b11 -9b11'],
  ['1P 3m 5P* 7m 9M* 11A', 'minor sharp eleventh', 'min#11 m#11 -#11 min#11 m9#11 -9#11'],

  ['1P 3m 5P* 7m 11A', 'minor seventh sharp eleventh', 'min7#11 m7#11 -7#11'],
  ['1P 3m 5P* 7m 11d 11A', 'minor seventh flat eleventh sharp eleventh', 'min7b11#11 m7b11#11 -7b11#11'],
  ['1P 3m 5P* 7m 11d 11A 13m', 'minor seventh flat eleventh sharp eleventh', 'min7b11#11b13 m7b11#11b13 -7b11#11b13'],
  ['1P 3m 5P* 7m 9M* 11d 11P', 'minor eleventh flat eleventh', 'min11b11 m11b11 -11b11'],
  ['1P 3m 5P* 7m 9M* 11P* 13m', 'minor eleventh flat thirteenth', 'min11b13 m11b13 -11b13'],

  // ==Minor/Major==
  // '''Normal'''
  ['1P 3m 5P* 7M', 'minor/major seventh', 'minmaj7 mM7 -Δ7 -Δ -M7 mΔ mΔ7 mMaj7 m/ma7 m/maj7 m/M7'],
  ['1P 3m 5P* 7M 9M', 'minor/major ninth', 'minmaj9 mM9 -Δ9 -M9 mΔ9 mMaj9 m/ma9 m/maj9 m/M9'],
  ['1P 3m 5P* 7M 9M* 11P', 'minor/major eleventh', 'minmaj11 mM11 -Δ11 -M11 mΔ11 mMaj11 m/ma11 m/maj11 m/M11'],
  ['1P 3m 5P* 7M 9M* 11P* 13M', 'minor/major thirteenth', 'minmaj13 mM13 -Δ13 -M13 mΔ13 mMaj13 m/ma13 m/maj13 m/M13'],

  // '''Augmented'''
  ['1P 3m 5A 7M', 'minor/major seventh augmented fifth', 'minmaj7#5 mM7#5 -Δ7#5'],
  ['1P 3m 5P* 7M 13m', 'minor/major seventh added flat thirteenth', 'minmaj7addb13 mM7addb13 -Δ7addb13 minmaj7addb6 mM7addb6 -Δ7addb6'],
  ['1P 3m 5P* 7M 9M 13m', 'minor/major ninth added flat thirteenth', 'minmaj9addb13 mM9addb13 -Δ9addb13 minmaj9addb6 mM9addb6 -Δ9addb6'],
  ['1P 3m 5P* 7M 9M* 11P 13m', 'minor/major eleventh added flat thirteenth', 'minmaj11addb13 mM11addb13 -Δ11addb13 minmaj11addb6 mM11addb6 -Δ11addb6'],

  // '''Altered'''
  ['1P 3m 5P* 7M 9m', 'minor/major seventh added flat ninth', 'minmaj7b9 mM7b9 -Δ7b9'],
  ['1P 3m 5P* 7M 11P', 'minor/major seventh added eleventh', 'minmaj7add11 mM7add11 -Δ7add11 -Δadd11 -M7add11 mΔadd11 mΔ7add11 mMaj7add11'],
  ['1P 3m 5P* 7M 9M* 11d', 'minor/major seventh added flat eleventh', 'minmaj7b11 mM7b11 -Δ7b11 mMaj7b11'], // same as maj9#9
  ['1P 3m 5P* 7M 11A', 'minor/major seventh added sharp eleventh', 'minmaj7#11 mM7#11 -Δ7#11 mMaj7#11'], // could add 9M* but will transform to mM9#11
  ['1P 3m 5P* 7M 9M 11A', 'minor/major ninth added sharp eleventh', 'minmaj9#11 mM9#11 -Δ9#11 mMaj9#11'],
  ['1P 3m 5P* 7M 11d 11A', 'minor/major seventh added flat eleventh added sharp eleventh', 'minmaj7b11#11 mM7b11#11 -Δ7b11#11 mMaj7b11#11'],
  ['1P 3m 5P* 7M 9M 11d 11A', 'minor/major ninth added flat eleventh added sharp eleventh', 'minmaj9b11#11 mM9b11#11 -Δ9b11#11 mMaj9b11#11'],
  ['1P 3m 5P* 7M 9M* 11d 11P', 'minor/major eleventh added flat eleventh', 'minmaj11b11 mM11b11 -Δ11b11 -M11b11 mΔ11b11 mMaj11b11 m/ma11b11 m/maj11b11 m/M11b11'],

  // ==Diminished==
  ['1P 3m 5d', 'diminished', 'dim dim o °'],
  ['1P 3m 5d 7d', 'diminished seventh', 'dim7 dim7 o7 °7'],
  ['1P 3m 5d 7M', 'diminished major seventh', 'dimmaj7 dimM7 oM7 minmaj7b5 mM7b5'],
  ['1P 3m 5d 7d 7M', 'diminished seventh major seventh', 'dim7maj7 dim7M7 o7M7 °7M7'],

  ['1P 3m 5d 7m', 'half-diminished', 'min7b5 m7b5 ø ø7 -7b5 -7o5 min7dim5'],
  ['1P 3m 5d 7m 9M', 'half-diminished ninth', 'min9b5 m9b5 ø9 -9b5 -9o5 min9dim5'],
  ['1P 3m 5d 7m 9m', 'half-diminished flat ninth', 'min7b5b9 m7b5b9 øb9 -b9b5 -b9o5 minb9dim5'],
  ['1P 3m 5d 7m 9M* 11P', 'half-diminished eleventh', 'min11b5 m11b5 ø11 -11b5 -11o5 min11dim5'],

  // ==Dominant==
  // '''Normal'''
  ['1P 3M 5P* 7m', 'dominant seventh', 'dom7 7 7 dom'],
  ['1P 3M 5P* 7m 9M', 'dominant ninth', 'dom9 9 9'],
  ['1P 3M 5P* 7m 9M* 11P', 'dominant eleventh', 'dom11 11 11'],
  ['1P 3M 5P* 7m 9M* 11P* 13M', 'dominant thirteenth', 'dom13 13 13'],

  // '''Altered'''
  ['1P 3M 5d 7m', 'dominant seventh flat fifth', 'dom7b5 7b5'],
  ['1P 3M 5d 7m 9M', 'dominant ninth flat fifth', 'dom9b5 9b5'],
  ['1P 3M 5d 7m 9M* 11P', 'dominant eleventh flat fifth', 'dom11b5 11b5'],
  ['1P 3M 5d 7m 9M* 11P* 13M', 'dominant thirteenth flat fifth', 'dom13b5 13b5'],

  ['1P 3M 5P* 7m 13M', 'dominant seventh added sixth', 'dom7add6 7add6 7add6 dom7add13 7add13 6/7'],
  ['1P 3M 5P* 7m 11P', 'dominant seventh added eleventh', 'dom7add11 7add11 7add11 dom7add4 7add4'],
  ['1P 3M 5P* 7m 11A', 'dominant seventh sharp eleventh', 'dom7add#11 7add#11 7#11 dom7add#4 7add#4 7#4'],
  ['1P 3M 5P* 7m 13m', 'dominant seventh added flat thirteenth', 'dom7addb13 7addb13 7b13 dom7addb6 7addb6 7b6'],
  ['1P 3M 5P* 7m 9M 11A', 'dominant ninth added sharp eleventh', 'dom9#11 9#11 9#11 dom9#4 9#4'],
  ['1P 3M 5P* 7m 9M 13m', 'dominant ninth added flat thirteenth ', 'dom9addb13 9addb13 9b13 dom9addb6 9addb6 9b6'],

  ['1P 3M 5P* 7m 9m', 'dominant flat ninth', 'dom7b9 7b9'],
  ['1P 3M 5P* 7m 9A', 'dominant sharp ninth', 'dom7#9 7#9'],
  ['1P 3M 5P* 7m 9m 9A', 'dominant flat ninth added sharp ninth ', 'dom7b9#9 7b9#9 7b9#9 dom7b9add#9'],

  ['1P 3M 5P* 7m 9m 11A', 'dominant flat ninth sharp eleventh', 'dom7b9#11 7b9#11 7b9#11 7b5b9 7b9b5'],
  ['1P 3M 5P* 7m 9m 13m', 'dominant flat ninth added flat thirteenth', 'dom7b9b13 7b9b13'],
  ['1P 3M 5P* 7m 9m 11A 13m', 'dominant flat ninth sharp eleventh flat thirteenth', 'dom7b9#11b13 7b9#11b13 7#11b9b13 dom7#11b9b13 7b5b9b13'],
  ['1P 3M 5P* 7m 9A 11A', 'dominant sharp ninth sharp eleventh', 'dom7#9#11 7#9#11 7b5#9 7#9b5 dom7#9addb5'], // same as m7b11#11
  ['1P 3M 5P* 7m 9A 13m', 'dominant sharp ninth flat thirteenth', 'dom7#9b13 7#9b13'],
  ['1P 3M 5P* 7m 11A 13m', 'dominant seventh sharp eleventh flat thirteenth', 'dom7#11b13 7#11b13 7#11b13 7b5b13'],
  ['1P 3M 5P* 7m 9M 11A 13m', 'dominant ninth sharp eleventh flat thirteenth', 'dom9#11b13 9#11b13 9#11b13 dom9add#11addb13 9b5b13'],

  ['1P 3M 5P* 7m 9m 11P', 'dominant eleventh flat ninth', 'dom11b9 11b9'],
  ['1P 3M 5P* 7m 9M* 11P 13m', 'dominant eleventh flat thirteenth', 'dom11b13 11b13'],

  ['1P 3M 5P* 7m 9m 11P* 13M', 'dominant thirteenth flat ninth', 'dom13b9 13b9'],
  ['1P 3M 5P* 7m 9A 11P* 13M', 'dominant thirteenth sharp ninth', 'dom13#9 13#9'],
  ['1P 3M 5P* 7m 9M* 11A 13M', 'dominant thirteenth sharp eleventh', 'dom13#11 13#11 13#11 13#4'],
  ['1P 3M 5P* 7m 9m 11A 13M', 'dominant thirteenth flat ninth sharp eleventh', 'dom13b9#11 13b9#11'],
  ['1P 3M 5P* 7m 9A 11A 13M', 'dominant thirteenth sharp ninth sharp eleventh', 'dom13#9#11 13#9#11'],

  // ==Suspended==
  ['1P 4P 5P', 'suspended fourth', 'sus4 sus4 sus4 sus'],
  ['1P 2M 5P', 'suspended second', 'sus2 sus2 sus2'],
  ['1P 2M 4P 5P', 'suspended second suspended fourth', 'sus2sus4 sus24 sus24 sus4add9'],

  // '''Major Suspended'''
  ['1P 2M 5P* 7M', 'major seventh suspended second', 'sus2maj7 sus2M7 sus2Δ7 maj7sus2 M7sus2 Δ7sus2 maj9sus2 M9sus2 Δ9sus2'],
  ['1P 4P 5P* 7M', 'major seventh suspended fourth', 'sus4maj7 sus4M7 sus4Δ7 maj7sus4 M7sus4 Δsus4 sus7 Δ7sus4 sus4add7'],
  ['1P 2M 5P* 7M 11P', 'major eleventh suspended second', 'sus2maj11 sus2M11 sus2Δ11 maj11sus2 M11sus2 Δ11sus2 maj9sus4 M9sus4 Δ9sus4'],
  ['1P 2M 5P* 7M 13M', 'major seventh suspended second added thirteen', 'sus2maj7add13 sus2M7add13 sus2Δ7add13 maj13sus2 M13sus2 Δ13sus2'],
  ['1P 4P 5P* 7M 9M* 13M', 'major thirteenth suspended fourth', 'sus4maj13 sus4M13 sus4Δ13 maj13sus4 M13sus4 Δ13sus4 maj11sus4 M11sus4 Δ11sus4'],

  // '''Dominant Suspended'''
  ['1P 2M 5P* 7m', 'dominant seventh suspended second', 'dom7sus2 7sus2 7sus2 sus2dom7'],
  ['1P 4P 5P* 7m', 'dominant seventh suspended fourth', 'dom7sus4 7sus4 7sus4 7sus sus4dom7'], // can be noted as C11 too with omissions...
  ['1P 4P 5P* 7m* 9M', 'dominant ninth suspended fourth', 'dom9sus4 9sus4 9sus4 9sus'],
  ['1P 4P 5P* 7m 9m', 'dominant suspended fourth flat ninth', 'dom7sus4b9 7sus4b9 7sus4b9 7susb9 7b9sus4 7b9sus'], // removed b9sus, because C(b9)(sus) was interpreted as Cb9sus => B9sus (which is wrong)
  ['1P 4P 5P* 7m 9m 13m', 'dominant seventh suspended fourth flat ninth added flat thirteenth', 'dom7sus4b9b13 7sus4b9b13 7sus4b9b13 7b9b13sus4'],
  ['1P 2m 5P* 7m 9M* 11P', 'dominant eleventh suspended flat second', 'dom11susb2 11susb2 11susb2 susb2dom11'],
  ['1P 2m 5P* 7m 9M* 11P 13m', 'dominant eleventh suspended flat second added flat thirteenth', 'dom11susb2b13 11susb2b13 11susb2b13 susb2dom11b13'],
  ['1P 3M 5P* 7m 9A 11A 13m', 'dominant seventh added sharp ninth sharp eleventh flat thirteenth', 'dom7#9#11b13 7#9#11b13'], // same as min7b11#11b13
  ['1P 4P 5P* 7m 9M* 13M', 'dominant thirteenth suspended fourth', 'dom13sus4 13sus4 13sus sus4dom13'],
  ['1P 4P 5P 5A 7m', 'dominant seventh suspended fourth flat thirteenth', 'dom7sus4addb13 7sus4addb13 7sus4b13 dom7sus4addb6 7sus4addb6 7sus4b6 aug7sus4 +7sus4 dom7#5sus4 7#5sus4'], // debatable notation

  // ==Augmented==
  ['1P 3M 5A', 'augmented', 'aug aug + +5 M#5'],

  ['1P 3M 5A 7m', 'augmented dominant seventh', 'aug7 aug7 +7 7+ 7aug 7#5'],
  ['1P 3M 5A 7m 9M', 'augmented dominant ninth', 'aug9 aug9 +9 9+ 9#5'],
  ['1P 3M 5A 7m 9M* 11P', 'augmented dominant eleventh', 'aug11 aug11 +11 11+ 11#5'],
  ['1P 3M 5A 7m 9M* 11P* 13M', 'augmented dominant thirteenth', 'aug13 aug13 +13 13+ 13#5'],

  ['1P 3M 5A 7M', 'augmented major seventh', 'augmaj7 augM7 +Δ7 maj7#5 M7#5 M7+5 +M7'],
  ['1P 3M 5A 7M 9M', 'augmented major ninth', 'augmaj9 augM9 +Δ9 maj9#5 M9#5'],

  // '''Altered'''
  ['1P 3M 5A 9m', 'augmented added flat ninth', 'augaddb9 augaddb9 +addb9 augaddb2'],
  ['1P 3M 5A 9M', 'augmented added ninth', 'augadd9 augadd9 +add9 augadd2'],
  ['1P 3M 5A 9A', 'augmented added sharp ninth', 'augadd#9 augadd#9 +add#9 augadd#2'],

  ['1P 3M 5A 7M 9m', 'augmented major seventh flat ninth', 'augmaj7b9 augM7b9 +Δb9 maj7#5b9 M7#5b9 +M7b9 Δ#5b9'],
  ['1P 3M 5A 7M 9A', 'augmented major seventh sharp ninth', 'augmaj7#9 augM7#9 +Δ#9 maj7#5#9 M7#5#9 +M7#9 Δ#5#9'],
  ['1P 3M 5A 7m 9m', 'augmented dominant flat ninth', 'aug7b9 augb9 +b9 +7b9 7#5b9 7b9#5'],
  ['1P 3M 5A 7m 9A', 'augmented dominant sharp ninth', 'aug7#9 aug#9 +#9 +7#9 7#5#9 7#9#5'],
  ['1P 3M 5A 7m 9m 11A', 'augmented dominant sharp eleventh flat ninth', 'aug7b9#11 aug7b9#11 +7b9#11 dom7#5b9#11 7#5b9#11 aug7#11b9'],
  ['1P 3M 5A 7m 9M 11A', 'augmented ninth sharp eleventh', 'aug9#11 aug9#11 +9#11 dom9#5#11 9#5#11'],

  ['1P 4P 5A 7M', 'augmented major seventh suspended fourth', 'augsus4add7 augsus4M7 +Δ7sus4 maj7#5sus4 M7#5sus4 Δ7#5sus4'],
  ['1P 4P 5A 7M 9M', 'augmented major ninth suspended fourth', 'augmaj9sus4 augM9sus4 +Δ9sus4 maj9#5sus4 M9#5sus4 Δ9#5sus4'],
  ['1P 2M 5A 7M 11P', 'augmented major eleventh suspended second', 'augmaj11sus2 augM11sus2 +Δ11sus2 maj11#5sus2 M11#5sus2 Δ11#5sus2'], // same as augmaj9sus4
];

export default CHORDS;
