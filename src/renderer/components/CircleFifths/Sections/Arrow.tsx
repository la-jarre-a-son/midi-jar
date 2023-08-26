import React, { memo } from 'react';
import classnames from 'classnames/bind';

import { Section } from '../types';
import { CX, CY, polar, drawRegularPolygon } from '../utils';

import styles from '../CircleFifths.module.scss';

const cx = classnames.bind(styles);

type ArrowProps = {
  section: Section;
};

const Arrow: React.FC<ArrowProps> = ({ section }) => {
  const radius = section.start - 2;
  const origin = polar(CX, CY, radius, 0);

  return (
    <polygon points={drawRegularPolygon(3, origin[0], origin[1], 2, 0)} className={cx('arrow')} />
  );
};

export default memo(Arrow);
