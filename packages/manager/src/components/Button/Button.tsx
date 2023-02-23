import * as React from 'react';
import Reload from 'src/assets/icons/reload.svg';
import _Button, { ButtonProps } from '@mui/material/Button';
import { keyframes } from 'tss-react';
import { styled, useTheme } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import HelpIcon from 'src/components/HelpIcon';

export interface Props extends ButtonProps {
  buttonType?: 'primary' | 'secondary' | 'outlined';
  sx?: SxProps;
  compactX?: boolean;
  compactY?: boolean;
  loading?: boolean;
  tooltipText?: string;
}

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const BaseButton = styled(_Button, {
  shouldForwardProp: (prop) =>
    prop !== 'buttonType' &&
    prop !== 'compactX' &&
    prop !== 'compactY' &&
    prop !== 'loading',
})<Props>(({ theme, buttonType, compactX, compactY, loading }) => ({
  ...(buttonType === 'secondary' &&
    compactX && { minWidth: 50, paddingRight: 0, paddingLeft: 0 }),
  ...(buttonType === 'secondary' &&
    compactY && { minHeight: 20, paddingTop: 0, paddingBottom: 0 }),
  ...(loading && {
    '& svg': {
      animation: `${rotate} 2s linear infinite`,
      margin: '0 auto',
      height: `${theme.spacing(2)}`,
      width: `${theme.spacing(2)}`,
    },
  }),
}));

const Span = styled('span')({
  display: 'flex',
  alignItems: 'center',
  '@supports (-moz-appearance: none)': {
    /* Fix text alignment for Firefox */
    marginTop: 2,
  },
});

export const Button = ({
  buttonType,
  children,
  compactX,
  compactY,
  disabled,
  loading,
  sx,
  tooltipText,
  ...rest
}: Props) => {
  const theme = useTheme();
  const color = buttonType === 'primary' ? 'primary' : 'secondary';
  const variant =
    buttonType === 'primary' || buttonType === 'secondary'
      ? 'contained'
      : 'outlined';
  const sxHelpIcon = {
    marginLeft: `-${theme.spacing()}`,
  };

  return (
    <React.Fragment>
      <BaseButton
        {...rest}
        color={color}
        compactX={compactX}
        compactY={compactY}
        disabled={disabled || loading}
        sx={sx}
        variant={variant}
      >
        <Span data-qa-loading={loading}>{loading ? <Reload /> : children}</Span>
      </BaseButton>
      {tooltipText && <HelpIcon sx={sxHelpIcon} text={tooltipText} />}
    </React.Fragment>
  );
};

export default Button;
