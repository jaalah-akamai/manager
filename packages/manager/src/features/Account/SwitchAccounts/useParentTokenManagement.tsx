import React from 'react';

import { PARENT_STORAGE_EXPIRY_KEY } from 'src/features/Account/constants';
import { isTokenValid } from 'src/features/Account/utils';

// Checks and reacts to the expiration status of parent tokens.
export const useParentTokenManagement = ({
  isProxyUser,
}: {
  isProxyUser: boolean;
}) => {
  const [isParentTokenExpired, setIsParentTokenExpired] = React.useState(false);

  React.useEffect(() => {
    if (isProxyUser) {
      const isExpired = !isTokenValid(PARENT_STORAGE_EXPIRY_KEY);
      setIsParentTokenExpired(isExpired);
    }
  }, [isProxyUser]);

  return { isParentTokenExpired };
};
