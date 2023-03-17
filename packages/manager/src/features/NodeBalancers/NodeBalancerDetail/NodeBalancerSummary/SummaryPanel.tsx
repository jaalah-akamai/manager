import * as React from 'react';
import { Link } from 'react-router-dom';
import Paper from 'src/components/core/Paper';
import { makeStyles } from 'tss-react/mui';
import { Theme } from '@mui/material/styles';
import Typography from 'src/components/core/Typography';
import TagsPanel from 'src/components/TagsPanel';
import IPAddress from 'src/features/linodes/LinodesLanding/IPAddress';
import { ExtendedNodeBalancer } from 'src/features/NodeBalancers/types';
import { formatRegion } from 'src/utilities';
import { convertMegabytesTo } from 'src/utilities/unitConversions';
import { NodeBalancerConsumer } from '../context';

const useStyles = makeStyles()((theme: Theme) => ({
  root: {
    paddingTop: theme.spacing(),
    [theme.breakpoints.up('md')]: {
      paddingLeft: theme.spacing(1),
      paddingTop: 0,
    },
    [theme.breakpoints.up('lg')]: {
      padding: theme.spacing(1),
      paddingRight: 0,
    },
  },
  NBsummarySection: {
    [theme.breakpoints.up('md')]: {
      marginTop: theme.spacing(6),
    },
  },
  IPgrouping: {
    margin: '-2px 0 0 2px',
    display: 'flex',
    flexDirection: 'column',
  },
  nodeTransfer: {
    marginTop: 12,
  },
  hostName: {
    wordBreak: 'break-word',
  },
  region: {
    [theme.breakpoints.between('sm', 'lg')]: {
      flexBasis: '100%',
      maxWidth: '100%',
      display: 'flex',
    },
  },
  regionInner: {
    [theme.breakpoints.only('xs')]: {
      padding: '0 8px !important',
    },
    [theme.breakpoints.up('lg')]: {
      '&:first-of-type': {
        padding: '8px 8px 0 8px !important',
      },
      '&:last-of-type': {
        padding: '0 8px !important',
      },
    },
  },
  volumeLink: {
    color: theme.palette.primary.main,
    fontSize: '1rem',
    '&:hover, &:focus': {
      textDecoration: 'underline',
    },
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  summarySection: {
    padding: theme.spacing(2.5),
    marginBottom: theme.spacing(2),
    minHeight: '160px',
    height: '93%',
  },
  section: {
    marginBottom: theme.spacing(1),
    fontSize: '0.875rem',
    lineHeight: '1.125rem',
    color: theme.typography.body1.color,
    '& .dif': {
      position: 'relative',
      width: 'auto',
      '& .chip': {
        position: 'absolute',
        top: '-4px',
        right: -10,
      },
    },
  },
}));

interface Props {
  nodeBalancer: ExtendedNodeBalancer;
}

const SummaryPanel = (props: Props) => {
  const { nodeBalancer } = props;

  const { classes } = useStyles();

  return (
    <NodeBalancerConsumer>
      {({ updateTags }) => {
        return (
          <div className={classes.root}>
            <Paper
              className={`${classes.summarySection} ${classes.NBsummarySection}`}
            >
              <Typography variant="h3" className={classes.title} data-qa-title>
                NodeBalancer Details
              </Typography>
              <div className={classes.section}>
                <Typography variant="body1" data-qa-ports>
                  <strong>Ports: </strong>
                  {nodeBalancer.configPorts.length === 0 && 'None'}
                  {nodeBalancer.configPorts.map(({ port, configId }, i) => (
                    <React.Fragment key={configId}>
                      <Link
                        to={`/nodebalancers/${nodeBalancer.id}/configurations/${configId}`}
                        className="secondaryLink"
                      >
                        {port}
                      </Link>
                      {i < nodeBalancer.configPorts.length - 1 ? ', ' : ''}
                    </React.Fragment>
                  ))}
                </Typography>
              </div>
              <div className={classes.section}>
                <Typography variant="body1" data-qa-node-status>
                  <strong>Backend Status: </strong>
                  {`${nodeBalancer.up} up, ${nodeBalancer.down} down`}
                </Typography>
              </div>
              <div className={classes.section}>
                <Typography variant="body1" data-qa-transferred>
                  <strong>Transferred: </strong>
                  {convertMegabytesTo(nodeBalancer.transfer.total)}
                </Typography>
              </div>
              <div className={classes.section}>
                <Typography
                  variant="body1"
                  className={classes.hostName}
                  data-qa-hostname
                >
                  <strong>Host Name: </strong>
                  {nodeBalancer.hostname}
                </Typography>
              </div>
              <div className={classes.section}>
                <Typography variant="body1" data-qa-region>
                  <strong>Region:</strong> {formatRegion(nodeBalancer.region)}
                </Typography>
              </div>
            </Paper>

            <Paper className={classes.summarySection}>
              <Typography variant="h3" className={classes.title} data-qa-title>
                IP Addresses
              </Typography>
              <div className={`${classes.section}`}>
                <div className={classes.IPgrouping} data-qa-ip>
                  <IPAddress ips={[nodeBalancer.ipv4]} showMore />
                  {nodeBalancer.ipv6 && <IPAddress ips={[nodeBalancer.ipv6]} />}
                </div>
              </div>
            </Paper>

            <Paper className={classes.summarySection}>
              <Typography variant="h3" className={classes.title} data-qa-title>
                Tags
              </Typography>
              <TagsPanel tags={nodeBalancer.tags} updateTags={updateTags} />
            </Paper>
          </div>
        );
      }}
    </NodeBalancerConsumer>
  );
};

export default SummaryPanel;
