import React, { useCallback } from 'react';
import classnames from 'classnames/bind';

import { useSettings } from 'renderer/contexts/Settings';
import useNotes from 'renderer/hooks/useNotes';
import { CircleFifths, ChordName } from 'renderer/components';

import styles from './CircleOfFifths.module.scss';

const cx = classnames.bind(styles);

type Props = {
  disableUpdate?: boolean;
};

const CircleOfFifths: React.FC<Props> = ({ disableUpdate }) => {
  const { settings, updateSetting } = useSettings();

  const { key } = settings.notation;
  const {
    chords,
    pitchClasses,
    params: { keySignature },
  } = useNotes({
    key,
    midiChannel: 0,
    disabledChords: settings.chordDictionary.disabled,
  });

  const handleKeyChange = useCallback(
    (newKey: string) => {
      return updateSetting(`notation.key`, newKey);
    },
    [updateSetting]
  );

  if (!settings) return null;

  const config = settings.circleOfFifths;

  return (
    <div className={cx('base')}>
      <CircleFifths
        keySignature={keySignature}
        chord={chords[0]}
        notes={pitchClasses}
        onChange={disableUpdate ? undefined : handleKeyChange}
        config={config}
      >
        <div id="chord" className={cx('chord')}>
          <ChordName chord={chords[0]} hideRoot />
        </div>
      </CircleFifths>
    </div>
  );
};

CircleOfFifths.defaultProps = {
  disableUpdate: false,
};

export default CircleOfFifths;
