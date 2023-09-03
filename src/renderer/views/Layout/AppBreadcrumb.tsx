import React, { Fragment } from 'react';
import classnames from 'classnames/bind';
import { Breadcrumb, BreadcrumbItem } from '@la-jarre-a-son/ui';

import { NavLink, Params, useMatches } from 'react-router-dom';

import { Icon } from 'renderer/components';
import styles from './Layout.module.scss';

type MatchWithHandle = {
  id: string;
  pathname: string;
  params: Params<string>;
  data: unknown;
  handle: {
    title?: string;
    icon?: React.ReactNode;
    hasSettings?: boolean;
  };
};

const cx = classnames.bind(styles);

const AppBreadcrumb: React.FC = () => {
  const matches = useMatches() as unknown as MatchWithHandle[];
  const crumbs = matches
    .filter((match) => Boolean(match.handle?.title))
    .map((match) => ({
      title: match.handle?.title,
      icon: match.handle?.icon,
      path: match.pathname,
      hasSettings: !!match.handle?.hasSettings,
    }));

  return (
    <Breadcrumb>
      {crumbs.map(({ title, icon, path, hasSettings }, index) => (
        <Fragment key={index}>
          <BreadcrumbItem as={NavLink} to={path} aria-label={title}>
            {icon}
            <span className={cx('label')}>{title}</span>
          </BreadcrumbItem>
          {hasSettings && (
            <BreadcrumbItem as={NavLink} to={`${path}/settings`} aria-label="Settings">
              <Icon name="settings" />
            </BreadcrumbItem>
          )}
        </Fragment>
      ))}
    </Breadcrumb>
  );
};

export default AppBreadcrumb;
