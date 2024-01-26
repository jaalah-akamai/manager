import { useTheme } from '@mui/material/styles';
import * as React from 'react';

import { Divider } from 'src/components/Divider';
import { Link } from 'src/components/Link';
import { MultipleIPInput } from 'src/components/MultipleIPInput/MultipleIPInput';
import { Notice } from 'src/components/Notice/Notice';
import { TooltipIcon } from 'src/components/TooltipIcon';
import { Typography } from 'src/components/Typography';
import {
  ASSIGN_IPV4_RANGES_DESCRIPTION,
  ASSIGN_IPV4_RANGES_TITLE,
} from 'src/features/VPCs/constants';
import { ExtendedIP } from 'src/utilities/ipUtils';

import type { SxProps } from '@mui/material/styles';

interface Props {
  handleIPRangeChange: (ips: ExtendedIP[]) => void;
  ipRanges: ExtendedIP[];
  ipRangesError?: string;
  sx?: SxProps;
}

export const AssignIPRanges = (props: Props) => {
  const { handleIPRangeChange, ipRanges, ipRangesError, sx } = props;
  const theme = useTheme();

  return (
    <>
      <Divider sx={{ ...sx }} />
      {ipRangesError && (
        <Notice important text={ipRangesError} variant="error" />
      )}
      <Typography
        sx={(theme) => ({
          fontFamily: theme.font.bold,
        })}
      >
        {ASSIGN_IPV4_RANGES_TITLE}
        <TooltipIcon
          sxTooltipIcon={{
            marginLeft: theme.spacing(0.5),
            padding: theme.spacing(0.5),
          }}
          text={
            <>
              {ASSIGN_IPV4_RANGES_DESCRIPTION}{' '}
              <Link to="https://www.linode.com/docs/guides/how-to-understand-ip-addresses/">
                Learn more
              </Link>
            </>
          }
          interactive
          status="help"
        />
      </Typography>
      <MultipleIPInput
        buttonText="Add IPv4 Range"
        forVPCIPv4Ranges
        ips={ipRanges}
        onChange={handleIPRangeChange}
        placeholder="10.0.0.0/24"
        title=""
      />
    </>
  );
};
