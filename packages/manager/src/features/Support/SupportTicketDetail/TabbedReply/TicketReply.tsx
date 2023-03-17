import * as React from 'react';
import { withStyles } from 'tss-react/mui';
import { WithStyles } from '@mui/styles';
import TextField from 'src/components/TextField';

type ClassNames = 'replyField';

const styles = () => ({
  replyField: {
    marginTop: 0,
    '& > div': {
      maxWidth: '100% !important',
    },
  },
});

export interface Props {
  error?: string;
  handleChange: (value: string) => void;
  value: string;
  placeholder?: string;
}

type CombinedProps = Props & WithStyles<ClassNames>;

class TicketReply extends React.Component<CombinedProps> {
  render() {
    const { placeholder, classes, value, handleChange, error } = this.props;

    return (
      <TextField
        className={classes.replyField}
        multiline
        rows={1.8}
        value={value}
        placeholder={placeholder || 'Enter your reply'}
        data-qa-ticket-description
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          handleChange(e.target.value)
        }
        errorText={error}
        label="Enter your reply"
        hideLabel
      />
    );
  }
}

export default withStyles(TicketReply, styles);
