import * as React from 'react';
import { withStyles } from 'tss-react/mui';
import { WithStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import { DocumentTitleSegment } from 'src/components/DocumentTitle';
import OtherWays from './Panels/OtherWays';
import PopularPosts from './Panels/PopularPosts';
import SearchPanel from './Panels/SearchPanel';

type ClassNames = 'root';

const styles = (theme: Theme) => ({
  root: {
    [theme.breakpoints.up('lg')]: {
      padding: `${theme.spacing(2)} ${theme.spacing(14)}`,
    },
  },
});

type CombinedProps = WithStyles<ClassNames>;

export class HelpLanding extends React.Component<CombinedProps, {}> {
  render(): JSX.Element {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <DocumentTitleSegment segment="Get Help" />
        <SearchPanel />
        <PopularPosts />
        <OtherWays />
      </div>
    );
  }
}

export default withStyles(HelpLanding, styles);
