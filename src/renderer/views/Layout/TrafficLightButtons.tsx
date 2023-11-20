import React from 'react';

import { Button, ButtonGroup } from '@la-jarre-a-son/ui';
import { Icon } from 'renderer/components';

import { useWindowState } from 'renderer/contexts/WindowState';

type Props = {
  className?: string;
};

const defaultProps = {
  className: undefined,
};

const TrafficLightButtons: React.FC<Props> = ({ className }) => {
  const { windowState, maximize, unmaximize, minimize, close } = useWindowState();

  const handleEvent = (callback: () => void) => (event: React.MouseEvent<unknown>) => {
    (event.currentTarget as HTMLButtonElement)?.blur();
    callback();
  };

  return (
    <ButtonGroup className={className}>
      <Button
        aria-label="Minimize"
        onClick={handleEvent(minimize)}
        intent="warning"
        hoverIntent
        icon
      >
        <Icon name="minimize" />
      </Button>
      {windowState.maximized ? (
        <Button
          aria-label="Unmaximize"
          onClick={handleEvent(unmaximize)}
          intent="success"
          hoverIntent
          icon
        >
          <Icon name="unmaximize" />
        </Button>
      ) : (
        <Button
          aria-label="Maximize"
          onClick={handleEvent(maximize)}
          intent="success"
          hoverIntent
          icon
        >
          <Icon name="maximize" />
        </Button>
      )}
      <Button aria-label="Close" onClick={close} intent="danger" hoverIntent icon>
        <Icon name="cross" />
      </Button>
    </ButtonGroup>
  );
};

TrafficLightButtons.defaultProps = defaultProps;

export default TrafficLightButtons;
