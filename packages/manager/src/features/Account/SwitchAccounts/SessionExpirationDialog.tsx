import { Token } from '@linode/api-v4/lib/profile/types';
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { DateTime } from 'luxon';
import { Duration } from 'luxon';
import { useSnackbar } from 'notistack';
import { set } from 'ramda';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {handleRefreshTokens} from 'src/store/authentication/authentication.actions';
import { ActionsPanel } from 'src/components/ActionsPanel/ActionsPanel';
import { ConfirmationDialog } from 'src/components/ConfirmationDialog/ConfirmationDialog';
import { Notice } from 'src/components/Notice/Notice';
import { Typography } from 'src/components/Typography';
import { sessionExpirationContext as _sessionExpirationContext } from 'src/context/sessionExpirationContext';
import { PROXY_STORAGE_EXPIRY_KEY } from 'src/features/Account/constants';
import {
  getProxyToken,
  isTokenValid,
  setTokenInLocalStorage,
  updateCurrentTokenBasedOnUserType,
} from 'src/features/Account/utils';
import { getTimeRemaining } from 'src/features/EntityTransfers/EntityTransfersLanding/ConfirmTransferDialog';
import { useOrder } from 'src/hooks/useOrder';
import { usePagination } from 'src/hooks/usePagination';
import { usePendingRevocationToken } from 'src/hooks/usePendingRevocationToken';
import { useAccount } from 'src/queries/account';
import { profileQueries } from 'src/queries/profile';
import {
  useRevokeAppAccessTokenMutation,
  useRevokePersonalAccessTokenMutation,
} from 'src/queries/tokens';
import {
  useAppTokensQuery,
  usePersonalAccessTokensQuery,
} from 'src/queries/tokens';
import { sendSwitchAccountSessionExpiryEvent } from 'src/utilities/analytics';
import { parseAPIDate } from 'src/utilities/date';
import { pluralize } from 'src/utilities/pluralize';
import { getStorage, setStorage } from 'src/utilities/storage';

import type { APIError, ChildAccountPayload, UserType } from '@linode/api-v4';
interface SessionExpirationDialogProps {
  currentToken: Token | undefined;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

const PREFERENCE_KEY = 'api-tokens';

export const SessionExpirationDialog = React.memo(
  ({ currentToken, isOpen, onClose, onOpen }: SessionExpirationDialogProps) => {
    const currentTokenId = currentToken?.id;
    const [showSessionDialog, setShowSessionDialog] = React.useState(false);
    const history = useHistory();
    const queryClient = useQueryClient();
    const [selectedTokenId, setSelectedTokenId] = React.useState<number>();
    const [isProxyTokenError, setIsProxyTokenError] = React.useState<
      APIError[]
    >([]);
    const { enqueueSnackbar } = useSnackbar();
    const { handleOrderChange, order, orderBy } = useOrder(
      {
        order: 'desc',
        orderBy: 'created',
      },
      `${PREFERENCE_KEY}-order}`,
      'token'
    );
    const pagination = usePagination(1, PREFERENCE_KEY);
    const { data, error, isLoading } = usePersonalAccessTokensQuery(
      {
        page: pagination.page,
        page_size: pagination.pageSize,
      },
      { '+order': order, '+order_by': orderBy }
    );

    const { data: account } = useAccount();
    const euuid = account?.euuid ?? '';

    const selectedToken = data?.data.find(
      (token) => token.id === selectedTokenId
    );

    const {
      error: revokeError,
      isLoading: revokeLoading,
      mutateAsync: revokeToken,
    } = useRevokePersonalAccessTokenMutation(currentTokenId ?? -1);

    const sessionExpirationContext = React.useContext(
      _sessionExpirationContext
    );
    const [timeRemaining, setTimeRemaining] = React.useState<{
      minutes: number;
      seconds: number;
    }>({
      minutes: 15,
      seconds: 0,
    });

    const formattedTimeRemaining = `${timeRemaining.minutes}:${
      timeRemaining.seconds < 10 ? '0' : ''
    }${timeRemaining.seconds}`;

    const handleProxyTokenRevocation = React.useCallback(
      async (currentTokenLabel: string | undefined) => {
        try {
          await revokeToken();
          enqueueSnackbar(`Successfully revoked ${currentTokenLabel}.`, {
            variant: 'success',
          });
        } catch (error) {
          enqueueSnackbar(`Failed to revoke ${currentTokenLabel}.`, {
            variant: 'error',
          });
        }
      },
      [enqueueSnackbar, revokeToken]
    );

    // Function to "refresh" the token (for demonstration)
    const refreshToken = async ({
      currentTokenLabel,
      euuid,
    }: {
      currentTokenLabel: string | undefined;
      euuid: ChildAccountPayload['euuid'];
    }) => {
      await handleProxyTokenRevocation(currentTokenLabel);

      try {
        const proxyToken = await getProxyToken({
          euuid,
          token: getStorage('authentication/parent_token/token'),
          userType: 'proxy',
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

        // handleRefreshTokens();
        location.reload();
      } catch (error) {
        return setIsProxyTokenError(error);
      }
    };

    // Function to "log out" the user
    const logout = () => {
      // mutateAsync().then(() => {
      //   onClose();
      //   enqueueSnackbar(`Successfully revoked ${token?.label}`, {
      //     variant: 'success',
      //   });
      // });
      // onClose();
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

    useEffect(() => {
     // Determine when to show the expiration warning
     if (timeRemaining.minutes <= 14 && timeRemaining.seconds <= 50 && !showSessionDialog) {
        setShowSessionDialog(true);
        onOpen();
      }
    }, [timeRemaining, showSessionDialog, sessionExpirationContext]);

    const actions = (
      <ActionsPanel
        primaryButtonProps={{
          label: 'Continue Working',
          onClick: () =>
            refreshToken({
              currentTokenLabel: currentToken?.label,
              euuid,
            }),
        }}
        secondaryButtonProps={{
          label: 'Log Out',
          onClick: () => {
            // sendSwitchAccountSessionExpiryEvent('Refresh');
            history.push('/logout');
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
        // onOpen={onOpen}
        actions={actions}
        data-testid="session-expiration-dialog"
        maxWidth="xs"
        open={isOpen}
        title="Session is expiring soon!"
      >
        {isProxyTokenError.length > 0 && (
          <Notice text={isProxyTokenError[0].reason} variant="error" />
        )}
        <Typography>
          You will be logged out due to inactivity in{' '}
          {pluralize('minute', 'minutes', formattedTimeRemaining)}. Do you want to
          continue working?
        </Typography>
      </ConfirmationDialog>
    );
  }
);
