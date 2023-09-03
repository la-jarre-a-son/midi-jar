import React from 'react';
import classNames from 'classnames/bind';
import { Box } from '@la-jarre-a-son/ui';

import styles from './ScrollContainer.module.scss';

const cx = classNames.bind(styles);

type Props = React.ComponentProps<typeof Box> & { className?: string };

export const ScrollContainer: React.FC<Props> = ({ className, children, ...rest }) => {
  return (
    <Box className={cx('base', className)} {...rest}>
      {children}
    </Box>
  );
};

ScrollContainer.defaultProps = {
  className: undefined,
};

export default ScrollContainer;
