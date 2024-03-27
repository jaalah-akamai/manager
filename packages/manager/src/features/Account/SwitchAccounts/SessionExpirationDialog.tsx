import { Token } from '@linode/api-v4/lib/profile/types';
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { Duration } from 'luxon';
import { DateTime } from 'luxon';
import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

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
  useAppTokensQuery,
  usePersonalAccessTokensQuery,
} from 'src/queries/tokens';
import {
  useRevokeAppAccessTokenMutation,
  useRevokePersonalAccessTokenMutation,
} from 'src/queries/tokens';
import { sendSwitchAccountSessionExpiryEvent } from 'src/utilities/analytics';
import { parseAPIDate } from 'src/utilities/date';
import { pluralize } from 'src/utilities/pluralize';
import { getStorage, setStorage } from 'src/utilities/storage';

import type { APIError, ChildAccountPayload, UserType } from '@linode/api-v4';
interface SessionExpirationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  tokenId: number | undefined;
}

const PREFERENCE_KEY = 'api-tokens';

export const SessionExpirationDialog = React.memo(
  ({ isOpen, onClose, tokenId }: SessionExpirationDialogProps) => {
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
    } = useRevokePersonalAccessTokenMutation(tokenId ?? -1);

    const sessionExpirationContext = React.useContext(
      _sessionExpirationContext
    );
    const [timeRemaining, setTimeRemaining] = React.useState('');

    const handleProxyTokenRevocation = React.useCallback(
      async (tokenId: number | undefined) => {
        try {
          await revokeToken();
          enqueueSnackbar(`Successfully revoked ${tokenId}.`, {
            variant: 'success',
          });
        } catch (error) {
          enqueueSnackbar('Failed to revoke token.', {
            variant: 'error',
          });
        }
      },
      [enqueueSnackbar, revokeToken]
    );

    // Function to "refresh" the token (for demonstration)
    const refreshToken = async ({
      euuid,
      tokenId
    }: {
      euuid: ChildAccountPayload['euuid'];
      tokenId: number | undefined;
    }) => {
      await handleProxyTokenRevocation(tokenId);

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

        queryClient.invalidateQueries(profileQueries.personalAccessTokens._def);
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

    // React.useEffect(() => {
    //   if (Boolean(sessionExpirationContext.isOpen)) {
    //     getPendingRevocationToken()
    //   }
    // } , [Boolean(sessionExpirationContext.isOpen)])

    React.useEffect(() => {
      console.log({ tokenId });
    }, [tokenId]);

    const actions = (
      <ActionsPanel
        primaryButtonProps={{
          label: 'Continue Working',
          onClick: () =>
            refreshToken({
              euuid,
              tokenId
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
          {pluralize('minute', 'minutes', timeRemaining)}. Do you want to
          continue working?
        </Typography>
      </ConfirmationDialog>
    );
  }
);
