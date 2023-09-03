import React, { Fragment, useState } from 'react';
import classnames from 'classnames/bind';

import {
  Button,
  Badge,
  Box,
  ListItem,
  Collapse,
  List,
  Divider,
  Stack,
  StackSeparator,
} from '@la-jarre-a-son/ui';

import { Icon } from 'renderer/components';

import ThirdPartyLicenses from '../../../../../ThirdPartyLicenses.json';

import styles from './Licenses.module.scss';

type Package = {
  id: string;
  name: string;
  version: string;
  url?: string;
  license: string;
  text: string;
};

const cx = classnames.bind(styles);

const Licenses: React.FC = () => {
  const [open, setOpen] = useState<string | null>(null);

  const stopPropagation = (e: React.MouseEvent<HTMLAnchorElement>) => e.stopPropagation();

  const handleClick = (id: string) => () => {
    setOpen((p) => (p === id ? null : id));
  };

  return (
    <Box as={List}>
      {(ThirdPartyLicenses as Package[]).map((p: Package, i) => (
        <Fragment key={p.id}>
          {i > 0 && <Divider />}
          <ListItem
            interactive
            as="button"
            onClick={handleClick(p.id)}
            right={
              <>
                {p.url && (
                  <Button
                    as="a"
                    className={cx('packageUrl')}
                    href={p.url}
                    target="_blank"
                    onClick={stopPropagation}
                    rel="noreferrer"
                    size="sm"
                    left={<Icon name="github" />}
                  >
                    Github
                  </Button>
                )}
                <span className={cx('itemHandle')}>
                  {open === p.id ? <Icon name="angle-up" /> : <Icon name="angle-down" />}
                </span>
              </>
            }
          >
            <Stack gap="md" direction="horizontal" block>
              <div className={cx('packageName')}>{p.name}</div>
              <Badge className={cx('packageType')} size="sm">
                {p.license}
              </Badge>
              <StackSeparator />
              <div className={cx('packageVersion')}>{p.version}</div>
            </Stack>
          </ListItem>
          <Collapse open={open === p.id}>
            <Box as="pre" className={cx('packageText')} pad="md">
              {p.text}
            </Box>
          </Collapse>
        </Fragment>
      ))}
    </Box>
  );
};

export default Licenses;
