import { Token } from '@linode/api-v4/lib/profile/types';
import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { ActionsPanel } from 'src/components/ActionsPanel/ActionsPanel';
import { ConfirmationDialog } from 'src/components/ConfirmationDialog/ConfirmationDialog';
import { Notice } from 'src/components/Notice/Notice';
import { Typography } from 'src/components/Typography';
import { PROXY_STORAGE_EXPIRY_KEY } from 'src/features/Account/constants';
import {
  getPersonalAccessTokenForRevocation,
  isParentTokenValid,
  setTokenInLocalStorage,
  updateCurrentTokenBasedOnUserType,
} from 'src/features/Account/utils';
import { useCurrentToken } from 'src/hooks/useAuthentication';
import {
  useAccount,
  useCreateChildAccountPersonalAccessTokenMutation,
} from 'src/queries/account/account';
import {
  usePersonalAccessTokensQuery,
  useRevokePersonalAccessTokenMutation,
} from 'src/queries/tokens';
import { parseAPIDate } from 'src/utilities/date';
import { pluralize } from 'src/utilities/pluralize';
import { getStorage, setStorage } from 'src/utilities/storage';

import type { APIError, ChildAccountPayload } from '@linode/api-v4';

interface SessionExpirationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SessionExpirationDialog = React.memo(
  ({ isOpen, onClose }: SessionExpirationDialogProps) => {
    const [error, setError] = React.useState<APIError[]>([]);
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

    const {
      error: createProxyTokenError,
      mutateAsync: createProxyToken,
    } = useCreateChildAccountPersonalAccessTokenMutation({
      euuid,
      headers: {
        Authorization: getStorage('authentication/parent_token/token'),
      },
    });
    const {
      mutateAsync: revokeProxyToken,
    } = useRevokePersonalAccessTokenMutation(pendingRevocationToken?.id ?? -1);

    const formattedTimeRemaining = `${timeRemaining.minutes}:${
      timeRemaining.seconds < 10 ? '0' : ''
    }${timeRemaining.seconds}`;

    const handleRevokeToken = async ({
      tokenLabel,
    }: {
      tokenLabel: string | undefined;
    }) => {
      try {
        await revokeProxyToken();
        enqueueSnackbar(`Successfully revoked ${tokenLabel}.`, {
          variant: 'success',
        });
      } catch (error) {
        enqueueSnackbar(`Failed to revoke ${tokenLabel}.`, {
          variant: 'error',
        });
        throw error;
      }
    };

    const handleRefreshToken = async ({
      euuid,
    }: {
      euuid: ChildAccountPayload['euuid'];
    }) => {
      setContinueWorkingLoading(true);

      try {
        await revokeProxyToken();

        const proxyToken = await createProxyToken({
          euuid,
          headers: {
            Authorization: getStorage('authentication/parent_token/token'),
          },
        });

        setTokenInLocalStorage({
          prefix: 'authentication/proxy_token',
          token: {
            ...proxyToken,
            token: `Bearer ${proxyToken.token}`,
          },
        });

        updateCurrentTokenBasedOnUserType({
          userType: 'proxy',
        });

        location.reload();
      } catch (error) {
        setError(error);
      } finally {
        setContinueWorkingLoading(false);
      }
    };

    const handleLogout = async ({
      pendingRevocationToken,
    }: {
      pendingRevocationToken: Token | undefined;
    }) => {
      setLogoutLoading(true);

      if (!isParentTokenValid()) {
        history.push('/logout');
      }

      try {
        // Revoke proxy token before switching to parent account.
        await handleRevokeToken({
          tokenLabel: pendingRevocationToken?.label,
        });

        updateCurrentTokenBasedOnUserType({ userType: 'parent' });

        // Reset flag for proxy user to display success toast once.
        setStorage('proxy_user', 'false');

        onClose();
        refreshPage();
      } catch (error) {
        setError(error);
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
          onClick: () =>
            handleRefreshToken({
              euuid,
            }),
        }}
        secondaryButtonProps={{
          label: 'Log Out',
          loading: logoutLoading,
          onClick: () => handleLogout({ pendingRevocationToken }),
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
        error={createProxyTokenError?.[0].reason}
        maxWidth="xs"
        open={isOpen}
        title="Session is expiring soon!"
      >
        {error.length > 0 && <Notice text={error[0].reason} variant="error" />}
        <Typography>
          Your session will expire in{' '}
          {pluralize('minute', 'minutes', formattedTimeRemaining)}. Do you want
          to continue working?
        </Typography>
      </ConfirmationDialog>
    );
  }
);
