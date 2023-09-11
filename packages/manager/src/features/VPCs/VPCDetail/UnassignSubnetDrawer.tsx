import { APIError, Config, Linode } from '@linode/api-v4';
import { Subnet } from '@linode/api-v4/lib/vpcs/types';
import { Stack } from '@mui/material';
import { useFormik } from 'formik';
import * as React from 'react';

import { Autocomplete } from 'src/components/Autocomplete/Autocomplete';
import { Drawer } from 'src/components/Drawer';
import { Notice } from 'src/components/Notice/Notice';
import { useAllLinodeConfigsQuery } from 'src/queries/linodes/configs';
import {
  useAllLinodesQuery,
  useLinodeQuery,
} from 'src/queries/linodes/linodes';

interface Props {
  onClose: () => void;
  open: boolean;
  subnet?: Subnet;
}

interface SubnetLinode {
  linode: Linode | undefined;
  linodeError: APIError[] | null;
  linodeLoading: boolean;
}

export const UnassignSubnetDrawer = React.memo((props: Props) => {
  const { onClose, open, subnet } = props;
  const { linodes: linodeIds } = subnet || {};

  const [selectedLinode, setSelectedLinode] = React.useState<Linode>();

  // Get all linodes so we can filter out the ones that aren't assigned to the subnet
  const { data: linodes } = useAllLinodesQuery();

  const assignedLinodes = linodes?.filter((linode) => {
    return linodeIds?.includes(linode.id);
  });

  // 1. For selected linode, we need to get it's configuration profile
  // useAllLinodeConfigsQuery(linodeId)

  // Loop through configs to find the vpc interface

  // const {
  //   data: configs,
  //   error: configsError,
  //   isLoading: configsLoading,
  // } = useConfigInterfacesQuery(linodeId, configId);

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
      <form>
        <Stack>
          <Autocomplete
            label="Linodes"
            onChange={(_, value: Linode) => setSelectedLinode(value)}
            options={assignedLinodes ?? []}
            renderTags={() => null}
          />
        </Stack>
      </form>
    </Drawer>
  );
});
