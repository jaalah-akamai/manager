import { LinodeType } from '@linode/api-v4/lib/linodes';
import { Theme } from '@mui/material/styles';
import { pathOr } from 'ramda';
import * as React from 'react';
import Typography from 'src/components/core/Typography';
import { displayPrice as _displayPrice } from 'src/components/DisplayPrice/DisplayPrice';
import TableCell from 'src/components/TableCell';
import TableRow from 'src/components/TableRow';
import { makeStyles } from 'tss-react/mui';
import { ExtendedLinode } from './types';

const useStyles = makeStyles()((theme: Theme) => ({
  root: {},
  error: {
    color: theme.color.red,
    fontSize: 13,
  },
}));

interface Props {
  linodes: ExtendedLinode[];
}

export const displayPrice = (price: string | number) => {
  if (typeof price === 'string') {
    return price;
  }
  return _displayPrice(price);
};

const getLabel = (type?: LinodeType) => pathOr('Unknown', ['label'], type);

const getPrice = (type?: LinodeType) =>
  pathOr('Unavailable', ['addons', 'backups', 'price', 'monthly'], type);

export const BackupLinodes = (props: Props) => {
  const { linodes } = props;

  const { classes } = useStyles();

  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {linodes
        ? linodes.map((linode: ExtendedLinode, idx: number) => {
            const error = pathOr('', ['linodeError', 'reason'], linode);
            return (
              <React.Fragment key={`backup-linode-${idx}`}>
                <TableRow data-qa-linodes>
                  <TableCell data-qa-linode-label parentColumn="Label">
                    <Typography variant="body1">{linode.label}</Typography>
                    {error && (
                      <Typography variant="body1" className={classes.error}>
                        {error}
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell data-qa-linode-plan parentColumn="Plan">
                    {getLabel(linode.typeInfo)}
                  </TableCell>
                  <TableCell
                    data-qa-backup-price
                    parentColumn="Price"
                  >{`${displayPrice(getPrice(linode.typeInfo))}/mo`}</TableCell>
                </TableRow>
              </React.Fragment>
            );
          })
        : null}
    </>
  );
};

BackupLinodes.displayName = 'BackupLinodes';

export default BackupLinodes;
