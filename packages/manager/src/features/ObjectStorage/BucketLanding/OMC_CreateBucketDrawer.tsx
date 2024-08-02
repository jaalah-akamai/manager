import { yupResolver } from '@hookform/resolvers/yup';
import { CreateBucketSchema } from '@linode/validation';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';

import { ActionsPanel } from 'src/components/ActionsPanel/ActionsPanel';
import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';
import { Drawer } from 'src/components/Drawer';
import { FormLabel } from 'src/components/FormLabel';
import { Link } from 'src/components/Link';
import { Notice } from 'src/components/Notice/Notice';
import { TextField } from 'src/components/TextField';
import { Typography } from 'src/components/Typography';
import { BucketRateLimitTable } from 'src/features/ObjectStorage/BucketLanding/BucketRateLimitTable';
import { useAccountManagement } from 'src/hooks/useAccountManagement';
import { useFlags } from 'src/hooks/useFlags';
import {
  reportAgreementSigningError,
  useAccountAgreements,
  useMutateAccountAgreements,
} from 'src/queries/account/agreements';
import { useAccountSettings } from 'src/queries/account/settings';
import { useNetworkTransferPricesQuery } from 'src/queries/networkTransfer';
import {
  useCreateBucketMutation,
  useObjectStorageBuckets,
  useObjectStorageEndpoints,
  useObjectStorageTypesQuery,
} from 'src/queries/object-storage/queries';
import { useProfile } from 'src/queries/profile/profile';
import { useRegionsQuery } from 'src/queries/regions/regions';
import { isFeatureEnabledV2 } from 'src/utilities/accountCapabilities';
import { sendCreateBucketEvent } from 'src/utilities/analytics/customEventAnalytics';
import { getGDPRDetails } from 'src/utilities/formatRegion';
import { PRICES_RELOAD_ERROR_NOTICE_TEXT } from 'src/utilities/pricing/constants';

import { EnableObjectStorageModal } from '../EnableObjectStorageModal';
import { BucketRegions } from './BucketRegions';
import { StyledEUAgreementCheckbox } from './OMC_CreateBucketDrawer.styles';
import { OveragePricing } from './OveragePricing';

