import { Token } from '@linode/api-v4';
import React from 'react';

import { getPersonalAccessTokenForRevocation } from 'src/features/Account/utils';
import { useCurrentToken } from 'src/hooks/useAuthentication';
import { usePersonalAccessTokensQuery } from 'src/queries/tokens';

/**
 * Custom hook to manage the ID of a personal access token pending revocation.
 *
 * This hook provides functionality to determine which personal access token
 * should be considered for revocation based on the current authentication state
 * and the list of personal access tokens associated with the account. It utilizes
 * the current bearer token to identify the corresponding personal access token
 * and sets its ID for potential revocation actions.
 *
 * @returns {object} An object containing:
 * - `pendingRevocationTokenId`: The ID of the token currently marked for pending revocation, or `undefined` if none.
 */
export const usePendingRevocationToken = ({
  isProxyUser,
}: {
  isProxyUser: boolean;
}) => {
  const [pendingRevocationToken, setPendingRevocationToken] = React.useState<
    Token | undefined
  >(undefined);
  const currentTokenWithBearer = useCurrentToken() ?? '';
  const { data: personalAccessTokens } = usePersonalAccessTokensQuery();

  const getPendingRevocationToken = React.useCallback(async () => {
    // Skip the logic if not a proxy user or if personal access tokens are not available.
    if (!isProxyUser || !personalAccessTokens?.data) {
      return;
    }
    const token = await getPersonalAccessTokenForRevocation(
      personalAccessTokens.data,
      currentTokenWithBearer
    );
    setPendingRevocationToken(token);
  }, [currentTokenWithBearer, isProxyUser, personalAccessTokens]);

  React.useEffect(() => {
    getPendingRevocationToken();
  }, [personalAccessTokens, getPendingRevocationToken]);

  return {
    pendingRevocationToken,
  };
};
