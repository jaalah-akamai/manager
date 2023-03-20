import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Community from 'src/assets/icons/community.svg';
import Support from 'src/assets/icons/support.svg';
import { withStyles } from 'tss-react/mui';
import { Theme } from '@mui/material/styles';
import Typography from 'src/components/core/Typography';
import Grid from 'src/components/Grid';
import Tile from 'src/components/Tile';
import { AttachmentError } from 'src/features/Support/SupportTicketDetail/SupportTicketDetail';
import SupportTicketDrawer from 'src/features/Support/SupportTickets/SupportTicketDrawer';

type ClassNames = 'wrapper' | 'heading';

interface State {
  error?: string;
  drawerOpen: boolean;
}

type CombinedProps = RouteComponentProps<{}> & {
  classes?: Partial<Record<ClassNames, string>>;
};

export class _OtherWays extends React.Component<CombinedProps, State> {
  state: State = {
    drawerOpen: false,
  };

  openTicketDrawer = () => {
    this.setState({ drawerOpen: true });
  };

  closeTicketDrawer = () => {
    this.setState({ drawerOpen: false });
  };

  onTicketCreated = (
    ticketId: number,
    attachmentErrors: AttachmentError[] = []
  ) => {
    const { history } = this.props;
    history.push({
      pathname: `/support/tickets/${ticketId}`,
      state: { attachmentErrors },
    });
    this.setState({
      drawerOpen: false,
    });
  };

  render() {
    const classes = withStyles.getClasses(this.props);
    const { drawerOpen } = this.state;

    return (
      <Grid item>
        <Grid container className={classes.wrapper}>
          <Grid item xs={12}>
            <Typography variant="h2" className={classes.heading}>
              Didn&rsquo;t find what you need? Get help.
            </Typography>
          </Grid>
          <Grid container style={{ display: 'flex', justifyContent: 'center' }}>
            <Grid item xs={12} sm={6} md={4}>
              <Tile
                title="Create a Community Post"
                description="Find help from other Linode users in the Community Find help from other Linode "
                icon={<Community />}
                link="https://linode.com/community/"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Tile
                title="Open a ticket"
                description="If you are not able to solve an issue with the resources listed above,
                you can contact Linode Support"
                icon={<Support />}
                link={this.openTicketDrawer}
              />
            </Grid>
          </Grid>
        </Grid>
        <SupportTicketDrawer
          open={drawerOpen}
          onClose={this.closeTicketDrawer}
          onSuccess={this.onTicketCreated}
        />
      </Grid>
    );
  }
}

const OtherWays = withStyles(_OtherWays, (theme: Theme) => ({
  wrapper: {
    marginTop: theme.spacing(4),
  },
  heading: {
    textAlign: 'center' as const,
    marginBottom: theme.spacing(2),
  },
}));

export default withRouter(OtherWays);
