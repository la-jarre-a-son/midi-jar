import React from 'react';

import { ListItem, bindClassNames, forwardRefWithAs, SelectOption } from '@la-jarre-a-son/ui';

import { ChordName } from 'renderer/components';

import { ChordSearchOptionProps } from './types';

import styles from './ChordSearch.module.scss';

const cx = bindClassNames(styles);

export const ChordSearchOption = forwardRefWithAs<ChordSearchOptionProps, typeof ListItem>(
  (props, ref) => {
    const { chord, parts, onSelect, selected, className, ...otherProps } = props;
    const value = chord.tonic + (chord.aliases[0] || 'maj');

    return (
      <SelectOption
        ref={ref}
        className={cx(parts ? 'option' : 'history', className)}
        value={value}
        onSelect={onSelect}
        selected={selected}
        {...otherProps}
      >
        <ChordName chord={chord} />
        {parts && (
          <div className={cx('resultParts')}>
            <span className={cx('resultMatch')}>{parts[0]}</span>
            <span className={cx('resultRest')}>{parts[1]}</span>
          </div>
        )}
      </SelectOption>
    );
  }
);

ChordSearchOption.displayName = 'ChordSearchOption';

export default React.memo(ChordSearchOption);
