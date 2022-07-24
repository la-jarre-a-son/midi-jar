import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import classnames from 'classnames/bind';

import { useSettings } from 'renderer/contexts/Settings';

import Toolbar from 'renderer/components/Toolbar';
import Button from 'renderer/components/Button';
import ButtonGroup from 'renderer/components/ButtonGroup';
import Icon from 'renderer/components/Icon';
import FormField from 'renderer/components/FormField';
import Toggle from 'renderer/components/Toggle';
import Input from 'renderer/components/Input';
import InputColor from 'renderer/components/InputColor';

import { Settings } from 'main/types/Settings';
import { fields } from './constants';

import styles from './ChordDisplaySettings.module.scss';

const CHORD_DISPLAY_NAMESPACES = ['internal', 'overlay'];

const cx = classnames.bind(styles);

type Props = {
  className?: string;
};

const defaultProps = {
  className: undefined,
  children: undefined,
};

/**
 *  ChordDisplay settings page
 *
 * @version 1.0.0
 * @author Rémi Jarasson
 */
const ChordDisplaySettings: React.FC<Props> = ({ className }) => {
  const { namespace } = useParams();
  const { settings, updateSetting, resetSettings } = useSettings();

  if (!namespace || !CHORD_DISPLAY_NAMESPACES.includes(namespace)) {
    return <Navigate to="/settings/chords/internal" />;
  }

  const namespaceSettings = settings
    ? settings.chordDisplay[namespace as keyof Settings['chordDisplay']]
    : null;

  if (!namespaceSettings) {
    return (
      <div className={cx('base', className)}>
        <div className={cx('noSettings')}>
          <p>No Settings found, there might be an error with your settings.</p>{' '}
          <Button onClick={() => resetSettings('chordDisplay')}>
            <Icon name="trash" />
            Reset to Defaults
          </Button>
        </div>
      </div>
    );
  }

  const updateNamespaceSettings = (setting: string, value: unknown) =>
    updateSetting(`chordDisplay.${namespace}.${setting}`, value);

  const useInternal = namespace !== 'internal' && namespaceSettings.useInternal;

  return (
    <div className={cx('base', className)}>
      <Toolbar className={cx('header')}>
        <ButtonGroup>
          <Button
            active={namespace === 'internal'}
            to="/settings/chords/internal"
          >
            <Icon name="window" />
            Internal
          </Button>
          <Button
            active={namespace === 'overlay'}
            to="/settings/chords/overlay"
          >
            <Icon name="overlay" />
            Overlay
          </Button>
        </ButtonGroup>
      </Toolbar>
      <div className={cx('container')}>
        {namespace !== 'internal' && (
          <div className={cx('group')}>
            <FormField
              fieldId="chord_display_settings:use-internal"
              label="Use same settings as Internal"
            >
              <Toggle
                id="chord_display_settings:use-internal"
                onChange={(value) =>
                  updateNamespaceSettings('useInternal', value)
                }
                value={namespaceSettings.useInternal}
                successIcon="save"
              />
            </FormField>
          </div>
        )}
        <div
          className={cx('group', {
            'group--useInternal': useInternal,
          })}
        >
          <FormField
            fieldId="chord_display_settings:skin"
            label="Keyboard skin"
          >
            <Toggle
              id="chord_display_settings:skin"
              choices={fields.skin.choices}
              onChange={(value) => updateNamespaceSettings('skin', value)}
              value={namespaceSettings.skin}
              successIcon="save"
              disabled={useInternal}
            />
          </FormField>

          <FormField
            fieldId="chord_display_settings:note-from"
            label="Keyboard Start"
          >
            <Input
              id="chord_display_settings:note-from"
              onChange={(value) => updateNamespaceSettings('from', value)}
              value={namespaceSettings.from ?? null}
              type="text"
              disabled={useInternal}
            />
          </FormField>

          <FormField
            fieldId="chord_display_settings:note-to"
            label="Keyboard End"
          >
            <Input
              id="chord_display_settings:note-to"
              onChange={(value) => updateNamespaceSettings('to', value)}
              value={namespaceSettings.to ?? null}
              disabled={useInternal}
            />
          </FormField>

          <FormField
            fieldId="chord_display_settings:accidentals"
            label="Accidentals"
          >
            <Toggle
              id="chord_display_settings:accidentals"
              choices={fields.accidentals.choices}
              onChange={(value) =>
                updateNamespaceSettings('accidentals', value)
              }
              value={namespaceSettings.accidentals ?? 'flat'}
              successIcon="save"
              disabled={useInternal}
            />
          </FormField>

          <FormField
            fieldId="chord_display_settings:display-keyboard"
            label="Display Keyboard"
          >
            <Toggle
              id="chord_display_settings:display-keyboard"
              onChange={(value) =>
                updateNamespaceSettings('displayKeyboard', value)
              }
              value={namespaceSettings.displayKeyboard ?? true}
              successIcon="save"
              disabled={useInternal}
            />
          </FormField>

          <FormField
            fieldId="chord_display_settings:display-notes"
            label="Display Notes"
          >
            <Toggle
              id="chord_display_settings:display-notes"
              onChange={(value) =>
                updateNamespaceSettings('displayNotes', value)
              }
              value={namespaceSettings.displayNotes ?? true}
              successIcon="save"
              disabled={useInternal}
            />
          </FormField>

          <FormField
            fieldId="chord_display_settings:display-chord"
            label="Display Chord"
          >
            <Toggle
              id="chord_display_settings:display-chord"
              onChange={(value) =>
                updateNamespaceSettings('displayChord', value)
              }
              value={namespaceSettings.displayChord ?? true}
              successIcon="save"
              disabled={useInternal}
            />
          </FormField>

          <FormField
            fieldId="chord_display_settings:display-alt-chords"
            label="Display Alternative Chords"
          >
            <Toggle
              id="chord_display_settings:display-alt-chords"
              onChange={(value) =>
                updateNamespaceSettings('displayAltChords', value)
              }
              value={namespaceSettings.displayAltChords ?? true}
              successIcon="save"
              disabled={useInternal}
            />
          </FormField>

          <FormField
            fieldId="chord_display_settings:display-tonic"
            label="Display Tonic"
          >
            <Toggle
              id="chord_display_settings:display-tonic"
              onChange={(value) =>
                updateNamespaceSettings('displayTonic', value)
              }
              value={namespaceSettings.displayTonic ?? true}
              successIcon="save"
              disabled={useInternal}
            />
          </FormField>

          <FormField
            fieldId="chord_display_settings:display-degrees"
            label="Display Chord Degrees"
          >
            <Toggle
              id="chord_display_settings:display-degrees"
              onChange={(value) =>
                updateNamespaceSettings('displayDegrees', value)
              }
              value={namespaceSettings.displayDegrees ?? true}
              successIcon="save"
              disabled={useInternal}
            />
          </FormField>

          <FormField
            fieldId="chord_display_settings:display-key-name"
            label="Display Key Names"
          >
            <Toggle
              id="chord_display_settings:display-key-name"
              onChange={(value) =>
                updateNamespaceSettings('displayKeyNames', value)
              }
              value={namespaceSettings.displayKeyNames ?? true}
              successIcon="save"
              disabled={useInternal}
            />
          </FormField>

          <FormField
            fieldId="chord_display_settings:color-note-black"
            label="Color Black Keys"
          >
            <InputColor
              id="chord_display_settings:color-note-black"
              onChange={(value) =>
                updateNamespaceSettings('colorNoteBlack', value)
              }
              value={namespaceSettings.colorNoteBlack ?? null}
              disabled={useInternal}
            />
          </FormField>

          <FormField
            fieldId="chord_display_settings:color-note-white"
            label="Color White Keys"
          >
            <InputColor
              id="chord_display_settings:color-note-white"
              onChange={(value) =>
                updateNamespaceSettings('colorNoteWhite', value)
              }
              value={namespaceSettings.colorNoteWhite ?? null}
              disabled={useInternal}
            />
          </FormField>

          <FormField
            fieldId="chord_display_settings:color-highlight"
            label="Color Highlight"
          >
            <InputColor
              id="chord_display_settings:color-highlight"
              onChange={(value) =>
                updateNamespaceSettings('colorHighlight', value)
              }
              value={namespaceSettings.colorHighlight ?? null}
              disabled={useInternal}
            />
          </FormField>
        </div>
      </div>
      <Toolbar bottom>
        <Button onClick={() => resetSettings('chordDisplay')}>
          <Icon name="trash" />
          Reset to Defaults
        </Button>
      </Toolbar>
    </div>
  );
};

ChordDisplaySettings.defaultProps = defaultProps;

export default ChordDisplaySettings;
