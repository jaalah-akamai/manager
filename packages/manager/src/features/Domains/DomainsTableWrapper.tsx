import * as React from 'react';
import Paper from 'src/components/core/Paper';
import Grid from 'src/components/Grid';
import { OrderByProps } from 'src/components/OrderBy';
import Table from 'src/components/Table';
import { makeStyles } from 'tss-react/mui';
import SortableTableHead from './SortableTableHead';

const useStyles = makeStyles()(() => ({
  paperWrapper: {
    backgroundColor: 'transparent',
  },
}));

interface Props {
  dataLength: number;
}

type CombinedProps = Omit<OrderByProps, 'data'> & Props;

const DomainsTableWrapper: React.FC<CombinedProps> = (props) => {
  const { order, orderBy, handleOrderChange, dataLength } = props;

  const { classes } = useStyles();

  return (
    <Paper className={classes.paperWrapper}>
      <Grid container className="my0">
        <Grid item xs={12} className="py0">
          <Table
            aria-label="List of Domains"
            colCount={3}
            rowCount={dataLength}
          >
            <SortableTableHead
              order={order}
              orderBy={orderBy}
              handleOrderChange={handleOrderChange}
            />
            {props.children}
          </Table>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default DomainsTableWrapper;
