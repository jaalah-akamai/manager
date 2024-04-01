import { isEmpty } from 'ramda';
import * as React from 'react';

import AbuseTicketBanner from 'src/components/AbuseTicketBanner';
import { sessionExpirationContext as _sessionExpirationContext } from 'src/context/sessionExpirationContext';
import { switchAccountSessionContext } from 'src/context/switchAccountSessionContext';
import { SwitchAccountSessionDialog } from 'src/features/Account/SwitchAccounts/SwitchAccountSessionDialog';
import { useDismissibleNotifications } from 'src/hooks/useDismissibleNotifications';
import { useFlags } from 'src/hooks/useFlags';
import { usePendingRevocationToken } from 'src/hooks/usePendingRevocationToken';
import { useProfile } from 'src/queries/profile';
import { useSecurityQuestions } from 'src/queries/securityQuestions';

import { SessionExpirationDialog } from '../Account/SwitchAccounts/SessionExpirationDialog';
import { APIMaintenanceBanner } from './APIMaintenanceBanner';
import { ComplianceBanner } from './ComplianceBanner';
import { ComplianceUpdateModal } from './ComplianceUpdateModal';
import { EmailBounceNotificationSection } from './EmailBounce';
import { RegionStatusBanner } from './RegionStatusBanner';
import { TaxCollectionBanner } from './TaxCollectionBanner';
import { VerificationDetailsBanner } from './VerificationDetailsBanner';
import { usePersonalAccessTokensQuery } from 'src/queries/tokens';
export const GlobalNotifications = () => {
  const flags = useFlags();
  const { data: profile } = useProfile();
  const sessionContext = React.useContext(switchAccountSessionContext);
  const sessionExpirationContext = React.useContext(_sessionExpirationContext);
  const isChildUser =
    Boolean(flags.parentChildAccountAccess) && profile?.user_type === 'child';
  const isProxyUser =
    Boolean(flags.parentChildAccountAccess) && profile?.user_type === 'proxy';
  const { data: securityQuestions } = useSecurityQuestions({
    enabled: isChildUser,
  });
  // const { pendingRevocationToken } = usePendingRevocationToken({ isProxyUser });
  const suppliedMaintenances = flags.apiMaintenance?.maintenances; // The data (ID, and sometimes the title and body) we supply regarding maintenance events in LD.

  const hasSecurityQuestions =
    securityQuestions?.security_questions.filter((q) => q.response !== null)
      .length === 3;
  const hasVerifiedPhoneNumber = profile?.verified_phone_number !== null;

  const isVerified = hasVerifiedPhoneNumber && hasSecurityQuestions;

  const { hasDismissedNotifications } = useDismissibleNotifications();

  const _hasDismissedNotifications = React.useCallback(
    hasDismissedNotifications,
    []
  );

  const hasDismissedMaintenances = React.useMemo(
    () => _hasDismissedNotifications(suppliedMaintenances ?? []),
    [_hasDismissedNotifications, suppliedMaintenances]
  );

  // const handleSessionExpirationDialogOpen = () => {
  //   console.log('here')
  //   sessionExpirationContext.updateState({ isOpen: true });
  // };

  // React.useEffect(() => {
  //   getPendingRevocationToken();
  //   console.log('>>>?', personalAccessTokens?.data)
  // }, [])

  // React.useEffect(() => {
  //   console.log({pendingRevocationToken})
  // }, [pendingRevocationToken])

  return (
    <>
      <EmailBounceNotificationSection />
      <RegionStatusBanner />
      <AbuseTicketBanner />
      <ComplianceBanner />
      {isProxyUser && (
        <>
          <SwitchAccountSessionDialog
            isOpen={Boolean(sessionContext.isOpen)}
            onClose={() => sessionContext.updateState({ isOpen: false })}
          />
          <SessionExpirationDialog
            onClose={() =>
              sessionExpirationContext.updateState({ isOpen: false })
            }
            // currentToken={pendingRevocationToken}
            isOpen={Boolean(sessionExpirationContext.isOpen)}
            // onOpen={handleSessionExpirationDialogOpen}
          />
        </>
      )}
      <ComplianceUpdateModal />
      {isChildUser && !isVerified && (
        <VerificationDetailsBanner
          hasSecurityQuestions={hasSecurityQuestions}
          hasVerifiedPhoneNumber={hasVerifiedPhoneNumber}
        />
      )}
      {!isEmpty(suppliedMaintenances) && !hasDismissedMaintenances ? (
        <APIMaintenanceBanner suppliedMaintenances={suppliedMaintenances} />
      ) : null}
      {flags.taxCollectionBanner &&
      Object.keys(flags.taxCollectionBanner).length > 0 ? (
        <TaxCollectionBanner />
      ) : null}
    </>
  );
};
