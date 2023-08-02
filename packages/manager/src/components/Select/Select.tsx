import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import MuiSelect, { SelectProps } from '@mui/material/Select';
import React, { ChangeEvent, useCallback, useState } from 'react';

export const Select = (props: SelectProps) => {
  const {} = props;
  const [age, setAge] = useState('');

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setAge(e.target.value);
  }, []);

  return (
    <FormControl fullWidth>
      <InputLabel
        sx={{
          // In order to restore default MUI label position
          position: 'absolute',
          transform: 'translate(14px, -9px) scale(0.75)',
        }}
        id="demo-simple-select-label"
      >
        Age
      </InputLabel>
      <MuiSelect
        id="demo-simple-select"
        label="Age"
        labelId="demo-simple-select-label"
        onChange={handleChange}
        value={age}
      >
        <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem>
      </MuiSelect>
    </FormControl>
  );
};
