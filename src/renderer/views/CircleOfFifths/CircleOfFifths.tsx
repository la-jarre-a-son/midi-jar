import React, { useCallback } from 'react';
import classnames from 'classnames/bind';

import CircleFifths from 'renderer/components/CircleFifths';
import { useSettings } from 'renderer/contexts/Settings';
import useNotes from 'renderer/hooks/useNotes';
import { defaults } from 'main/settings/schema';
import ChordName from 'renderer/components/ChordName';

import styles from './CircleOfFifths.module.scss';

const cx = classnames.bind(styles);

type Props = {
  className?: string;
  disableUpdate?: boolean;
};

const defaultProps = {
  className: undefined,
  disableUpdate: false,
};

const CircleOfFifths: React.FC<Props> = ({ className, disableUpdate }) => {
  const { settings, updateSetting } = useSettings();

  const key = settings?.notation.key || defaults.settings.notation.key;
  const { chords, pitchClasses, keySignature } = useNotes({
    key,
    midiChannel: 0,
  });

  const handleKeyChange = useCallback(
    (newKey: string) => {
      return updateSetting(`notation.key`, newKey);
    },
    [updateSetting]
  );

  if (!settings) return null;

  const config = settings.circleOfFifths ?? defaults.settings.circleOfFifths;

  return (
    <div className={cx('base')}>
      <CircleFifths
        className={className}
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

CircleOfFifths.defaultProps = defaultProps;

export default CircleOfFifths;
