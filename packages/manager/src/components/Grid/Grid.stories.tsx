import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
import Grid2 from '@mui/material/Unstable_Grid2';

const meta: Meta<typeof Grid2> = {
  title: 'Components/Grid2',
  component: Grid2,
  argTypes: {
    children: {
      table: {
        disable: true,
      },
    },
    className: {
      table: {
        disable: true,
      },
    },
    container: {
      table: {
        disable: true,
      },
    },
    direction: {
      table: {
        disable: true,
      },
    },
    justifyContent: {
      table: {
        disable: true,
      },
    },
    spacing: {
      table: {
        disable: true,
      },
    },
    wrap: {
      table: {
        disable: true,
      },
    },
  },
  args: {
    container: true,
    spacing: 2,
  },
};

export default meta;

type Story = StoryObj<typeof Grid2>;

export const Default: Story = {
  args: {
    children: 'Grid2',
  },
  render: (args) => <Grid2 {...args} />,
};

export const ItemWithSpacing: Story = {
  args: {
    ...Default.args,
    spacing: 2,
  },
  render: (args) => <Grid2 {...args} />,
};

export const ItemWithSpacingAndDirection: Story = {
  args: {
    ...ItemWithSpacing.args,
    direction: 'row',
  },
  render: (args) => <Grid2 {...args} />,
};

export const ItemWithSpacingAndDirectionAndWrap: Story = {
  args: {
    ...ItemWithSpacingAndDirection.args,
    wrap: 'nowrap',
  },
  render: (args) => <Grid2 {...args} />,
};

export const ItemWithSpacingAndDirectionAndWrapAndJustifyContent: Story = {
  args: {
    ...ItemWithSpacingAndDirectionAndWrap.args,
    justifyContent: 'center',
  },
  render: (args) => <Grid2 {...args} />,
};
