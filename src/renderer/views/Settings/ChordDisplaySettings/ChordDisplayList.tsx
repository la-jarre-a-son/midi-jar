import React, { useState } from 'react';
import classnames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';

import { Button, Stack, TabList, Toolbar } from '@la-jarre-a-son/ui';

import { useSettings } from 'renderer/contexts/Settings';
import { Icon, NavTab } from 'renderer/components';

import styles from './ChordDisplaySettings.module.scss';
import ChordDisplayAddModal from './ChordDisplayAddModal';
import { addModule } from './utils';

const cx = classnames.bind(styles);

const ChordDisplayList: React.FC = () => {
  const navigate = useNavigate();
  const [addModalOpen, setAddModalOpen] = useState(false);

  const { settings, updateSetting } = useSettings();

  const handleAdd = () => setAddModalOpen(true);

  const handleCancel = () => setAddModalOpen(false);

  const handleSave = (name: string) => {
    try {
      return updateSetting('chordDisplay', addModule(name, settings.chordDisplay)).then(() => {
        setAddModalOpen(false);
        navigate(`./${name}`);
      });
    } catch (err) {
      return Promise.reject(err);
    }
  };

  const moduleIds = settings.chordDisplay.map((module) => module.id);

  return (
    <>
      <Toolbar as={Stack} className={cx('header')} elevation={2}>
        <TabList className={cx('list')} aria-label="Chord display list" justify="center">
          {moduleIds.map((moduleId) => (
            <NavTab key={moduleId} to={`/settings/chords/${moduleId}`}>
              {moduleId}
            </NavTab>
          ))}
        </TabList>
        <Button
          aria-label="Add session"
          intent="success"
          hoverIntent
          left={<Icon name="plus" />}
          icon
          onClick={handleAdd}
        />
      </Toolbar>
      <ChordDisplayAddModal open={addModalOpen} onSave={handleSave} onCancel={handleCancel} />
    </>
  );
};

export default ChordDisplayList;
