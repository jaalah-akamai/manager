import { styled } from '@mui/material/styles';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';

import { ActionsPanel } from 'src/components/ActionsPanel/ActionsPanel';
import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';
import { Button } from 'src/components/Button/Button';
import { ConfirmationDialog } from 'src/components/ConfirmationDialog/ConfirmationDialog';
import { FormControlLabel } from 'src/components/FormControlLabel';
import { Link } from 'src/components/Link';
import { Notice } from 'src/components/Notice/Notice';
import { Toggle } from 'src/components/Toggle/Toggle';
import { Typography } from 'src/components/Typography';
import { useOpenClose } from 'src/hooks/useOpenClose';
import { capitalize } from 'src/utilities/capitalize';
import { getErrorStringOrDefault } from 'src/utilities/errorUtils';

import { bucketACLOptions, objectACLOptions } from '../utilities';
import { copy } from './AccessSelect.data';

import type {
  ACLType,
  ObjectStorageBucketAccess,
  ObjectStorageEndpointTypes,
  ObjectStorageObjectACL,
  UpdateObjectStorageBucketAccessPayload,
} from '@linode/api-v4/lib/object-storage';
import type { Theme } from '@mui/material/styles';

export interface Props {
  endpointType?: ObjectStorageEndpointTypes;
  getAccess: () => Promise<ObjectStorageBucketAccess | ObjectStorageObjectACL>;
  name: string;
  updateAccess: (acl: ACLType, cors_enabled?: boolean) => Promise<{}>;
  variant: 'bucket' | 'object';
}

function isUpdateObjectStorageBucketAccessPayload(
  response: ObjectStorageBucketAccess | ObjectStorageObjectACL
): response is ObjectStorageBucketAccess {
  return 'cors_enabled' in response;
}

