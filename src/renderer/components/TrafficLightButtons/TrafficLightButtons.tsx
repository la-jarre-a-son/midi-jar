import React from 'react';
import classnames from 'classnames/bind';

import Button from 'renderer/components/Button';
import Icon from 'renderer/components/Icon';

import { useWindowState } from 'renderer/contexts/WindowState';
import styles from './TrafficLightButtons.module.scss';

const cx = classnames.bind(styles);

type Props = {
  className?: string;
};

const defaultProps = {
  className: undefined,
};

const TrafficLightButtons: React.FC<Props> = ({ className }) => {
  const { isMaximized, maximize, unmaximize, minimize, close } =
    useWindowState();

  const handleEvent =
    (callback: () => void) => (event: React.MouseEvent<unknown>) => {
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

TrafficLightButtons.defaultProps = defaultProps;

export default TrafficLightButtons;
