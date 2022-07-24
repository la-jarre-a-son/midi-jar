import React from 'react';
import classnames from 'classnames/bind';

import CollapseGroup from 'renderer/components/CollapseGroup';
import Icon from 'renderer/components/Icon';

// eslint-disable-next-line
import ThirdPartyLicenses from '../../../../../ThirdPartyLicenses.json';

import styles from './Licenses.module.scss';

type License = {
  id: string;
  name: string;
  version: string;
  url?: string;
  license: string;
  text: string;
};

const cx = classnames.bind(styles);

type Props = {
  className?: string;
};

const defaultProps = {
  className: undefined,
  children: undefined,
};

/**
 *  Licenses page
 *
 * @version 1.0.0
 * @author Rémi Jarasson
 */
const Licenses: React.FC<Props> = ({ className }) => {
  const stopPropagation = (e: React.MouseEvent<HTMLAnchorElement>) =>
    e.stopPropagation();

  return (
    <div className={cx('base', className)}>
      <div className={cx('packages')}>
        {(ThirdPartyLicenses as License[]).map((license: License) => (
          <CollapseGroup
            key={license.id}
            header={
              <div className={cx('licenseHeader')}>
                <div className={cx('licenseName')}>{license.name}</div>
                <div className={cx('licenseType')}>{license.license}</div>
                <div className={cx('licenseVersion')}>{license.version}</div>
                {license.url && (
                  <a
                    className={cx('licenseUrl')}
                    href={license.url}
                    target="_blank"
                    onClick={stopPropagation}
                    rel="noreferrer"
                  >
                    <Icon name="github" />
                  </a>
                )}
              </div>
            }
          >
            <pre className={cx('licenseText')}>{license.text}</pre>
          </CollapseGroup>
        ))}
      </div>
    </div>
  );
};

Licenses.defaultProps = defaultProps;

export default Licenses;
