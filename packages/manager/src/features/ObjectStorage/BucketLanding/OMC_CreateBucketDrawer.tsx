import { yupResolver } from '@hookform/resolvers/yup';
import { CreateBucketSchema } from '@linode/validation';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';

import { ActionsPanel } from 'src/components/ActionsPanel/ActionsPanel';
import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';
import { Box } from 'src/components/Box';
import { Column } from 'src/components/DescriptionList/DescriptionList.stories';
import { Drawer } from 'src/components/Drawer';
import { FormLabel } from 'src/components/FormLabel';
import { Link } from 'src/components/Link';
import { Notice } from 'src/components/Notice/Notice';
import { Radio } from 'src/components/Radio/Radio';
import { Table } from 'src/components/Table';
import { TableBody } from 'src/components/TableBody';
import { TableCell } from 'src/components/TableCell';
import { TableHead } from 'src/components/TableHead';
import { TableRow } from 'src/components/TableRow';
import { TextField } from 'src/components/TextField';
import { Typography } from 'src/components/Typography';
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

  const isObjectStorageGen2Enabled = true;

  // const isObjectStorageGen2Enabled = isFeatureEnabledV2(
  //   'Object Storage Endpoint Types',
  //   Boolean(flags.objectStorageGen2?.enabled),
  //   account?.capabilities ?? []
  // );

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

  const region = watchRegion
    ? regions?.find((region) => watchRegion.includes(region.id))
    : undefined;

  console.log({ endpoints, region, watchRegion });

  const filteredEndpointOptions = endpoints
    ?.filter((endpoint) => region?.id === endpoint.region)
    ?.map((endpoint) => ({
      label: endpoint.endpoint_type,
      value: endpoint.endpoint_type,
    }));

  const watchEndpointType = watch('endpoint_type');
  const selectedEndpointType =
    filteredEndpointOptions?.find(
      (endpoint) => endpoint.value === watchEndpointType
    ) ?? null;

  const { showGDPRCheckbox } = getGDPRDetails({
    agreements,
    profile,
    regions,
    selectedRegionId: region?.id ?? '',
  });

  const gen2EndpointTypes =
    selectedEndpointType?.value !== 'E0' &&
    selectedEndpointType?.value !== 'E1';

  const bucketRateText = (
    <Typography
      marginBottom={gen2EndpointTypes ? 2 : 3}
      sx={(theme) => ({ color: theme.color.label })}
    >
      {gen2EndpointTypes
        ? 'Specifies the maximum Requests Per Second (RPS) for a bucket. To increase it to High, open a support ticket. '
        : 'This endpoint type supports up to 750 Requests Per Second (RPS).'}
      Understand <Link to="#">bucket rate limits</Link>.
    </Typography>
  );

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
        {region?.id && <OveragePricing regionId={region.id} />}
        {isObjectStorageGen2Enabled && (
          <>
            <Controller
              render={({ field, fieldState }) => (
                <Autocomplete
                  onChange={(e, endpoint) =>
                    field.onChange(endpoint?.value ?? null)
                  }
                  textFieldProps={{
                    helperText: (
                      <>
                        Endpoint types impact the performance, capacity, and
                        rate limits for your bucket. Understand{' '}
                        <Link to="#">endpoint types</Link>.
                      </>
                    ),
                    helperTextPosition: 'top',
                  }}
                  errorText={fieldState.error?.message}
                  label="Object Storage Endpoint Type"
                  loading={isEndpointLoading}
                  onBlur={field.onBlur}
                  options={filteredEndpointOptions ?? []} // TODO: OBJ Gen2: Add endpoint types
                  placeholder="Object Storage Endpoint Type"
                  value={selectedEndpointType}
                />
              )}
              control={control}
              name="endpoint_type"
              rules={{ required: 'Endpoint Type is required' }}
            />
            <FormLabel>
              <Typography marginBottom={1} marginTop={2} variant="inherit">
                Bucket Rate Limits
              </Typography>
            </FormLabel>
            {bucketRateText}
            {gen2EndpointTypes && (
              <Box marginBottom={3} marginTop={2}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Limits</TableCell>
                      <TableCell>GET</TableCell>
                      <TableCell>PUT</TableCell>
                      <TableCell>LIST</TableCell>
                      <TableCell>DELETE</TableCell>
                      <TableCell>OTHER</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Radio
                          checked={true}
                          disabled
                          name="limit-selection"
                          onChange={() => {}}
                          value="2"
                        />
                      </TableCell>
                      <TableCell>1000</TableCell>
                      <TableCell>000</TableCell>
                      <TableCell>000</TableCell>
                      <TableCell>000</TableCell>
                      <TableCell>000</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Radio
                          checked={false}
                          disabled
                          name="limit-selection"
                          onChange={() => {}}
                          value="2"
                        />
                      </TableCell>
                      <TableCell>5000</TableCell>
                      <TableCell>000</TableCell>
                      <TableCell>000</TableCell>
                      <TableCell>000</TableCell>
                      <TableCell>000</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Box>
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
            loading: isLoading || Boolean(region?.id && isLoadingTypes),
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
          regionId={region?.id}
        />
      </form>
    </Drawer>
  );
};
