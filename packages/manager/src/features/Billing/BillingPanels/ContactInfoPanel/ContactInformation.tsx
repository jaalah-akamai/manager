import countryData from 'country-region-data';
import * as React from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { Theme } from '@mui/material/styles';
import Typography from 'src/components/core/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import BillingContactDrawer from './EditBillingContactDrawer';
import { makeStyles } from 'tss-react/mui';
import {
  BillingPaper,
  BillingBox,
  BillingActionButton,
} from '../../BillingDetail';

const useStyles = makeStyles()((theme: Theme) => ({
  title: {
    marginBottom: theme.spacing(2),
  },
  section: {
    marginBottom: theme.spacing(1),
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
  wordWrap: {
    wordBreak: 'break-all',
  },
  switchWrapper: {
    flex: 1,
    maxWidth: '100%',
    position: 'relative',
    '&.mlMain': {
      [theme.breakpoints.up('lg')]: {
        maxWidth: '78.8%',
      },
    },
  },
  switchWrapperFlex: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

interface Props {
  company: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  email: string;
  phone: string;
  taxId: string;
}

const ContactInformation = (props: Props) => {
  const {
    company,
    firstName,
    lastName,
    address1,
    address2,
    city,
    state,
    zip,
    country,
    email,
    phone,
    taxId,
  } = props;

  const { classes, cx } = useStyles();

  const history = useHistory<{
    contactDrawerOpen?: boolean;
    focusEmail?: boolean;
  }>();

  const [
    editContactDrawerOpen,
    setEditContactDrawerOpen,
  ] = React.useState<boolean>(false);

  const [focusEmail, setFocusEmail] = React.useState(false);

  const handleEditDrawerOpen = React.useCallback(
    () => setEditContactDrawerOpen(true),
    [setEditContactDrawerOpen]
  );

  // On-the-fly route matching so this component can open the drawer itself.
  const editBillingContactRouteMatch = Boolean(
    useRouteMatch('/account/billing/edit')
  );

  React.useEffect(() => {
    if (editBillingContactRouteMatch) {
      handleEditDrawerOpen();
    }
  }, [editBillingContactRouteMatch, handleEditDrawerOpen]);

  // Listen for changes to history state and open the drawer if necessary.
  // This is currently in use by the EmailBounceNotification, which navigates
  // the user to the Account page and opens the drawer to prompt them to change
  // their billing email address.
  React.useEffect(() => {
    if (!editContactDrawerOpen && history.location.state?.contactDrawerOpen) {
      setEditContactDrawerOpen(true);
      if (history.location.state?.focusEmail) {
        setFocusEmail(true);
      }
    }
  }, [editContactDrawerOpen, history.location.state]);

  // Finding the country from the countryData JSON
  const countryName = countryData?.find(
    (_country) => _country.countryShortCode === country
  )?.countryName;

  return (
    <Grid xs={12} md={6}>
      <BillingPaper variant="outlined" data-qa-contact-summary>
        <BillingBox>
          <Typography variant="h3">Billing Contact</Typography>
          <BillingActionButton
            onClick={() => {
              history.push('/account/billing/edit');
              handleEditDrawerOpen();
            }}
          >
            Edit
          </BillingActionButton>
        </BillingBox>

        <Grid container spacing={2}>
          {(firstName ||
            lastName ||
            company ||
            address1 ||
            address2 ||
            city ||
            state ||
            zip ||
            country) && (
            <Grid className={classes.switchWrapper}>
              {(firstName || lastName) && (
                <Typography
                  className={`${classes.section} ${classes.wordWrap}`}
                  data-qa-contact-name
                >
                  {firstName} {lastName}
                </Typography>
              )}
              {company && (
                <Typography
                  className={`${classes.section} ${classes.wordWrap}`}
                  data-qa-company
                >
                  {company}
                </Typography>
              )}
              {(address1 || address2 || city || state || zip || country) && (
                <>
                  <Typography
                    className={classes.section}
                    data-qa-contact-address
                  >
                    {address1}
                  </Typography>
                  <Typography className={classes.section}>
                    {address2}
                  </Typography>
                </>
              )}
              <Typography className={classes.section}>
                {city}
                {city && state && ','} {state} {zip}
              </Typography>
              <Typography className={classes.section}>{countryName}</Typography>
            </Grid>
          )}

          <Grid
            className={cx({
              [classes.switchWrapper]: true,
              [classes.switchWrapperFlex]:
                taxId !== undefined && taxId !== null && taxId !== '',
            })}
          >
            <Typography
              className={`${classes.section} ${classes.wordWrap}`}
              data-qa-contact-email
            >
              {email}
            </Typography>
            {phone && (
              <Typography className={classes.section} data-qa-contact-phone>
                {phone}
              </Typography>
            )}
            {taxId && (
              <Typography
                className={classes.section}
                style={{ marginTop: 'auto' }}
              >
                <strong>Tax ID</strong> {taxId}
              </Typography>
            )}
          </Grid>
        </Grid>
      </BillingPaper>
      <BillingContactDrawer
        open={editContactDrawerOpen}
        onClose={() => {
          history.replace('/account/billing', { contactDrawerOpen: false });
          setEditContactDrawerOpen(false);
          setFocusEmail(false);
        }}
        focusEmail={focusEmail}
      />
    </Grid>
  );
};

export default React.memo(ContactInformation);
