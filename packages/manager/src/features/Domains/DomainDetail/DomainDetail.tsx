import { DomainRecord, getDomainRecords } from '@linode/api-v4/lib/domains';
import * as React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Breadcrumb from 'src/components/Breadcrumb';
import CircleProgress from 'src/components/CircleProgress';
import { makeStyles } from 'tss-react/mui';
import { Theme } from '@mui/material/styles';
import DocsLink from 'src/components/DocsLink';
import ErrorState from 'src/components/ErrorState';
import Grid from 'src/components/Grid';
import Notice from 'src/components/Notice';
import { useDomainQuery, useUpdateDomainMutation } from 'src/queries/domains';
import { getAllWithArguments } from 'src/utilities/getAll';
import DomainRecords from '../DomainRecordsWrapper';

const useStyles = makeStyles()((theme: Theme) => ({
  root: {
    margin: 0,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(),
    },
    [theme.breakpoints.down('md')]: {
      paddingRight: theme.spacing(),
      paddingLeft: theme.spacing(1),
      paddingTop: 0,
    },
    [theme.breakpoints.up('lg')]: {
      padding: theme.spacing(1),
      paddingRight: 0,
    },
  },
  error: {
    marginTop: `${theme.spacing(3)} !important`,
    marginBottom: `0 !important`,
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

const DomainDetail = () => {
  const { classes } = useStyles();
  const params = useParams<{ domainId: string }>();
  const domainId = Number(params.domainId);

  const location = useLocation<any>();

  const { data: domain, error, isLoading } = useDomainQuery(domainId);
  const { mutateAsync: updateDomain } = useUpdateDomainMutation();

  const [records, updateRecords] = React.useState<DomainRecord[]>([]);
  const [updateError, setUpdateError] = React.useState<string | undefined>();

  React.useEffect(() => {
    refreshDomainRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLabelChange = (label: string) => {
    setUpdateError(undefined);

    if (!domain) {
      return Promise.reject('No Domain found.');
    }

    return updateDomain({ id: domain.id, domain: label }).catch((e) => {
      setUpdateError(e[0].reason);
      return Promise.reject(e);
    });
  };

  const resetEditableLabel = () => {
    setUpdateError(undefined);
    return domain?.domain;
  };

  const handleUpdateTags = (tagsList: string[]) => {
    if (!domainId) {
      return Promise.reject('No Domain ID specified.');
    }
    return updateDomain({
      id: +domainId,
      tags: tagsList,
    });
  };

  const refreshDomainRecords = () => {
    getAllWithArguments<DomainRecord>(getDomainRecords)([+domainId!])
      .then(({ data }) => {
        updateRecords(data);
      })
      /** silently fail if DNS records couldn't be updated. No harm here */
      .catch(() => null);
  };

  if (isLoading) {
    return <CircleProgress />;
  }

  if (error) {
    return (
      <ErrorState errorText="There was an error retrieving your Domain. Please reload and try again." />
    );
  }

  if (!domain) {
    return null;
  }

  return (
    <>
      <Grid
        container
        className={`${classes.root} m0`}
        justifyContent="space-between"
      >
        <Grid item className="p0">
          <Breadcrumb
            pathname={location.pathname}
            labelOptions={{ noCap: true }}
            onEditHandlers={{
              editableTextTitle: domain.domain,
              onEdit: handleLabelChange,
              onCancel: resetEditableLabel,
              errorText: updateError,
            }}
          />
        </Grid>
        <Grid item className="p0" style={{ marginTop: 14 }}>
          <DocsLink href="https://www.linode.com/docs/guides/dns-manager/" />
        </Grid>
      </Grid>
      {location.state && location.state.recordError && (
        <Notice
          className={classes.error}
          error
          text={location.state.recordError}
        />
      )}
      <DomainRecords
        handleUpdateTags={handleUpdateTags}
        updateRecords={refreshDomainRecords}
        records={records}
        domain={domain}
      />
    </>
  );
};

export default DomainDetail;
