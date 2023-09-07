import { Linode } from '@linode/api-v4';
import { Region } from '@linode/api-v4/lib/regions';
import Close from '@mui/icons-material/Close';
import { Box, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { action } from '@storybook/addon-actions';
import React from 'react';

import { Country } from 'src/components/EnhancedSelect/variants/RegionSelect/utils';
import { Flag } from 'src/components/Flag';
import { IconButton } from 'src/components/IconButton';
import { List } from 'src/components/List';
import { ListItem } from 'src/components/ListItem';
import { linodeFactory } from 'src/factories';
import { getRegionCountryGroup } from 'src/utilities/formatRegion';

import { Autocomplete } from './Autocomplete';
import { SelectedIcon } from './Autocomplete.styles';

import type {
  DataShape,
  EnhancedAutocompleteProps,
  OptionType,
} from './Autocomplete';
import type { Meta, StoryFn, StoryObj } from '@storybook/react';

const LABEL = 'Select a Linode';

const options: OptionType<DataShape, { isTruthy: boolean }>[] = [
  {
    data: {
      country: 'us',
      flag: <Flag country="us" />,
      region: 'North America',
    },
    label: 'Linode123',
    value: 'linode123',
  },
  {
    data: linodeFactory.build(),
    label: 'Linode1234',
    value: 'linode1234',
  },
  {
    data: {
      isTruthy: false,
    },
    label: 'Linode-001',
    value: 'linode-001',
  },
  {
    label: 'Linode-002',
    value: 'linode-002',
  },
  {
    label: 'Linode-003',
    value: 'linode-003',
  },
  {
    label: 'Linode-004',
    value: 'linode-004',
  },
  {
    label: 'Linode-005',
    value: 'linode-005',
  },
];

const fakeRegionsData = [
  {
    country: 'us',
    id: 'us-east',
    label: 'Newark, NJ',
  },
  {
    country: 'us',
    id: 'us-central',
    label: 'Texas, TX',
  },
  {
    country: 'fr',
    id: 'fr-par',
    label: 'Paris, FR',
  },
  {
    country: 'br',
    id: 'br-sao',
    label: 'Sao Paulo, BR',
  },
  {
    country: 'jp',
    id: 'jp-tyo',
    label: 'Tokyo, JP',
  },
];

const getRegionsOptions = (
  fakeRegionsData: Pick<Region, 'country' | 'id' | 'label'>[]
) => {
  return fakeRegionsData.map((region: Region) => {
    const group = getRegionCountryGroup(region);
    return {
      data: {
        country: region.country,
        flag: <Flag country={region.country as Lowercase<Country>} />,
        region: group,
      },
      label: `${region.label} (${region.id})`,
      value: region.id,
    };
  });
};

const AutocompleteWithSeparateSelectedOptions = (
  props: EnhancedAutocompleteProps<OptionType>
) => {
  const [selectedOptions, setSelectedOptions] = React.useState<OptionType[]>(
    []
  );

  const handleSelectedOptions = React.useCallback((selected: OptionType[]) => {
    setSelectedOptions(selected);
  }, []);

  // Function to remove an option from the list of selected options
  const removeOption = (optionToRemove: OptionType) => {
    const updatedSelectedOptions = selectedOptions.filter(
      (option) => option.value !== optionToRemove.value
    );

    // Call onSelectionChange to update the selected options
    handleSelectedOptions(updatedSelectedOptions);
  };

  return (
    <Stack>
      <Autocomplete
        {...props}
        onSelectionChange={handleSelectedOptions}
        renderTags={() => null}
        value={selectedOptions}
      />
      {selectedOptions.length > 0 && (
        <>
          <SelectedOptionsHeader>{`Linodes to be Unassigned from Subnet (${selectedOptions.length})`}</SelectedOptionsHeader>

          <SelectedOptionsList>
            {selectedOptions.map((option) => (
              <SelectedOptionsListItem alignItems="center" key={option.value}>
                <StyledLabel>{option.label}</StyledLabel>
                <IconButton
                  aria-label={`remove ${option.value}`}
                  disableRipple
                  onClick={() => removeOption(option)}
                  size="medium"
                >
                  <Close />
                </IconButton>
              </SelectedOptionsListItem>
            ))}
          </SelectedOptionsList>
        </>
      )}
    </Stack>
  );
};

// Story Config ========================================================

const meta: Meta<EnhancedAutocompleteProps<OptionType>> = {
  argTypes: {
    onSelectionChange: {
      action: 'onSelectionChange',
    },
  },
  args: {
    label: LABEL,
    onSelectionChange: action('onSelectionChange'),
    options,
  },
  component: Autocomplete,
  decorators: [
    (Story: StoryFn) => (
      <div style={{ marginLeft: '2em', minHeight: 270 }}>
        <Story />
      </div>
    ),
  ],
  title: 'Components/Autocomplete',
};

export default meta;

type Story = StoryObj<typeof Autocomplete>;

// Styled Components =================================================

const CustomValue = styled('span')(({ theme }) => ({
  fontFamily: theme.font.bold,
  fontSize: '1rem',
  wordBreak: 'break-word',
}));

const CustomDescription = styled('span')(() => ({
  fontSize: '0.875rem',
}));

const StyledListItem = styled('li')(() => ({
  alignItems: 'center',
  display: 'flex',
  width: '100%',
}));

const StyledLabel = styled('span')(({ theme }) => ({
  color: theme.color.label,
  fontFamily: theme.font.semiBold,
  fontSize: '14px',
}));

const StyledFlag = styled('span')(({ theme }) => ({
  marginRight: theme.spacing(1),
}));

const SelectedOptionsHeader = styled('h4')(({ theme }) => ({
  color: theme.color.headline,
  fontFamily: theme.font.bold,
  fontSize: '14px',
  textTransform: 'initial',
}));

const SelectedOptionsList = styled(List)(({ theme }) => ({
  background: theme.bg.main,
  maxWidth: '416px',
  padding: '5px 0',
  width: '100%',
}));

const SelectedOptionsListItem = styled(ListItem)(() => ({
  justifyContent: 'space-between',
  paddingBottom: 0,
  paddingTop: 0,
}));

const GroupHeader = styled('div')(({ theme }) => ({
  color: theme.color.headline,
  fontFamily: theme.font.bold,
  fontSize: '1rem',
  padding: '15px 4px 4px 10px',
  textTransform: 'initial',
}));

const GroupItems = styled('ul')({
  padding: 0,
});

// Story Definitions ==========================================================

export const Default: Story = {
  args: {
    defaultValue: options[0],
  },
  render: (args) => <Autocomplete {...args} />,
};

/**
 * The preferred shape of the data prop is an object with data, label and value.
 */
export const LinodeSelect: Story = {
  args: {
    options: [
      {
        data: linodeFactory.build(),
        label: 'linode-1',
        value: '1',
      },
      {
        data: linodeFactory.build(),
        label: 'linode-2',
        value: '2',
      },
      {
        data: linodeFactory.build(),
        label: 'linode-3',
        value: '3',
      },
      {
        data: linodeFactory.build(),
        label: 'linode-4',
        value: '4',
      },
      {
        data: linodeFactory.build(),
        label: 'linode-5',
        value: '5',
      },
    ],
  },
  render: (args) => <Autocomplete {...args} />,
};

const SomeComponent = (props: any) => {
  const { options }: { options: Linode[] } = props;

  // In this example, data (options) can come from RQ or anywhere, but we need to derive a value.
  const optionsWithValue = options.map((option) => {
    return { data: option, label: option.label, value: option.label };
  });

  // Technically spreading the option will work too since Linodes have labels,
  // but the shape of the data is not ideal since all other properties are applied at the root level

  // const optionsWithValue = options.map((option) => {
  //   return { ...option, value: option.label };
  // });

  return (
    <Autocomplete
      {...props}
      options={optionsWithValue}
      renderInput={() => null}
    />
  );
};

/**
 * Since linodes have labels, we only need to define a value and can spread the rest of the linode object into the options prop.
 * Here we are deriving the value from the linode's label since the linode object does not have a value property.
 */
export const LinodeSelectDerivedValue: Story = {
  render: (args) => (
    <SomeComponent
      {...args}
      options={[
        linodeFactory.build(),
        linodeFactory.build(),
        linodeFactory.build(),
        linodeFactory.build(),
      ]}
    />
  ),
};

export const NoOptionsMessage: Story = {
  args: {
    noOptionsText:
      'This is a custom message when there are no options to display.',
    options: [],
  },
  render: (args) => <Autocomplete {...args} />,
};

export const Regions: Story = {
  args: {
    groupBy: (option: OptionType<'country'>) => option.data?.region || '',
    label: 'Select a Region',
    options: getRegionsOptions(fakeRegionsData),
    placeholder: 'Select a Region',
    renderGroup: (params) => (
      <li key={params.key}>
        <GroupHeader>{params.group}</GroupHeader>
        <GroupItems>{params.children}</GroupItems>
      </li>
    ),
    renderOption: (props, option: OptionType<'country'>, { selected }) => {
      return (
        <StyledListItem {...props}>
          <Box alignItems={'center'} display={'flex'} flexGrow={1}>
            <StyledFlag>{option.data?.flag}</StyledFlag>
            {option.label}
          </Box>
          <SelectedIcon visible={selected} />
        </StyledListItem>
      );
    },
  },
  render: (args) => <Autocomplete {...args} />,
};

export const CustomRenderOptions: Story = {
  args: {
    label: 'Select a Linode to Clone',
    options: [
      {
        label: 'Nanode 1 GB, Debian 11, Newark, NJ',
        value: 'debian-us-east',
      },
      {
        label: 'Nanode 2 GB, Debian 11, Newark, NJ',
        value: 'debian-us-east-001',
      },
      {
        label: 'Nanode 3 GB, Debian 11, Newark, NJ',
        value: 'debian-us-east-002',
      },
    ],
    placeholder: 'Select a Linode to Clone',
    renderOption: (props, option, { selected }) => (
      <StyledListItem {...props}>
        <Stack flexGrow={1}>
          <CustomValue>{option.value}</CustomValue>
          <CustomDescription>{option.label}</CustomDescription>
        </Stack>
        <SelectedIcon visible={selected} />
      </StyledListItem>
    ),
  },
  render: (args) => <Autocomplete {...args} />,
};

export const MultiSelect: Story = {
  args: {
    defaultValue: [options[0]],
    multiple: true,
    onSelectionChange: (selected: OptionType[]) => {
      action('onSelectionChange')(selected.map((options) => options.value));
    },
    placeholder: LABEL,
    selectAllLabel: 'Linodes',
  },
  render: (args) => <Autocomplete {...args} />,
};

export const MultiSelectWithSeparateSelectionOptions: Story = {
  args: {
    defaultValue: [options[0]],
    multiple: true,
    onSelectionChange: (selected: OptionType[]) => {
      action('onSelectionChange')(selected.map((options) => options.value));
    },
    placeholder: LABEL,
    selectAllLabel: 'Linodes',
  },
  render: (args) => <AutocompleteWithSeparateSelectedOptions {...args} />,
};
