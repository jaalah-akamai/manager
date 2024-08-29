import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import * as React from 'react';

import { ActionsPanel } from 'src/components/ActionsPanel/ActionsPanel';
import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';
import { Checkbox } from 'src/components/Checkbox';
import { Drawer } from 'src/components/Drawer';
import { FormControl } from 'src/components/FormControl';
import { FormControlLabel } from 'src/components/FormControlLabel';
import { FormHelperText } from 'src/components/FormHelperText';
import { Notice } from 'src/components/Notice/Notice';
import { useEventsPollingActions } from 'src/queries/events/events';
import { useLinodeBackupRestoreMutation } from 'src/queries/linodes/backups';
import {
  useAllLinodesQuery,
  useLinodeQuery,
} from 'src/queries/linodes/linodes';
import { getErrorMap } from 'src/utilities/errorUtils';

import type { LinodeBackup } from '@linode/api-v4/lib/linodes';
interface Props {
  backup: LinodeBackup | undefined;
  linodeId: number;
  onClose: () => void;
  open: boolean;
}

export const RestoreToLinodeDrawer = (props: Props) => {
  const { backup, linodeId, onClose, open } = props;
  const { enqueueSnackbar } = useSnackbar();
  const { data: linode } = useLinodeQuery(linodeId, open);

  const { checkForNewEvents } = useEventsPollingActions();

  const {
    data: linodes,
    error: linodeError,
    isLoading: linodesLoading,
  } = useAllLinodesQuery(
    {},
    {
      region: linode?.region,
    },
    open && linode !== undefined
  );

  const {
    error,
    isPending,
    mutateAsync: restoreBackup,
    reset: resetMutation,
  } = useLinodeBackupRestoreMutation();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      linode_id: linodeId,
      overwrite: false,
    },
    async onSubmit(values) {
      await restoreBackup({
        backupId: backup?.id ?? -1,
        linodeId,
        overwrite: values.overwrite,
        targetLinodeId: values.linode_id ?? -1,
      });
      enqueueSnackbar(
        `Started restoring Linode ${selectedLinodeOption?.label} from a backup`,
        { variant: 'info' }
      );
      checkForNewEvents();
      onClose();
    },
  });

  React.useEffect(() => {
    if (open) {
      formik.resetForm();
      resetMutation();
    }
  }, [open]);

  const linodeOptions =
    linodes?.map(({ id, label }) => {
      return { label, value: id };
    }) ?? [];

  const selectedLinodeOption = linodeOptions.find(
    (option) => option.value === formik.values.linode_id
  );

  const errorMap = getErrorMap(['linode_id', 'overwrite'], error);

  return (
    <Drawer
      onClose={onClose}
      open={open}
      title={`Restore Backup from ${backup?.created}`}
    >
      <form onSubmit={formik.handleSubmit}>
        {Boolean(errorMap.none) && (
          <Notice variant="error">{errorMap.none}</Notice>
        )}
        <Autocomplete
          onChange={(_, selected) =>
            formik.setFieldValue('linode_id', selected?.value)
          }
          textFieldProps={{
            dataAttrs: {
              'data-qa-select-linode': true,
            },
          }}
          autoHighlight
          disableClearable
          errorText={linodeError?.[0].reason ?? errorMap.linode_id}
          label="Linode"
          loading={linodesLoading}
          options={linodeOptions}
          placeholder="Select a Linode"
          value={selectedLinodeOption}
        />
        <FormControl sx={{ paddingLeft: 0.4 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formik.values.overwrite}
                name="overwrite"
                onChange={formik.handleChange}
              />
            }
            label="Overwrite Linode"
          />
          <FormHelperText sx={{ marginLeft: 0 }}>
            Overwriting will delete all disks and configs on the target Linode
            before restoring
          </FormHelperText>
        </FormControl>
        {Boolean(errorMap.overwrite) && (
          <Notice variant="error">{errorMap.overwrite}</Notice>
        )}
        {formik.values.overwrite && (
          <Notice
            text={`This will delete all disks and configs on ${
              selectedLinodeOption
                ? `Linode ${selectedLinodeOption.label}`
                : 'the selcted Linode'
            }`}
            spacingBottom={0}
            spacingTop={12}
            variant="warning"
          />
        )}
        <ActionsPanel
          primaryButtonProps={{
            'data-testid': 'restore-submit',
            label: 'Restore',
            loading: isPending,
            type: 'submit',
          }}
          secondaryButtonProps={{
            'data-testid': 'restore-cancel',
            label: 'Cancel',
            onClick: onClose,
          }}
        />
      </form>
    </Drawer>
  );
};
