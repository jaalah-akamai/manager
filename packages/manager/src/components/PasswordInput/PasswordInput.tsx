import { isEmpty } from 'ramda';
import * as React from 'react';
import { makeStyles } from '@mui/styles';
import Grid from 'src/components/Grid';
import { Props as TextFieldProps } from 'src/components/TextField';
import zxcvbn from 'zxcvbn';
import StrengthIndicator from '../PasswordInput/StrengthIndicator';
import HideShowText from './HideShowText';

type Props = TextFieldProps & {
  value?: string | undefined;
  required?: boolean;
  disabledReason?: string | JSX.Element;
  tooltipInteractive?: boolean;
  hideStrengthLabel?: boolean;
  hideValidation?: boolean;
};

const useStyles = makeStyles(() => ({
  container: {
    position: 'relative',
    paddingBottom: 4,
  },
  usernameInput: {
    display: 'none',
  },
}));

type CombinedProps = Props;

const PasswordInput: React.FC<CombinedProps> = (props) => {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (props.onChange) {
      props.onChange(e);
    }
  };

  const {
    value,
    required,
    disabledReason,
    tooltipInteractive,
    hideStrengthLabel,
    hideValidation,
    ...rest
  } = props;

  const classes = useStyles();

  const [zxcvbnLoaded, setZxcvbnLoaded] = React.useState(false);
  const strength = React.useMemo(() => {
    if (!zxcvbnLoaded) {
      return null;
    }
    return maybeStrength(value);
  }, [value, zxcvbnLoaded]);

  React.useEffect(() => {
    import('zxcvbn').then(() => {
      setZxcvbnLoaded(true);
    });
  }, []);

  return (
    <Grid container className={classes.container}>
      <Grid item xs={12}>
        <input
          type="text"
          name="name"
          aria-hidden="true"
          autoComplete="off"
          className={classes.usernameInput}
          value="root"
          readOnly
        />
        <HideShowText
          {...rest}
          tooltipText={disabledReason}
          tooltipInteractive={tooltipInteractive}
          value={value}
          onChange={onChange}
          fullWidth
          required={required}
        />
      </Grid>
      {!hideValidation && (
        <Grid item xs={12}>
          <StrengthIndicator
            strength={strength}
            hideStrengthLabel={hideStrengthLabel}
          />
        </Grid>
      )}
    </Grid>
  );
};

const maybeStrength = (value?: string) => {
  if (!value || isEmpty(value)) {
    return null;
  }

  return zxcvbn(value).score;
};

export default React.memo(PasswordInput);
