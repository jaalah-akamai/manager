import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MuiAutocomplete from '@mui/material/Autocomplete';
import React from 'react';

import { Box } from 'src/components/Box';
import { TextField } from 'src/components/TextField';

import {
  CustomPopper,
  SelectedIcon,
  StyledListItem,
} from './Autocomplete.styles';

/**
 * Type guard to check if the type of 'value' is the same as the type of 'otherValue'.
 * @param value - The value whose type you want to compare.
 * @param otherValue - The value of unknown type to compare against.
 * @returns True if 'value' and 'otherValue' have the same type, false otherwise.
 */
function isSameType<T>(value: T, otherValue: unknown): otherValue is T {
  return typeof value === typeof otherValue;
}

import type { AutocompleteProps } from '@mui/material/Autocomplete';

export interface EnhancedAutocompleteProps<
  T extends { label: string },
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined
> extends Omit<
    AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>,
    'renderInput'
  > {
  /** Provides a hint with error styling to assist users. */
  errorText?: string;
  /** Provides a hint with normal styling to assist users. */
  helperText?: string;
  /** A required label for the Autocomplete to ensure accessibility. */
  label: string;
  /** Removes the top margin from the input label, if desired. */
  noMarginTop?: boolean;
  /** Callback function triggered when the input field loses focus. */
  onBlur?: (e: React.FocusEvent) => void;
  /** Placeholder text displayed in the input field. */
  placeholder?: string;
  /** Indicates whether the input is required, displaying an appropriate indicator. */
  required?: boolean;
  /** Label for the "select all" option. */
  selectAllLabel?: string;
}

/**
 * An Autocomplete component that provides a user-friendly select input
 * allowing selection between options.
 *
 * @example
 * <Autocomplete
 *  label="Select a Fruit"
 *  onSelectionChange={(selected) => console.log(selected)}
 *  options={[
 *    {
 *      label: 'Apple',
 *      value: 'apple',
 *    }
 *  ]}
 * />
 */
export const Autocomplete = <
  T extends { label: string },
  Multiple extends boolean | undefined = undefined,
  DisableClearable extends boolean | undefined = undefined,
  FreeSolo extends boolean | undefined = undefined
>(
  props: EnhancedAutocompleteProps<T, Multiple, DisableClearable, FreeSolo>
) => {
  const {
    clearOnBlur = false,
    defaultValue,
    disablePortal = true,
    errorText = '',
    helperText,
    label,
    limitTags = 2,
    loading = false,
    loadingText,
    multiple,
    noMarginTop,
    noOptionsText,
    onBlur,
    onChange,
    options,
    placeholder,
    renderOption,
    selectAllLabel = '',
    value,
    ...rest
  } = props;

  const isSelectAllActive =
    multiple && Array.isArray(value) && value.length === options.length;

  const selectAllText = isSelectAllActive ? 'Deselect All' : 'Select All';

  const selectAllOption = { label: `${selectAllText} ${selectAllLabel}` };

  const optionsWithSelectAll = [selectAllOption, ...options] as T[];

  return (
    <MuiAutocomplete
      renderInput={(params) => (
        <TextField
          errorText={errorText}
          helperText={helperText}
          inputId={params.id}
          label={label}
          loading={loading}
          noMarginTop={noMarginTop}
          placeholder={placeholder || 'Select an option'}
          {...params}
        />
      )}
      renderOption={(props, option, state, ownerState) => {
        const isSelectAllOption = option === selectAllOption;
        const ListItem = isSelectAllOption ? StyledListItem : 'li';

        return renderOption ? (
          renderOption(props, option, state, ownerState)
        ) : (
          <ListItem {...props}>
            <>
              <Box
                sx={{
                  flexGrow: 1,
                }}
              >
                {option.label}
              </Box>
              <SelectedIcon visible={state.selected} />
            </>
          </ListItem>
        );
      }}
      ChipProps={{ deleteIcon: <CloseIcon /> }}
      PopperComponent={CustomPopper}
      clearOnBlur={clearOnBlur}
      defaultValue={defaultValue}
      disableCloseOnSelect={multiple}
      disablePortal={disablePortal}
      limitTags={limitTags}
      loading={loading}
      loadingText={loadingText || 'Loading...'}
      noOptionsText={noOptionsText || <i>You have no options to choose from</i>}
      onBlur={onBlur}
      options={multiple ? optionsWithSelectAll : options}
      popupIcon={<KeyboardArrowDownIcon />}
      {...rest}
      onChange={(e, value, reason, details) => {
        if (onChange) {
          if (details?.option === selectAllOption) {
            if (isSelectAllActive) {
              if (isSameType(value, [])) {
                onChange(e, ([] as T[]) as typeof value, reason, details);
              }
            } else {
              if (isSameType(value, options)) {
                onChange(e, options as typeof value, reason, details);
              }
            }
          } else {
            onChange(e, value, reason, details);
          }
        }
      }}
    />
  );
};
