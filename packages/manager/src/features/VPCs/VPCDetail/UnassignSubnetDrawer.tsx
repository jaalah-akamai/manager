import {
  APIError,
  Config,
  Linode,
  UpdateConfigInterfacePayload,
} from '@linode/api-v4';
import { Subnet } from '@linode/api-v4/lib/vpcs/types';
import Close from '@mui/icons-material/Close';
import { Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useFormik } from 'formik';
import * as React from 'react';
import config from 'simple-git/dist/src/lib/tasks/config';

import { ActionsPanel } from 'src/components/ActionsPanel/ActionsPanel';
import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';
import { DownloadCSV } from 'src/components/DownloadCSV/DownloadCSV';
import { Drawer } from 'src/components/Drawer';
import { IconButton } from 'src/components/IconButton';
import { List } from 'src/components/List';
import { ListItem } from 'src/components/ListItem';
import { Notice } from 'src/components/Notice/Notice';
import { useFormattedDate } from 'src/hooks/useFormattedDate';
import {
  useAllLinodeConfigsQuery,
  useConfigInterfaceQuery,
  useUpdateConfigInterfaceMutation,
} from 'src/queries/linodes/configs';
import {
  useAllLinodesQuery,
  useLinodeQuery,
} from 'src/queries/linodes/linodes';
import { getErrorMap } from 'src/utilities/errorUtils';
import {
  handleFieldErrors,
  handleGeneralErrors,
} from 'src/utilities/formikErrorUtils';

interface Props {
  onClose: () => void;
  open: boolean;
  subnet?: Subnet;
}

