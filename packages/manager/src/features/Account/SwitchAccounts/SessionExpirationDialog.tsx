import { Duration } from 'luxon';
import { DateTime } from 'luxon';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { ActionsPanel } from 'src/components/ActionsPanel/ActionsPanel';
import { ConfirmationDialog } from 'src/components/ConfirmationDialog/ConfirmationDialog';
import { Typography } from 'src/components/Typography';
import { sessionExpirationContext as _sessionExpirationContext } from 'src/context/sessionExpirationContext';
import { PROXY_STORAGE_EXPIRY_KEY } from 'src/features/Account/constants';
import { getTimeRemaining } from 'src/features/EntityTransfers/EntityTransfersLanding/ConfirmTransferDialog';
import { sendSwitchAccountSessionExpiryEvent } from 'src/utilities/analytics';
import { parseAPIDate } from 'src/utilities/date';
import { pluralize } from 'src/utilities/pluralize';
import { getStorage, setStorage } from 'src/utilities/storage';

interface SessionExpirationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SessionExpirationDialog = React.memo(
  ({ isOpen, onClose }: SessionExpirationDialogProps) => {
    const history = useHistory();
    const sessionExpirationContext = React.useContext(
      _sessionExpirationContext
    );
    const [minutesRemaining, setMinutesRemaining] = React.useState<number>(0);
    const [timeRemaining, setTimeRemaining] = React.useState('');
    // Function to "refresh" the token (for demonstration)
    const refreshToken = () => {
      // console.log('Token refreshed');
      // // Reset the timer by setting a new expiration time in local storage
      // // For demonstration, let's say the token now expires in 15 minutes from now
      // const futureExpiry = new Date().getTime() + 15 * 60 * 1000; // 15 minutes from now
      // localStorage.setItem('token_expiry', futureExpiry.toString());
      // handleClose();
    };

    // Function to "log out" the user
    const logout = () => {
      // console.log('User logged out');
      // localStorage.removeItem('token_expiry'); // Clean up
      // handleClose();
    };

    useEffect(() => {
      let timeoutId: NodeJS.Timeout | undefined;

      const checkTokenExpiry = () => {
        const expiryString = getStorage(PROXY_STORAGE_EXPIRY_KEY);
        if (!expiryString) {
          return;
        }

        // Calculate the difference from now until the expiry time in both minutes and seconds
        const diff = parseAPIDate(expiryString)
          .diffNow(['minutes', 'seconds'])
          .toObject();

        // Format the remaining time as MM:SS, ensuring minutes and seconds are correctly rounded
        const minutes = Math.max(0, Math.floor(diff.minutes ?? 0));
        const seconds = Math.max(0, Math.floor(diff.seconds ?? 0) % 60); // Ensure seconds don't exceed 60
        const formattedTimeRemaining = `${minutes}:${
          seconds < 10 ? '0' : ''
        }${seconds}`;

        setTimeRemaining(formattedTimeRemaining);

        // Determine when to show the expiration warning
        if (minutes <= 5 && seconds <= 59) {
          sessionExpirationContext.updateState({ isOpen: true });
        }

        // Set or reset the timeout to check every second for real-time countdown accuracy
        timeoutId = setTimeout(checkTokenExpiry, 1000);
      };

      // Initial timer setup
      checkTokenExpiry();

      // Cleanup function to clear the timeout when the component unmounts
      return () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };
    }, []);

    const actions = (
      <ActionsPanel
        primaryButtonProps={{
          label: 'Log Out',
          onClick: () => {
            // sendSwitchAccountSessionExpiryEvent('Log Out');
            history.push('/logout');
          },
        }}
        secondaryButtonProps={{
          label: 'Refresh',
          onClick: () => {
            // sendSwitchAccountSessionExpiryEvent('Refresh');
            onClose();
          },
        }}
      />
    );

    return (
      <ConfirmationDialog
        onClose={() => {
          // sendSwitchAccountSessionExpiryEvent('Close');
          onClose();
        }}
        actions={actions}
        data-testid="session-expiration-dialog"
        maxWidth="xs"
        open={isOpen}
        title="Keep Working?"
      >
        <Typography>
          You will be logged out due to inactivity in{' '}
          {pluralize('minute', 'minutes', timeRemaining)}. Do you want to keep
          working?
        </Typography>
      </ConfirmationDialog>
    );
  }
);
