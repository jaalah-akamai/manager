import { action } from '@storybook/addon-actions';
import React from 'react';

import { TextFieldHelperText } from 'src/components/TextField/TextFieldHelperText';

import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import type { TextFieldHelperTextProps } from 'src/components/TextField/TextFieldHelperText';

// Story Config ========================================================

const meta: Meta<TextFieldHelperTextProps> = {
  argTypes: {
    onClick: {
      action: 'onClick',
    },
  },
  args: {
    linkText: 'endpoint types',
    onClick: action('onClick'),
    textAfter: '.',
    textBefore:
      'Endpoint types impact the performance, capacity, and rate limits for your bucket. Understand',
    to: 'https://www.cloud.linode.com/',
  },
  component: TextFieldHelperText,
  decorators: [
    (Story: StoryFn) => (
      <div style={{ marginLeft: '2em', minHeight: 270 }}>
        <Story />
      </div>
    ),
  ],
  title: 'Components/TextField/TextFieldHelperText',
};

export default meta;

type Story = StoryObj<typeof TextFieldHelperText>;

// Story Definitions ==========================================================

export const Default: Story = {
  render: (args) => <TextFieldHelperText {...args} />,
};
