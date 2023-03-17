import * as React from 'react';
import TableHead from 'src/components/core/TableHead';
import { OrderByProps } from 'src/components/OrderBy';
import TableCell from 'src/components/TableCell';
import TableRow from 'src/components/TableRow';
import TableSortCell from 'src/components/TableSortCell';
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()(() => ({
  label: {
    paddingLeft: 65,
  },
}));

type CombinedProps = Omit<OrderByProps, 'data'>;

const SortableTableHead = (props: CombinedProps) => {
  const { order, orderBy, handleOrderChange } = props;

  const { classes } = useStyles();

  const isActive = (label: string) => label === orderBy;

  return (
    <TableHead data-qa-table-head={order}>
      <TableRow>
        <TableSortCell
          label="domain"
          direction={order}
          active={isActive('domain')}
          handleClick={handleOrderChange}
          data-qa-sort-domain={order}
          className={classes.label}
        >
          Domain
        </TableSortCell>
        <TableSortCell
          label="type"
          direction={order}
          active={isActive('type')}
          handleClick={handleOrderChange}
          data-qa-sort-type={order}
        >
          Type
        </TableSortCell>
        <TableSortCell
          data-qa-domain-type-header={order}
          active={orderBy === 'status'}
          label="status"
          direction={order}
          handleClick={handleOrderChange}
        >
          Status
        </TableSortCell>
        <TableSortCell
          data-qa-domain-type-header={order}
          active={orderBy === 'updated'}
          label="updated"
          direction={order}
          handleClick={handleOrderChange}
        >
          Last Modified
        </TableSortCell>
        <TableCell />
      </TableRow>
    </TableHead>
  );
};

export default SortableTableHead;
