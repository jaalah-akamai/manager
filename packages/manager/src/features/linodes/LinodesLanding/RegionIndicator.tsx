import * as React from 'react';
import { makeStyles } from 'tss-react/mui';
import { formatRegion } from 'src/utilities';

const useStyles = makeStyles()(() => ({
  regionIndicator: {
    alignItems: 'center',
    whiteSpace: 'nowrap',
  },
}));

interface Props {
  region: string;
}

const RegionIndicator = (props: Props) => {
  const { classes } = useStyles();
  const { region } = props;

  return (
    <div className={`dif ${classes.regionIndicator}`}>
      {formatRegion(region)}
    </div>
  );
};

export default RegionIndicator;
