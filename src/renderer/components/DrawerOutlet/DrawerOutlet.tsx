import React, { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { Drawer, DrawerProps } from '@la-jarre-a-son/ui';
import { useOutlet, useNavigate } from 'react-router-dom';

import styles from './DrawerOutlet.module.scss';

const cx = classNames.bind(styles);

type Props = Omit<DrawerProps, 'open' | 'onClose'> & {
  context?: unknown;
};

export const DrawerOutlet: React.FC<Props> = ({ context, ...rest }) => {
  const children = useOutlet(context);
  const [_hadChildren, setHadChildren] = useState(!!children);
  const [open, setOpen] = useState(!!children);

  const navigate = useNavigate();

  const handleClose = () => setOpen(false);
  const handleClosed = () => {
    navigate('.');
  };

  useEffect(() => {
    if (children) {
      // For some reason, children changes when closing, triggering a reopen.
      // So now we only reopen if children was empty at some point
      setHadChildren((already) => {
        if (!already) {
          setOpen(true);
        }
        return true;
      });
    } else {
      setHadChildren(false);
    }
  }, [children]);

  return (
    <Drawer
      {...rest}
      open={open}
      onClose={handleClose}
      className={cx('base')}
      animationProps={{ onExited: handleClosed }}
    >
      {children}
    </Drawer>
  );
};

DrawerOutlet.defaultProps = {
  context: undefined,
};

export default DrawerOutlet;
