import { useCallback, useState } from 'react';

import {
  isParentTokenValid,
  updateCurrentTokenBasedOnUserType,
} from 'src/features/Account/utils';
import { useCreateChildAccountPersonalAccessTokenMutation } from 'src/queries/account/account';
import { useRevokePersonalAccessTokenMutation } from 'src/queries/tokens';
import { getStorage } from 'src/utilities/storage';

import type { UserType } from '@linode/api-v4';

interface useAuthenticationProps {
  euuid: string;
  tokenIdToRevoke: number;
}

export const useParentChildAuthentication = ({
  euuid,
  tokenIdToRevoke,
}: useAuthenticationProps) => {
  const {
    error: revokeTokenError,
    mutateAsync: revokeAccessToken,
  } = useRevokePersonalAccessTokenMutation(tokenIdToRevoke);

  const {
    error: createTokenError,
    mutateAsync: createProxyToken,
  } = useCreateChildAccountPersonalAccessTokenMutation();

  const createToken = useCallback(async () => {
    try {
      return await createProxyToken({
        euuid,
        headers: {
          Authorization: getStorage('authentication/parent_token/token'),
        },
      });
    } catch (error) {
      // Swallow error
      return null;
    }
  }, [createProxyToken, euuid]);

  const revokeToken = useCallback(async () => {
    try {
      await revokeAccessToken();
    } catch (error) {
      // Swallow error
    }
  }, [revokeAccessToken]);

  const updateToken = useCallback(
    ({ userType }: { userType: Extract<UserType, 'parent' | 'proxy'> }) => {
      updateCurrentTokenBasedOnUserType({ userType });
    },
    []
  );

  const validateParentToken = useCallback(() => {
    return isParentTokenValid();
  }, []);

  return {
    createToken,
    createTokenError,
    revokeToken,
    revokeTokenError,
    updateToken,
    validateParentToken,
  };
};
