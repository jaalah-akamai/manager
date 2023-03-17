import { Event } from '@linode/api-v4/lib/account/types';
import * as React from 'react';
import Box from 'src/components/core/Box';
import Divider from 'src/components/core/Divider';
import { makeStyles } from 'tss-react/mui';
import { Theme } from '@mui/material/styles';
import Typography from 'src/components/core/Typography';
import HighlightedMarkdown from 'src/components/HighlightedMarkdown';
import { GravatarByUsername } from 'src/components/GravatarByUsername';
import { parseAPIDate } from 'src/utilities/date';
import useEventInfo from './useEventInfo';

// TODO jss-to-tss-react codemod: usages of this hook outside of this file will not be converted.
export const useStyles = makeStyles()((theme: Theme) => ({
  root: {
    paddingTop: 12,
    paddingBottom: 12,
    width: '100%',
    gap: 16,
  },
  icon: {
    height: 40,
    minWidth: 40,
  },
  event: {
    color: theme.textColors.tableHeader,
    '&:hover': {
      backgroundColor: theme.bg.app,
      // Extends the hover state to the edges of the drawer
      marginLeft: -20,
      marginRight: -20,
      paddingLeft: 20,
      paddingRight: 20,
      width: 'calc(100% + 40px)',
    },
  },
  eventMessage: {
    marginTop: 2,
  },
  unseenEvent: {
    color: theme.textColors.headlineStatic,
    textDecoration: 'none',
  },
}));

interface Props {
  event: Event;
  onClose: () => void;
}

export const RenderEvent: React.FC<Props> = (props) => {
  const { classes, cx } = useStyles();

  const { event } = props;
  const { message } = useEventInfo(event);

  if (message === null) {
    return null;
  }

  const eventMessage = (
    <div
      className={cx({
        [classes.unseenEvent]: !event.seen,
      })}
    >
      <HighlightedMarkdown textOrMarkdown={message} />
    </div>
  );

  return (
    <>
      <Box
        className={cx({
          [classes.root]: true,
          [classes.event]: true,
        })}
        display="flex"
        data-test-id={event.action}
      >
        <GravatarByUsername
          username={event.username}
          className={classes.icon}
        />
        <div className={classes.eventMessage}>
          {eventMessage}
          <Typography className={cx({ [classes.unseenEvent]: !event.seen })}>
            {parseAPIDate(event.created).toRelative()}
          </Typography>
        </div>
      </Box>
      <Divider />
    </>
  );
};

export default React.memo(RenderEvent);
