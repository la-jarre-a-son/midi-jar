import React from 'react';
import classnames from 'classnames/bind';

import { useWindowState } from 'renderer/contexts/WindowState';
import { Button } from 'renderer/components/Button';
import { Icon } from 'renderer/components/Icon';

import { TrafficLightButtonsProps } from './types';

import styles from './TrafficLightButtons.module.scss';

const cx = classnames.bind(styles);

export const TrafficLightButtons: React.FC<TrafficLightButtonsProps> = ({ className }) => {
  const { isMaximized, maximize, unmaximize, minimize, close } = useWindowState();

  const handleEvent = (callback: () => void) => (event: React.MouseEvent<unknown>) => {
    (event.currentTarget as HTMLButtonElement)?.blur();
    callback();
  };

  return (
    <div className={cx('base', className)}>
      <Button
        title="Minimize"
        onClick={handleEvent(minimize)}
        intent="warning"
        className={cx('icon', 'minimize')}
        hoverVariant
      >
        <Icon name="minimize" />
      </Button>
      {isMaximized ? (
        <Button
          title="Unmaximize"
          onClick={handleEvent(unmaximize)}
          intent="success"
          className={cx('icon', 'unmaximize')}
          hoverVariant
        >
          <Icon name="unmaximize" />
        </Button>
      ) : (
        <Button
          title="Maximize"
          onClick={handleEvent(maximize)}
          intent="success"
          className={cx('icon', 'maximize')}
          hoverVariant
        >
          <Icon name="maximize" />
        </Button>
      )}

      <Button
        title="Close"
        onClick={close}
        intent="danger"
        className={cx('icon', 'close')}
        hoverVariant
      >
        <Icon name="cross" />
      </Button>
    </div>
  );
};

TrafficLightButtons.defaultProps = {
  className: undefined,
};

export default TrafficLightButtons;
