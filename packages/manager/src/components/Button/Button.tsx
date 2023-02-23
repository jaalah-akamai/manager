import * as React from 'react';
import Reload from 'src/assets/icons/reload.svg';
import { ButtonProps } from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import HelpIcon from 'src/components/HelpIcon';
import { BaseButton, Span } from './Button.styles';

export interface Props extends ButtonProps {
  buttonType?: 'primary' | 'secondary' | 'outlined';
  sx?: SxProps;
  compactX?: boolean;
  compactY?: boolean;
  loading?: boolean;
  tooltipText?: string;
}

export const Button = ({
  buttonType,
  children,
  className,
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
  const sxHelpIcon = { marginLeft: `-${theme.spacing()}` };

  const variant =
    buttonType === 'primary' || buttonType === 'secondary'
      ? 'contained'
      : buttonType === 'outlined'
      ? 'outlined'
      : 'text';

  return (
    <React.Fragment>
      <BaseButton
        {...rest}
        className={className}
        color={color}
        compactX={compactX}
        compactY={compactY}
        disabled={disabled || loading}
        loading={loading}
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
