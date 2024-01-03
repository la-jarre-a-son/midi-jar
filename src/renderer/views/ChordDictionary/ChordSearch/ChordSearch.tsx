import React, { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames/bind';
import { Chord } from 'tonal';
import { Chord as TChord } from '@tonaljs/chord';
import {
  Input,
  SelectTrigger,
  Select,
  Icon,
  ListGroup,
  SelectOption,
  Typography,
} from '@la-jarre-a-son/ui';

import { isSameChord } from 'renderer/helpers';

import { ChordSearchProps } from './types';
import { searchChords } from './utils';
import { ChordSearchOption } from './ChordSearchOption';

import styles from './ChordSearch.module.scss';

const cx = classNames.bind(styles);

export const ChordSearch: React.FC<ChordSearchProps> = ({ className, onSelect }) => {
  const [search, setSearch] = useState<string>('');
  const [previousChords, setPreviousChords] = useState<TChord[]>([]);

  const options = useMemo(() => searchChords(search), [search]);

  const handleSelect = useCallback(
    (val: string | null) => {
      if (val) {
        onSelect(val);
        const chord = Chord.get(val);
        setPreviousChords((prev) =>
          [chord, ...prev.filter((c) => !isSameChord(c, chord))].slice(0, 10)
        );
      }
    },
    [onSelect]
  );

  return (
    <Select
      className={cx('trigger', className)}
      dropdownProps={{
        placement: 'bottom-end',
        matchWidth: false,
        limitHeight: true,
        onOpen: () => {
          setSearch('');
        },
        disableAutoFocus: true,
      }}
      placeholder="Search Chord"
      navOptions={{
        itemQuerySelector: '[role="option"], input',
        disableSearchNav: true,
      }}
      renderInput={({ selectTriggerProps }) => (
        <SelectTrigger
          {...selectTriggerProps}
          containerProps={{ ...selectTriggerProps.containerProps, left: <Icon name="search" /> }}
          value=""
        />
      )}
      listProps={{
        className: cx('popover'),
        as: 'div',
      }}
    >
      <>
        <div className={cx('searchContainer')}>
          <Input
            placeholder="Type chord..."
            block
            aria-label="Type chord"
            left={<Icon name="search" />}
            onChange={setSearch}
            autoFocus
          />
        </div>
        <ul>
          <ListGroup header={search ? 'matches' : 'previous chords'}>
            {search ? (
              <>
                {options.map((option) => (
                  <ChordSearchOption
                    key={option.chord.tonic + option.chord.aliases[0]}
                    chord={option.chord}
                    parts={option.parts}
                    onSelect={handleSelect}
                  />
                ))}
                {!options.length && (
                  <SelectOption className={cx('empty')} tabIndex={undefined} interactive={false}>
                    <Typography intent="placeholder">No chords found</Typography>
                  </SelectOption>
                )}
              </>
            ) : (
              <>
                {previousChords &&
                  previousChords.map((chord) => (
                    <ChordSearchOption
                      key={chord.tonic + chord.aliases[0]}
                      chord={chord}
                      onSelect={handleSelect}
                    />
                  ))}
                {(!previousChords || !previousChords.length) && (
                  <SelectOption className={cx('empty')} tabIndex={undefined} interactive={false}>
                    <Typography intent="placeholder">No chords in history</Typography>
                  </SelectOption>
                )}
              </>
            )}
          </ListGroup>
        </ul>
      </>
    </Select>
  );
};

ChordSearch.defaultProps = {
  className: undefined,
};

export default ChordSearch;
