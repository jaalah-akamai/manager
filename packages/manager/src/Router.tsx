import { RouterProvider } from '@tanstack/react-router';
import * as React from 'react';

import { useFlags } from 'src/hooks/useFlags';
import { useGlobalErrors } from 'src/hooks/useGlobalErrors';

import { useIsACLPEnabled } from './features/CloudPulse/Utils/utils';
import { useIsDatabasesEnabled } from './features/Databases/utilities';
import { useIsPlacementGroupsEnabled } from './features/PlacementGroups/utils';
import { useAccountSettings } from './queries/account/settings';
import { router } from './routes';

export const Router = () => {
  const { data: accountSettings } = useAccountSettings();
  const { isDatabasesEnabled } = useIsDatabasesEnabled();
  const { isPlacementGroupsEnabled } = useIsPlacementGroupsEnabled();
  const { isACLPEnabled } = useIsACLPEnabled();
  const globalErrors = useGlobalErrors();
  const flags = useFlags();

  // Update the router's context
  router.update({
    context: {
      accountSettings,
      globalErrors,
      isACLPEnabled,
      isDatabasesEnabled,
      isPlacementGroupsEnabled,
      selfServeBetas: flags.selfServeBetas,
    },
  });

  return <RouterProvider router={router} />;
};
