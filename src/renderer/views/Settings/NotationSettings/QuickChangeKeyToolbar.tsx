import React from 'react';
import { Box, InputContainerLabel, InputGroup, Select } from '@la-jarre-a-son/ui';

import { useSettings } from 'renderer/contexts/Settings';
import { fields } from './constants';

export const QuickChangeKeyToolbar: React.FC = () => {
  const { settings, updateSetting } = useSettings();

  return (
    <Box elevation={2}>
      <InputGroup as="label" block>
        <InputContainerLabel>Key</InputContainerLabel>
        <Select
          onChange={(value: string) => updateSetting('notation.key', value)}
          value={settings.notation.key}
          options={fields.keySignature.choices}
        />
      </InputGroup>
    </Box>
  );
};

export default QuickChangeKeyToolbar;