export const AccessSelect = React.memo((props: Props) => {
  const { endpointType, getAccess, name, updateAccess, variant } = props;
  const { close: closeDialog, isOpen, open: openDialog } = useOpenClose();
  const label = capitalize(variant);
  const isCorsEnabled =
    variant === 'bucket' && endpointType !== 'E2' && endpointType !== 'E3';

  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    reset,
    watch,
  } = useForm<Required<UpdateObjectStorageBucketAccessPayload>>({
    defaultValues: {
      acl: 'private',
      cors_enabled: true,
    },
  });

  const [accessLoading, setAccessLoading] = React.useState(false);
  const [accessError, setAccessError] = React.useState('');
  const [updateAccessSuccess, setUpdateAccessSuccess] = React.useState(false);

  const selectedACL = watch('acl');

  React.useEffect(() => {
    setAccessLoading(true);
    setAccessError('');
    setUpdateAccessSuccess(false);
    getAccess()
      .then((response) => {
        const { acl } = response;
        const _acl =
          variant === 'object' && acl === 'public-read-write' ? 'custom' : acl;
        const cors_enabled = isUpdateObjectStorageBucketAccessPayload(response)
          ? response.cors_enabled
          : true;
        reset({ acl: _acl || undefined, cors_enabled: cors_enabled || true });
        setAccessLoading(false);
      })
      .catch((err) => {
        setAccessLoading(false);
        setAccessError(getErrorStringOrDefault(err));
      });
  }, [getAccess, variant, reset]);

  const handleAccessControlListChange = () => {
    setUpdateAccessSuccess(false);
  };

  const onSubmit = handleSubmit((data) => {
    setUpdateAccessSuccess(false);
    setAccessError('');
    closeDialog();

    updateAccess(data.acl, data.cors_enabled)
      .then(() => {
        setUpdateAccessSuccess(true);
      })
      .catch((err) => {
        setAccessError(getErrorStringOrDefault(err));
      });
  });

  const aclOptions = variant === 'bucket' ? bucketACLOptions : objectACLOptions;
  const _options =
    selectedACL === 'custom'
      ? [{ label: 'Custom', value: 'custom' }, ...aclOptions]
      : aclOptions;

  const aclLabel = _options.find((option) => option.value === selectedACL)
    ?.label;
  const aclCopy = selectedACL ? copy[variant][selectedACL] : null;

  const errorText = accessError || errors.acl?.message;



  return (
    <form onSubmit={onSubmit}>
      {updateAccessSuccess && (
        <Notice
          text={`${label} access updated successfully.`}
          variant="success"
        />
      )}

      {errorText && <Notice text={errorText} variant="error" />}

      <Controller
        render={({ field }) => (
          <Autocomplete
            {...field}
            onChange={(_, selected) => {
              if (selected) {
                field.onChange(selected.value);
                handleAccessControlListChange();
              }
            }}
            placeholder={
              accessLoading ? 'Loading access...' : 'Select an ACL...'
            }
            data-testid="acl-select"
            disableClearable
            disabled={accessLoading}
            label="Access Control List (ACL)"
            loading={accessLoading}
            options={_options}
            value={_options.find((option) => option.value === field.value)}
          />
        )}
        control={control}
        name="acl"
        rules={{ required: 'ACL is required' }}
      />

      <div style={{ marginTop: 8, minHeight: 16 }}>
        {aclLabel && aclCopy && (
          <Typography>
            {aclLabel}: {aclCopy}
          </Typography>
        )}
      </div>

      {isCorsEnabled && (
        <Controller
          render={({ field }) => (
            <FormControlLabel
              control={
                <Toggle
                  {...field}
                  checked={field.value}
                  disabled={accessLoading}
                />
              }
              label={
                accessLoading
                  ? 'Loading access...'
                  : field.value
                  ? 'CORS Enabled'
                  : 'CORS Disabled'
              }
              style={{ display: 'block', marginTop: 16 }}
            />
          )}
          control={control}
          name="cors_enabled"
        />
      )}

      {isCorsEnabled ? (
        <Typography>
          Whether Cross-Origin Resource Sharing is enabled for all origins. For
          more fine-grained control of CORS, please use another{' '}
          <Link to="https://www.linode.com/docs/guides/how-to-use-object-storage/#object-storage-tools">
            S3-compatible tool
          </Link>
          .
        </Typography>
      ) : (
        <Notice spacingBottom={0} spacingTop={16} variant="warning">
          <Typography
            sx={(theme) => ({
              fontFamily: theme.font.bold,
            })}
          >
            CORS (Cross Origin Sharing) is not available for endpoint types E2
            and E3. <Link to="#">Learn more</Link>.
          </Typography>
        </Notice>
      )}

      <ActionsPanel
        primaryButtonProps={{
          disabled: accessLoading,
          label: 'Save',
          loading: isSubmitting,
          onClick: () => {
            if (selectedACL === 'public-read-write') {
              openDialog();
            } else {
              onSubmit();
            }
          },
          sx: (theme: Theme) => ({
            marginTop: theme.spacing(3),
          }),
        }}
        style={{ padding: 0 }}
      />

      <ConfirmationDialog
        actions={() => (
          <ActionsPanel
            secondaryButtonProps={{
              'data-testid': 'cancel',
              label: 'Cancel',
              onClick: closeDialog,
            }}
            primaryButtonProps={{ label: 'Confirm', onClick: onSubmit }}
            style={{ padding: 0 }}
          />
        )}
        onClose={closeDialog}
        open={isOpen}
        title={`Confirm ${label} Access`}
      >
        Are you sure you want to set access for {name} to Public Read/Write?
        Everyone will be able to list, create, overwrite, and delete Objects in
        this Bucket. <strong>This is not recommended.</strong>
      </ConfirmationDialog>
    </form>
  );
});

export const StyledSubmitButton = styled(Button, {
  label: 'StyledFileUploadsContainer',
})(({ theme }) => ({
  marginTop: theme.spacing(3),
}));
