import * as React from 'react';
import Paper from 'src/components/core/Paper';
import { makeStyles } from 'tss-react/mui';
import { Theme } from '@mui/material/styles';
import Typography from 'src/components/core/Typography';
import Grid from 'src/components/Grid';

const useStyles = makeStyles()((theme: Theme) => ({
  root: {},
  attachmentPaper: {
    marginTop: 4,
    padding: `${theme.spacing(1.5)} ${theme.spacing(3)} 0`,
    overflowX: 'auto',
    border: `1px solid ${theme.color.grey2}`,
  },
  attachmentRow: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    marginBottom: 12,
    '&:last-child': {
      marginBottom: 0,
      border: 0,
    },
  },
  attachmentIcon: {
    paddingLeft: `0 !important`,
    color: theme.palette.text.primary,
  },
}));

interface Props {
  attachments: string[];
  icons: JSX.Element[];
}

const TicketAttachmentRow = (props: Props) => {
  const { classes } = useStyles();
  const { attachments, icons } = props;
  return (
    <Grid item>
      <Paper className={classes.attachmentPaper}>
        {attachments.map((attachment, idx) => {
          return (
            <Grid
              container
              wrap="nowrap"
              key={idx}
              className={classes.attachmentRow}
              data-qa-attachment-row
            >
              <Grid item className={classes.attachmentIcon}>
                {icons[idx]}
              </Grid>
              <Grid item>
                <Typography component="span">{attachment}</Typography>
              </Grid>
            </Grid>
          );
        })}
      </Paper>
    </Grid>
  );
};

export default TicketAttachmentRow;
