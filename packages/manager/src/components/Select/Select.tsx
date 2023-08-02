import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import MuiSelect, { SelectProps } from '@mui/material/Select';
import React, { ChangeEvent, useCallback, useState } from 'react';
export const Select = (props: SelectProps) => {
  const { MenuProps, inputProps, sx } = props;
  const { sx: sxLabel } = inputProps || {};
  const { sx: sxMenuItem } = MenuProps || {};
  const [age, setAge] = useState('');

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setAge(e.target.value);
  }, []);

  // In order to restore the default label styles,
  // we need to undo our overrides.
  const labelDefaultStyles = {
    '&.MuiInputLabel-shrink': {
      transform: 'translate(14px, -9px) scale(0.75)',
    },
    position: 'absolute',
    transform: 'translate(14px, 16px) scale(1)',
  };

  return (
    <FormControl fullWidth>
      <InputLabel
        id="demo-simple-select-label"
        sx={{ ...labelDefaultStyles, sxLabel }}
      >
        Age
      </InputLabel>
      <MuiSelect
        id="demo-simple-select"
        label="Age"
        labelId="demo-simple-select-label"
        onChange={handleChange}
        sx={sx}
        value={age}
      >
        <MenuItem sx={sxMenuItem} value={10}>
          Ten
        </MenuItem>
        <MenuItem sx={sxMenuItem} value={20}>
          Twenty
        </MenuItem>
        <MenuItem sx={sxMenuItem} value={30}>
          Thirty
        </MenuItem>
      </MuiSelect>
    </FormControl>
  );
};
