import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { ActionsPanel } from 'src/components/ActionsPanel/ActionsPanel';
import { ConfirmationDialog } from 'src/components/ConfirmationDialog/ConfirmationDialog';
import { Typography } from 'src/components/Typography';
import { PROXY_STORAGE_EXPIRY_KEY } from 'src/features/Account/constants';
import { useParentChildAuthentication } from 'src/features/Account/SwitchAccounts/useParentChildAuthentication';
import { enqueueTokenRevocation } from 'src/features/Account/SwitchAccounts/utils';
import {
  getPersonalAccessTokenForRevocation,
  setTokenInLocalStorage,
} from 'src/features/Account/SwitchAccounts/utils';
import { useCurrentToken } from 'src/hooks/useAuthentication';
import { useAccount } from 'src/queries/account/account';
import { usePersonalAccessTokensQuery } from 'src/queries/tokens';
import { parseAPIDate } from 'src/utilities/date';
import { pluralize } from 'src/utilities/pluralize';
import { getStorage, setStorage } from 'src/utilities/storage';

interface SessionExpirationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SessionExpirationDialog = React.memo(
  ({ isOpen, onClose }: SessionExpirationDialogProps) => {
    const [timeRemaining, setTimeRemaining] = React.useState<{
      minutes: number;
      seconds: number;
    }>({
      minutes: 15,
      seconds: 0,
    });
    // Both action buttons revoke tokens, so we can't use loading state from React Query.
    const [continueWorkingLoading, setContinueWorkingLoading] = React.useState(
      false
    );
    const [logoutLoading, setLogoutLoading] = React.useState(false);

    const { data: personalAccessTokens } = usePersonalAccessTokensQuery();
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();
    const { data: account } = useAccount();
    const currentTokenWithBearer = useCurrentToken() ?? '';

    const euuid = account?.euuid ?? '';
    const pendingRevocationToken = getPersonalAccessTokenForRevocation(
      personalAccessTokens?.data,
      currentTokenWithBearer
    );
    const pendingRevocationTokenLabel = pendingRevocationToken?.label;

    const {
      createToken,
      createTokenError,
      revokeToken,
      revokeTokenError,
      updateToken,
      validateParentToken,
    } = useParentChildAuthentication({
      euuid,
      tokenIdToRevoke: pendingRevocationToken?.id ?? -1,
    });

    const revokeTokenErrorReason = revokeTokenError?.[0]?.reason;
    const createTokenErrorReason = createTokenError?.[0]?.reason;

    const formattedTimeRemaining = `${timeRemaining.minutes}:${
      timeRemaining.seconds < 10 ? '0' : ''
    }${timeRemaining.seconds}`;

    const handleEnqueueTokenRevocation = React.useCallback(async () => {
      await enqueueTokenRevocation({
        enqueueSnackbar,
        revokeToken,
        tokenLabel: pendingRevocationTokenLabel,
      });
    }, [enqueueSnackbar, pendingRevocationTokenLabel, revokeToken]);

    const handleRefreshToken = async () => {
      setContinueWorkingLoading(true);

      try {
        await revokeToken();

        const proxyToken = await createToken();

        if (!proxyToken) {
          throw new Error(createTokenErrorReason);
        }

        setTokenInLocalStorage({
          prefix: 'authentication/proxy_token',
          token: {
            ...proxyToken,
            token: `Bearer ${proxyToken.token}`,
          },
        });

        updateToken({ userType: 'proxy' });

        location.reload();
      } catch (error) {
        // Swallow error
      } finally {
        setContinueWorkingLoading(false);
      }
    };

    const handleLogout = async () => {
      setLogoutLoading(true);

      if (!validateParentToken()) {
        history.push('/logout');
      }

      try {
        await handleEnqueueTokenRevocation();

        updateToken({ userType: 'parent' });

        // Reset flag for proxy user to display success toast once.
        setStorage('is_proxy_user', 'false');

        onClose();
        refreshPage();
      } catch (error) {
        // Swallow error
      } finally {
        setLogoutLoading(false);
      }
    };

    const refreshPage = React.useCallback(() => {
      location.reload();
    }, []);

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

        setTimeRemaining({
          minutes,
          seconds,
        });

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
          label: 'Continue Working',
          loading: continueWorkingLoading,
          onClick: handleRefreshToken,
        }}
        secondaryButtonProps={{
          label: 'Log Out',
          loading: logoutLoading,
          onClick: handleLogout,
        }}
      />
    );

    return (
      <ConfirmationDialog
        onClose={() => {
          onClose();
        }}
        actions={actions}
        data-testid="session-expiration-dialog"
        error={createTokenErrorReason || revokeTokenErrorReason}
        maxWidth="xs"
        open={isOpen}
        title="Session is expiring soon!"
      >
        <Typography>
          Your session will expire in{' '}
          {pluralize('minute', 'minutes', formattedTimeRemaining)}. Do you want
          to continue working?
        </Typography>
      </ConfirmationDialog>
    );
  }
);
