import { create } from 'lodash';
import { useSnackbar } from 'notistack';
import React from 'react';

import { StyledLinkButton } from 'src/components/Button/StyledLinkButton';
import { Drawer } from 'src/components/Drawer';
import { Notice } from 'src/components/Notice/Notice';
import { Typography } from 'src/components/Typography';
import { PARENT_USER_SESSION_EXPIRED } from 'src/features/Account/constants';
import { useParentChildAuthentication } from 'src/features/Account/SwitchAccounts/useParentChildAuthentication';
import {
  isParentTokenValid,
  updateCurrentTokenBasedOnUserType,
} from 'src/features/Account/SwitchAccounts/utils';
import {
  getPersonalAccessTokenForRevocation,
  setTokenInLocalStorage,
} from 'src/features/Account/SwitchAccounts/utils';
import { useCurrentToken } from 'src/hooks/useAuthentication';
import { useRevokePersonalAccessTokenMutation } from 'src/queries/tokens';
import { sendSwitchToParentAccountEvent } from 'src/utilities/analytics';
import { getStorage, setStorage } from 'src/utilities/storage';

import { ChildAccountList } from './SwitchAccounts/ChildAccountList';
import {
  enqueueTokenRevocation,
  updateParentTokenInLocalStorage,
  updateProxyTokenInLocalStorage,
} from './SwitchAccounts/utils';

import type { APIError, Token, UserType } from '@linode/api-v4';
import type { State as AuthState } from 'src/store/authentication';

interface Props {
  onClose: () => void;
  open: boolean;
  proxyToken?: Token;
  userType: UserType | undefined;
}

interface handleSwitchToChildAccountProps {
  currentTokenWithBearer?: AuthState['token'];
  euuid: string;
  event: React.MouseEvent<HTMLElement>;
  onClose: (e: React.SyntheticEvent<HTMLElement>) => void;
  userType: UserType | undefined;
}

export const SwitchAccountDrawer = (props: Props) => {
  const { onClose, open, proxyToken, userType } = props;
  const proxyTokenLabel = proxyToken?.label;
  const isProxyUser = userType === 'proxy';

  const [isParentTokenError, setIsParentTokenError] = React.useState<
    APIError[]
  >([]);
  // const [isProxyTokenError, setIsProxyTokenError] = React.useState<APIError[]>(
  //   []
  // );

  const {
    createToken,
    createTokenError,
    revokeToken,
    updateToken,
    validateParentToken,
  } = useParentChildAuthentication({
    tokenIdToRevoke: proxyToken?.id ?? -1,
  });

  const createTokenErrorReason = createTokenError?.[0]?.reason;

  // const { mutateAsync: revokeToken } = useRevokePersonalAccessTokenMutation(
  //   proxyToken?.id ?? -1
  // );
  const { enqueueSnackbar } = useSnackbar();
  const currentTokenWithBearer = useCurrentToken() ?? '';

  const currentParentTokenWithBearer =
    getStorage('authentication/parent_token/token') ?? '';

  const handleEnqueueTokenRevocation = React.useCallback(async () => {
    await enqueueTokenRevocation({
      enqueueSnackbar,
      revokeToken,
      tokenLabel: proxyTokenLabel,
    });
  }, [enqueueSnackbar, proxyTokenLabel, revokeToken]);

  const refreshPage = React.useCallback(() => {
    location.reload();
  }, []);

  const handleSwitchToChildAccount = React.useCallback(
    async ({
      currentTokenWithBearer,
      euuid,
      event,
      onClose,
      userType,
    }: handleSwitchToChildAccountProps) => {
      const isProxyUser = userType === 'proxy';

      if (isProxyUser) {
        // Revoke proxy token before switching accounts.
        await handleEnqueueTokenRevocation();
      } else {
        // Before switching to a child account, update the parent token in local storage.
        updateParentTokenInLocalStorage({ currentTokenWithBearer });
      }

      try {
        const proxyToken = await createToken(euuid);

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
      } catch (error) {
        console.log('>>>>>', error);
        // Swallow error
        // throw error;
      }

      onClose(event);
      refreshPage();
    },
    [
      handleEnqueueTokenRevocation,
      refreshPage,
      createToken,
      updateToken,
      createTokenErrorReason,
    ]
  );

  const handleSwitchToParentAccount = React.useCallback(async () => {
    if (!validateParentToken()) {
      const expiredTokenError: APIError = {
        field: 'token',
        reason: PARENT_USER_SESSION_EXPIRED,
      };

      setIsParentTokenError([expiredTokenError]);

      return;
    }

    // Revoke proxy token before switching to parent account.
    await handleEnqueueTokenRevocation();

    updateToken({ userType: 'parent' });

    // Reset flag for proxy user to display success toast once.
    setStorage('is_proxy_user', 'false');

    onClose();
    refreshPage();
  }, [
    onClose,
    handleEnqueueTokenRevocation,
    refreshPage,
    validateParentToken,
    updateToken,
  ]);

  return (
    <Drawer onClose={onClose} open={open} title="Switch Account">
      {createTokenErrorReason && (
        <Notice text={createTokenErrorReason} variant="error" />
      )}
      {isParentTokenError.length > 0 && (
        <Notice text={isParentTokenError[0].reason} variant="error" />
      )}
      <Typography
        sx={(theme) => ({
          margin: `${theme.spacing(3)} 0`,
        })}
      >
        Select an account to view and manage its settings and configurations
        {isProxyUser && (
          <>
            {' or '}
            <StyledLinkButton
              onClick={() => {
                sendSwitchToParentAccountEvent();
                handleSwitchToParentAccount();
              }}
              aria-label="parent-account-link"
            >
              switch back to your account
            </StyledLinkButton>
          </>
        )}
        .
      </Typography>
      <ChildAccountList
        currentTokenWithBearer={
          isProxyUser ? currentParentTokenWithBearer : currentTokenWithBearer
        }
        onClose={onClose}
        onSwitchAccount={handleSwitchToChildAccount}
        userType={userType}
      />
    </Drawer>
  );
};
