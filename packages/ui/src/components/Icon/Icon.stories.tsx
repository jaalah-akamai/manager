import React from 'react';

import * as Icons from '../../assets/iconsV2';
import Icon from './Icon';

import type { IconName } from './Icon';
import type { Meta, StoryObj } from '@storybook/react-vite';

const iconOptions = Object.keys(Icons).sort() as IconName[];

const familyOptions: IconName[] = [
  'IconArrow',
  'IconCaret',
  'IconChevron',
  'IconFlag',
  'IconHelpCircle',
  'IconInfo',
  'IconPin',
  'IconSecurityAlert',
  'IconStar',
  'IconStatusAlert',
  'IconStatusDenied',
  'IconStatusFailure',
  'IconStatusSuccess',
  'IconTag',
];

const meta: Meta<typeof Icon> = {
  title: 'Components/Icon',
  component: Icon,
  args: {
    size: 20,
    color: 'currentColor',
  },
  argTypes: {
    name: {
      control: 'select',
      options: [...familyOptions, ...iconOptions],
    },
    direction: {
      control: 'select',
      options: ['up', 'right', 'down', 'left'],
    },
    state: {
      control: 'select',
      options: ['filled', 'outlined'],
    },
    size: {
      control: 'select',
      options: [12, 16, 20, 24],
    },
    color: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof Icon>;

export const Playground: Story = {
  args: {
    name: 'IconClose' as IconName,
    size: 20,
  },
};

export const ArrowDirections: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Icon {...args} direction="up" name={'IconArrow'} />
      <Icon {...args} direction="right" name={'IconArrow'} />
      <Icon {...args} direction="down" name={'IconArrow'} />
      <Icon {...args} direction="left" name={'IconArrow'} />
    </div>
  ),
  args: { size: 20 },
};

export const CaretStates: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Icon {...args} direction="down" name={'IconCaret'} state="outlined" />
      <Icon {...args} direction="down" name={'IconCaret'} state="filled" />
      <Icon {...args} direction="up" name={'IconCaret'} state="outlined" />
      <Icon {...args} direction="up" name={'IconCaret'} state="filled" />
    </div>
  ),
  args: { size: 20 },
};

export const StatefulExamples: Story = {
  render: (args) => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, max-content)',
        gap: 16,
        alignItems: 'center',
      }}
    >
      <Icon {...args} name={'IconStar'} state="outlined" />
      <Icon {...args} name={'IconStar'} state="filled" />
      <Icon {...args} name={'IconFlag'} state="outlined" />
      <Icon {...args} name={'IconFlag'} state="filled" />
      <Icon {...args} name={'IconTag'} state="outlined" />
      <Icon {...args} name={'IconTag'} state="filled" />
      <Icon {...args} name={'IconSecurityAlert'} state="outlined" />
      <Icon {...args} name={'IconSecurityAlert'} state="filled" />
      <Icon {...args} name={'IconStatusAlert'} state="outlined" />
      <Icon {...args} name={'IconStatusAlert'} state="filled" />
      <Icon {...args} name={'IconStatusFailure'} state="outlined" />
      <Icon {...args} name={'IconStatusFailure'} state="filled" />
      <Icon {...args} name={'IconStatusSuccess'} state="outlined" />
      <Icon {...args} name={'IconStatusSuccess'} state="filled" />
      <Icon {...args} name={'IconStatusDenied'} state="outlined" />
      <Icon {...args} name={'IconStatusDenied'} state="filled" />
      <Icon {...args} name={'IconInfo'} state="outlined" />
      <Icon {...args} name={'IconInfo'} state="filled" />
      <Icon {...args} name={'IconPin'} state="outlined" />
      <Icon {...args} name={'IconPin'} state="filled" />
    </div>
  ),
  args: { size: 20 },
};

export const ColorsAndSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <Icon color="#6B7280" name={'IconClose'} size={12} />
      <Icon color="#111827" name={'IconClose'} size={16} />
      <Icon color="rebeccapurple" name={'IconClose'} size={24} />
    </div>
  ),
};
