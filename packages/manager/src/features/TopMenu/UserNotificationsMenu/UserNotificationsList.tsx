import { Notification } from '@linode/api-v4/lib/account';
import { path } from 'ramda';
import * as React from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { makeStyles } from 'tss-react/mui';
import { Theme } from '@mui/material/styles';
import Typography from 'src/components/core/Typography';
import { dcDisplayNames } from 'src/constants';
import { reportException } from 'src/exceptionReporting';
import UserNotificationListItem from './UserNotificationListItem';

const useStyles = makeStyles()((theme: Theme) => ({
  emptyText: {
    padding: `${theme.spacing(2)} ${theme.spacing(3)}`,
    fontFamily: theme.font.bold,
  },
}));

interface Props {
  notifications: Notification[];
  closeMenu: () => void;
}

type CombinedProps = Props & RouteComponentProps<void>;

const UserNotificationsList = ({ notifications, closeMenu }: CombinedProps) => {
  const { classes } = useStyles();
  const history = useHistory();
  const { push } = history;

  if (notifications.length === 0) {
    return (
      <Typography className={classes.emptyText}>
        You have no notifications.
      </Typography>
    );
  }

  return (notifications || []).map((notification, idx) => {
    const interceptedNotification = interceptNotification(notification);
    const onClick = createClickHandlerForNotification(
      interceptedNotification,
      (targetPath: string) => {
        closeMenu();
        push(targetPath);
      }
    );

    return (
      <UserNotificationListItem
        key={idx}
        label={interceptedNotification.label}
        message={interceptedNotification.message}
        severity={interceptedNotification.severity}
        onClick={onClick}
      />
    );
  });
};

const interceptNotification = (notification: Notification): Notification => {
  /** this is an outage to one of the datacenters */
  if (
    notification.type === 'outage' &&
    notification.entity &&
    notification.entity.type === 'region'
  ) {
    const convertedRegion = dcDisplayNames[notification.entity.id];

    if (!convertedRegion) {
      reportException(
        'Could not find the DC name for the outage notification',
        {
          rawRegion: notification.entity.id,
          convertedRegion,
        }
      );
    }

    /** replace "this facility" with the name of the datacenter */
    return {
      ...notification,
      label: notification.label
        .toLowerCase()
        .replace('this facility', convertedRegion || 'one of our facilities'),
      message: notification.message
        .toLowerCase()
        .replace('this facility', convertedRegion || 'one of our facilities'),
    };
  }

  /** there is maintenance on this Linode */
  if (
    notification.type === 'maintenance' &&
    notification.entity &&
    notification.entity.type === 'linode'
  ) {
    /** replace "this Linode" with the name of the Linode */
    const linodeAttachedToNotification = path(['label'], notification.entity);
    return {
      ...notification,
      label: `Maintenance Scheduled`,
      severity: 'major',
      message: `${
        linodeAttachedToNotification
          ? `Linode ${linodeAttachedToNotification}`
          : `This Linode`
      }
          has scheduled maintenance`,
    };
  }

  return notification;
};

const createClickHandlerForNotification = (
  notification: Notification,
  onClick: (path: string) => void
) => {
  const type = path<string>(['entity', 'type'], notification);
  const id = path<number>(['entity', 'id'], notification);

  if (!type || !id) {
    return;
  }

  switch (type) {
    case 'linode':
      return () => onClick(`/linodes/${id}`);

    case 'ticket':
      return () => onClick(`/support/tickets/${id}`);

    default:
      return;
  }
};

export default UserNotificationsList;
