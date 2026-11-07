/* eslint-disable react/jsx-props-no-spreading */
import React, { useMemo, useState } from 'react';
import classnames from 'classnames/bind';
import { useMidiRouting } from 'renderer/contexts/MidiRouting';
import { Box, Toolbar, Button, StackSeparator } from '@la-jarre-a-son/ui';
import { Icon } from 'renderer/components';
import { ApiMidiRoute } from 'main/types/api';
import Graph from './Graph';
import styles from './Routing.module.scss';

const cx = classnames.bind(styles);
const PRESET_KEY = 'midi-jar.routing-presets.v1';
type Preset = { name: string; routes: ApiMidiRoute[]; updatedAt: string };
const readPresets = (): Preset[] => {
  try {
    const value = window.localStorage.getItem(PRESET_KEY);
    return value ? (JSON.parse(value) as Preset[]) : [];
  } catch {
    return [];
  }
};
const Routing: React.FC = () => {
  const { inputs, outputs, wires, refreshDevices, addRoute, deleteRoute, clearRoutes } =
    useMidiRouting();
  const [presets, setPresets] = useState<Preset[]>(readPresets);
  const [selectedPreset, setSelectedPreset] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const currentRoutes = useMemo(() => wires.map((wire) => wire.route), [wires]);
  const persistPresets = (next: Preset[]) => {
    setPresets(next);
    window.localStorage.setItem(PRESET_KEY, JSON.stringify(next));
  };
  const savePreset = () => {
    const normalized = newPresetName.trim();
    if (!normalized) return;
    const next = presets.filter((item) => item.name !== normalized);
    next.push({ name: normalized, routes: currentRoutes, updatedAt: new Date().toISOString() });
    persistPresets(next);
    setSelectedPreset(normalized);
    setNewPresetName('');
    setIsSaving(false);
  };
  const overwritePreset = () => {
    if (!selectedPreset) return;
    persistPresets(
      presets.map((item) =>
        item.name === selectedPreset
          ? { ...item, routes: currentRoutes, updatedAt: new Date().toISOString() }
          : item
      )
    );
  };
  const loadPreset = () => {
    const preset = presets.find((item) => item.name === selectedPreset);
    if (!preset) return;
    clearRoutes();
    preset.routes.forEach((route) => addRoute(route));
  };
  const deletePreset = () => {
    if (!selectedPreset) return;
    persistPresets(presets.filter((item) => item.name !== selectedPreset));
    setSelectedPreset('');
    setConfirmDelete(false);
  };
  return (
    <div className={cx('base')}>
      <Box pad="md" className={cx('container')}>
        <Graph
          inputs={inputs}
          outputs={outputs}
          wires={wires}
          onAddRoute={addRoute}
          onDeleteRoute={deleteRoute}
        />
      </Box>
      <Toolbar elevation={2} placement="bottom">
        <Button onClick={refreshDevices} intent="neutral">
          <Icon name="refresh" /> Refresh devices
        </Button>
        <StackSeparator />
        <span className={cx('presetLabel')}>Routing preset</span>
        <select
          className={cx('presetSelect')}
          aria-label="Routing preset"
          value={selectedPreset}
          onChange={(event) => setSelectedPreset(event.target.value)}
        >
          <option value="">Select preset</option>
          {presets.map((item) => (
            <option key={item.name} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
        {isSaving ? (
          <span className={cx('presetEditor')}>
            <input
              className={cx('presetNameInput')}
              aria-label="Preset name"
              placeholder="Preset name"
              value={newPresetName}
              onChange={(event) => setNewPresetName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') savePreset();
                if (event.key === 'Escape') {
                  setIsSaving(false);
                  setNewPresetName('');
                }
              }}
            />
            <Button onClick={savePreset} intent="primary" disabled={!newPresetName.trim()}>
              Save
            </Button>
            <Button
              onClick={() => {
                setIsSaving(false);
                setNewPresetName('');
              }}
              intent="neutral"
            >
              Cancel
            </Button>
          </span>
        ) : (
          <Button onClick={() => setIsSaving(true)} intent="neutral">
            Save as
          </Button>
        )}
        <Button onClick={overwritePreset} intent="neutral" disabled={!selectedPreset}>
          Overwrite
        </Button>
        <Button onClick={loadPreset} intent="neutral" disabled={!selectedPreset}>
          Load
        </Button>
        {confirmDelete ? (
          <span className={cx('presetEditor')}>
            <span>Delete &quot;{selectedPreset}&quot;?</span>
            <Button onClick={deletePreset} intent="danger">
              Delete
            </Button>
            <Button onClick={() => setConfirmDelete(false)} intent="neutral">
              Cancel
            </Button>
          </span>
        ) : (
          <Button
            onClick={() => setConfirmDelete(true)}
            intent="neutral"
            disabled={!selectedPreset}
          >
            Delete preset
          </Button>
        )}
        <StackSeparator />
        <Button onClick={clearRoutes} intent="danger" hoverIntent>
          <Icon name="trash" /> Clear all
        </Button>
      </Toolbar>
    </div>
  );
};
export default Routing;
