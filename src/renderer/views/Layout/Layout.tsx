import React from 'react';
import classnames from 'classnames/bind';
import { Outlet } from 'react-router-dom';
import {
  Button,
  ModalContainer,
  Modal,
  ModalContent,
  ModalHeader,
  ModalActions,
} from '@la-jarre-a-son/ui';
import { useWindowState } from 'renderer/contexts/WindowState';

import About from 'renderer/views/Settings/About';

import TopBar from './TopBar';

import styles from './Layout.module.scss';

const cx = classnames.bind(styles);

const Layout: React.FC = () => {
  const { windowState, updateInfo, dismissChangelog, dismissUpdate } = useWindowState();

  const closeAboutModalOpen = () => {
    dismissChangelog();
  };

  const closeUpdateModalOpen = () => {
    dismissUpdate(updateInfo?.version || '');
  };

  return (
    <div className={cx('base')}>
      <TopBar />
      <div className={cx('modalContainer')}>
        <ModalContainer>
          <div className={cx('content')}>
            <Outlet />
          </div>
          <Modal onClose={closeAboutModalOpen} open={!windowState.changelogDismissed} size="lg">
            <ModalHeader title="MIDI Jar" />
            <ModalContent>
              <About />
            </ModalContent>
          </Modal>
          {!!updateInfo && (
            <Modal onClose={closeUpdateModalOpen} open={!windowState.updateDismissed} size="sm">
              <ModalHeader title="Update available" />
              <ModalContent>
                A new version of MIDI Jar (v{updateInfo.version}) is available. Since this app is
                not signed, auto-update cannot install it automatically.
              </ModalContent>
              <ModalActions>
                <Button
                  block
                  as="a"
                  intent="primary"
                  href={`https://github.com/la-jarre-a-son/midi-jar/releases/tag/v${updateInfo.version}`}
                  target="_blank"
                >
                  Go to release page
                </Button>
              </ModalActions>
            </Modal>
          )}
        </ModalContainer>
      </div>
    </div>
  );
};

export default Layout;
