import { action } from '@storybook/addon-actions';
import React from 'react';

import { Select } from './Select';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Select> = {
  argTypes: {},
  args: {},
  component: Select,
  title: 'Components/Select',
};

export default meta;

type Story = StoryObj<typeof Select>;

export const Default: Story = {
  args: {
    onChange: action('onChange'),
  },
  render: (args) => <Select {...args} />,
};