import type { CreateObjectStorageBucketPayload } from '@linode/api-v4';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const OMC_CreateBucketDrawer = (props: Props) => {
  const { data: profile } = useProfile();
  const { isOpen, onClose } = props;
  const isRestrictedUser = profile?.restricted;
  const { account } = useAccountManagement();
  const flags = useFlags();
  const {
    data: endpoints,
    isFetching: isEndpointLoading,
  } = useObjectStorageEndpoints();

  const isObjectStorageGen2Enabled = isFeatureEnabledV2(
    'Object Storage Endpoint Types',
    Boolean(flags.objectStorageGen2?.enabled),
    account?.capabilities ?? []
  );

  const { data: regions } = useRegionsQuery();

  const { data: bucketsData } = useObjectStorageBuckets();

  const {
    data: objTypes,
    isError: isErrorObjTypes,
    isInitialLoading: isLoadingObjTypes,
  } = useObjectStorageTypesQuery(isOpen);
  const {
    data: transferTypes,
    isError: isErrorTransferTypes,
    isInitialLoading: isLoadingTransferTypes,
  } = useNetworkTransferPricesQuery(isOpen);

  const isErrorTypes = isErrorTransferTypes || isErrorObjTypes;
  const isLoadingTypes = isLoadingTransferTypes || isLoadingObjTypes;
  const isInvalidPrice =
    !objTypes || !transferTypes || isErrorTypes || isErrorTransferTypes;

  const { isLoading, mutateAsync: createBucket } = useCreateBucketMutation();
  const { data: agreements } = useAccountAgreements();
  const { mutateAsync: updateAccountAgreements } = useMutateAccountAgreements();
  const { data: accountSettings } = useAccountSettings();
  const [isEnableObjDialogOpen, setIsEnableObjDialogOpen] = React.useState(
    false
  );
  const [hasSignedAgreement, setHasSignedAgreement] = React.useState<boolean>(
    false
  );

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setError,
    watch,
  } = useForm<CreateObjectStorageBucketPayload>({
    context: { buckets: bucketsData?.buckets ?? [] },
    defaultValues: {
      cors_enabled: true,
      label: '',
      region: '',
    },
    mode: 'onBlur',
    resolver: yupResolver(CreateBucketSchema),
  });

  const watchRegion = watch('region');
  const watchEndpointType = watch('endpoint_type');

  const onSubmit = async (data: CreateObjectStorageBucketPayload) => {
    try {
      await createBucket(data);

      if (data.region) {
        sendCreateBucketEvent(data.region);
      }

      if (hasSignedAgreement) {
        try {
          await updateAccountAgreements({ eu_model: true });
        } catch (error) {
          reportAgreementSigningError(error);
        }
      }

      onClose();
    } catch (errors) {
      for (const error of errors) {
        setError(error?.field ?? 'root', { message: error.reason });
      }
    }
  };

  const handleBucketFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (accountSettings?.object_storage !== 'active') {
      setIsEnableObjDialogOpen(true);
    } else {
      handleSubmit(onSubmit)();
    }
  };

  const selectedRegion = watchRegion
    ? regions?.find((region) => watchRegion.includes(region.id))
    : undefined;

  /**
   * In rare cases, the dropdown must display a specific endpoint hostname along with the endpoint type
   * to distinguish between two assigned endpoints of the same type.
   * This is necessary for multiple gen1 (E1) assignments in the same region.
   */
  const existingEndpointType = bucketsData?.buckets.find(
    (bucket) => bucket.endpoint_type
  )?.endpoint_type;

  const filteredEndpointOptions = endpoints
    ?.filter((endpoint) => selectedRegion?.id === endpoint.region)
    ?.map((endpoint) => {
      const shouldShowHostname =
        existingEndpointType === endpoint.endpoint_type;
      return {
        label: shouldShowHostname
          ? `${endpoint.endpoint_type} (${endpoint.s3_endpoint})`
          : endpoint.endpoint_type,
        value: endpoint.endpoint_type,
      };
    });

  const selectedEndpointType =
    filteredEndpointOptions?.find(
      (endpoint) => endpoint.value === watchEndpointType
    ) ?? null;

  const { showGDPRCheckbox } = getGDPRDetails({
    agreements,
    profile,
    regions,
    selectedRegionId: selectedRegion?.id ?? '',
  });

  const isGen2EndpointType =
    selectedEndpointType &&
    selectedEndpointType.value !== 'E0' &&
    selectedEndpointType.value !== 'E1';

  return (
    <Drawer
      onClose={onClose}
      onExited={reset}
      open={isOpen}
      title="Create Bucket"
    >
      <form onSubmit={handleBucketFormSubmit}>
        {isRestrictedUser && (
          <Notice
            data-qa-permissions-notice
            text="You don't have permissions to create a Bucket. Please contact an account administrator for details."
            variant="error"
          />
        )}
        {errors.root?.message && (
          <Notice text={errors.root?.message} variant="error" />
        )}
        <Controller
          render={({ field }) => (
            <TextField
              {...field}
              data-qa-cluster-label
              data-testid="label"
              disabled={isRestrictedUser}
              errorText={errors.label?.message}
              label="Label"
              required
            />
          )}
          control={control}
          name="label"
          rules={{ required: 'Label is required' }}
        />
        <Controller
          render={({ field }) => (
            <BucketRegions
              disabled={isRestrictedUser}
              error={errors.region?.message}
              onBlur={field.onBlur}
              onChange={(value) => field.onChange(value)}
              required
              selectedRegion={field.value}
            />
          )}
          control={control}
          name="region"
          rules={{ required: 'Region is required' }}
        />
        {selectedRegion?.id && <OveragePricing regionId={selectedRegion.id} />}
        {isObjectStorageGen2Enabled && (
          <>
            <Controller
              render={({ field, fieldState }) => (
                <Autocomplete
                  onChange={(e, endpoint) =>
                    field.onChange(endpoint?.value ?? '')
                  }
                  textFieldProps={{
                    helperText: (
                      <Typography marginBottom={2} marginTop={1}>
                        Endpoint types impact the performance, capacity, and
                        rate limits for your bucket. Understand{' '}
                        <Link to="#">endpoint types</Link>.
                      </Typography>
                    ),
                    helperTextPosition: 'top',
                  }}
                  errorText={fieldState.error?.message}
                  label="Object Storage Endpoint Type"
                  loading={isEndpointLoading}
                  onBlur={field.onBlur}
                  options={filteredEndpointOptions ?? []}
                  placeholder="Object Storage Endpoint Type"
                  value={selectedEndpointType}
                />
              )}
              control={control}
              name="endpoint_type"
              rules={{ required: 'Endpoint Type is required' }}
            />
            {selectedEndpointType && (
              <>
                <FormLabel>
                  <Typography marginBottom={1} marginTop={2} variant="inherit">
                    Bucket Rate Limits
                  </Typography>
                </FormLabel>
                <Typography marginBottom={isGen2EndpointType ? 2 : 3}>
                  {isGen2EndpointType
                    ? 'Specifies the maximum Requests Per Second (RPS) for a bucket. To increase it to High, open a support ticket. '
                    : 'This endpoint type supports up to 750 Requests Per Second (RPS).'}
                  Understand <Link to="#">bucket rate limits</Link>.
                </Typography>
              </>
            )}
            {isGen2EndpointType && (
              <BucketRateLimitTable
                selectedEndpointType={selectedEndpointType}
              />
            )}
          </>
        )}
        {showGDPRCheckbox ? (
          <StyledEUAgreementCheckbox
            checked={hasSignedAgreement}
            onChange={(e) => setHasSignedAgreement(e.target.checked)}
          />
        ) : null}
        <ActionsPanel
          primaryButtonProps={{
            'data-testid': 'create-bucket-button',
            disabled: (showGDPRCheckbox && !hasSignedAgreement) || isErrorTypes,
            label: 'Create Bucket',
            loading: isLoading || Boolean(selectedRegion?.id && isLoadingTypes),
            tooltipText:
              !isLoadingTypes && isInvalidPrice
                ? PRICES_RELOAD_ERROR_NOTICE_TEXT
                : '',
            type: 'submit',
          }}
          secondaryButtonProps={{ label: 'Cancel', onClick: onClose }}
        />
        <EnableObjectStorageModal
          handleSubmit={handleSubmit(onSubmit)}
          onClose={() => setIsEnableObjDialogOpen(false)}
          open={isEnableObjDialogOpen}
          regionId={selectedRegion?.id}
        />
      </form>
    </Drawer>
  );
};