export const UnassignSubnetDrawer = React.memo((props: Props) => {
  const { onClose, open, subnet } = props;
  const { linodes: linodeIds } = subnet || {};

  const csvRef = React.useRef<any>();
  const formattedDate = useFormattedDate();
  const [selectedLinodes, setSelectedLinodes] = React.useState<Linode[]>([]);

  // 1. We need to get all the linodes
  const { data: linodes, refetch: getCSVData } = useAllLinodesQuery();

  // 2. We need to get only linodes that are assigned to the subnet
  const assignedLinodes = linodes?.filter((linode) => {
    return linodeIds?.includes(linode.id);
  });

  // 3. We need to get/store configurations for all selected linodes
  // TODO: There's no way to get the configs for multiple linodes at once
  const { data: configs } = useAllLinodeConfigsQuery(
    selectedLinodes[0]?.id ?? -1,
    selectedLinodes[0] !== undefined
  );

  // 4. We need to find the configuration that has the subnet assigned to it
  const vpcInterface = configs?.flatMap((config) => {
    return config.interfaces?.find((linodeInterface) => {
      return linodeInterface.purpose === 'vpc'; // TODO: For testing purposes
      // return linodeInterface.subnet_id === subnet?.id && linodeInterface.purpose === 'vpc'; // TODO: This is what we want
    });
  })[0];

  // 5. We need to update the configuration to remove the subnet
  const {
    isLoading,
    mutateAsync: updateConfigInterface,
  } = useUpdateConfigInterfaceMutation(
    selectedLinodes[0]?.id ?? -1,
    configs?.[0]?.id ?? -1,
    vpcInterface?.id ?? -1
  );

  // 3. We need to get configurations for all assigned linodes
  // As each linode is selected, we need to get the configs for that linode and store them in state
  // We can use the useAllLinodeConfigsQuery hook to get the configs for each linode
  // We can use Promise.all to wait for all the configs to be returned
  // We can then flatten the array of configs and store them in state
  // Here is the query:
  // export const useAllLinodeConfigsQuery = (linodeId: number, enabled = true) => {
  //   return useQuery<Config[], APIError[]>(
  //     ['linodes', 'linode', linodeId, 'configs'],
  //     () => getAllLinodeConfigs(linodeId),
  //     { enabled }
  //   );
  // };

  // If I get the linode ids, and pass it to another function which returns a config then I can store each config in state
  // Loop through assignedLinodes and call `getAConfig` utility function

  React.useEffect(() => {
    if (selectedLinodes !== undefined) {
      console.log({ configs, selectedLinodes, vpcInterface });
    }
  }, [selectedLinodes, configs, vpcInterface]);

  const handleRemoveLinode = (optionToRemove: Linode) => {
    const updatedSelectedLinodes = selectedLinodes.filter(
      (option) => option.id !== optionToRemove.id
    );

    setSelectedLinodes(updatedSelectedLinodes);
  };

  const form = useFormik<UpdateConfigInterfacePayload>({
    enableReinitialize: true,
    initialValues: {
      ...vpcInterface,
    },
    async onSubmit(values) {
      await updateConfigInterface(values);
      onClose();
    },
  });

  const downloadCSV = async () => {
    await getCSVData();
    csvRef.current.link.click();
  };

  const headers = [{ key: 'linodes', label: 'linodes' }];

  return (
    <Drawer
      onClose={onClose}
      open={open}
      title={`Unassign Linode from subnet: ${subnet?.label}`}
    >
      <Notice
        text={`Unassigning a Linode from subnet requires you to reboot the Linode.`}
        variant="warning"
      />
      <form onSubmit={form.handleSubmit}>
        <Stack>
          <Autocomplete
            label="Linodes"
            multiple
            onChange={(_, value) => setSelectedLinodes(value)}
            options={assignedLinodes ?? []}
            renderTags={() => null}
            value={selectedLinodes}
          />
          {selectedLinodes.length > 0 && (
            <>
              <SelectedOptionsHeader>{`Linodes to be Unassigned from Subnet (${selectedLinodes.length})`}</SelectedOptionsHeader>

              <SelectedOptionsList>
                {selectedLinodes.map((linode) => (
                  <SelectedOptionsListItem alignItems="center" key={linode.id}>
                    <StyledLabel>{linode.label}</StyledLabel>
                    <IconButton
                      aria-label={`remove ${linode.label}`}
                      disableRipple
                      onClick={() => handleRemoveLinode(linode)}
                      size="medium"
                    >
                      <Close />
                    </IconButton>
                  </SelectedOptionsListItem>
                ))}
              </SelectedOptionsList>
              <DownloadCSV
                sx={{
                  alignItems: 'flex-start',
                  display: 'flex',
                  gap: 1,
                  marginTop: 2,
                  textAlign: 'left',
                }}
                buttonType="unstyled"
                csvRef={csvRef}
                data={selectedLinodes}
                filename={`linodes-unassigned-${formattedDate}.csv`}
                headers={headers}
                onClick={downloadCSV}
                text={'Download List of Unassigned Linodes (.csv)'}
              />
              <ActionsPanel
                primaryButtonProps={{
                  'data-testid': 'save-button',
                  label: 'Unassign Linodes',
                  loading: isLoading,
                  type: 'submit',
                }}
                secondaryButtonProps={{ label: 'Cancel', onClick: onClose }}
              />
            </>
          )}
        </Stack>
      </form>
    </Drawer>
  );
});

const SelectedOptionsHeader = styled('h4')(({ theme }) => ({
  color: theme.color.headline,
  fontFamily: theme.font.bold,
  fontSize: '14px',
  textTransform: 'initial',
}));

const SelectedOptionsList = styled(List)(({ theme }) => ({
  background: theme.bg.main,
  maxWidth: '416px',
  padding: '5px 0',
  width: '100%',
}));

const SelectedOptionsListItem = styled(ListItem)(() => ({
  justifyContent: 'space-between',
  paddingBottom: 0,
  paddingTop: 0,
}));

const StyledLabel = styled('span')(({ theme }) => ({
  color: theme.color.label,
  fontFamily: theme.font.semiBold,
  fontSize: '14px',
}));
