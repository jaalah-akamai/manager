import _Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { Props } from './Button';
import { isPropValid } from '../../utilities/isPropValid';
import { rotate360 } from '../../styles/keyframes';

export const BaseButton = styled(_Button, {
  shouldForwardProp: (prop) =>
    isPropValid(['compactX', 'compactY', 'loading'], prop),
  name: 'BaseButton',
})<Props>(({ theme, ...props }) => ({
  ...(props.buttonType === 'secondary' &&
    props.compactX && {
      minWidth: 50,
      paddingRight: 0,
      paddingLeft: 0,
    }),
  ...(props.buttonType === 'secondary' &&
    props.compactY && {
      minHeight: 20,
      paddingTop: 0,
      paddingBottom: 0,
    }),
  ...(props.loading && {
    '& svg': {
      animation: `${rotate360} 2s linear infinite`,
      margin: '0 auto',
      height: `${theme.spacing(2)}`,
      width: `${theme.spacing(2)}`,
    },
  }),
}));

export const Span = styled('span')({
  display: 'flex',
  alignItems: 'center',
  '@supports (-moz-appearance: none)': {
    /* Fix text alignment for Firefox */
    marginTop: 2,
  },
});
