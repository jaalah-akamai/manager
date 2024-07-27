import * as React from 'react';

import { Box } from 'src/components/Box';
import { Link } from 'src/components/Link';
import { Typography } from 'src/components/Typography';

import type { BoxProps } from 'src/components/Box';

export interface TextFieldHelperTextProps extends BoxProps {
  /**
   * The text to be displayed as the link.
   */
  linkText: string;

  /**
   * Callback function to be called when the link is clicked.
   */
  onClick?: () => void;

  /**
   * Text to be displayed after the link. Optional.
   */
  textAfter?: React.ReactNode;

  /**
   * Text to be displayed before the link. Optional.
   */
  textBefore?: React.ReactNode;

  /**
   * The URL to which the link points.
   */
  to: string;
}

export const TextFieldHelperText = ({
  linkText,
  onClick,
  textAfter,
  textBefore,
  to,
  ...rest
}: TextFieldHelperTextProps) => {
  return (
    <Box {...rest}>
      <Typography variant="body1">
        {textBefore && <>{textBefore} </>}
        <Link onClick={onClick} to={to}>
          {linkText}
        </Link>
        {textAfter && <> {textAfter}</>}
      </Typography>
    </Box>
  );
};
