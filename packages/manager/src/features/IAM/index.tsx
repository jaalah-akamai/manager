import * as React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { ProductInformationBanner } from 'src/components/ProductInformationBanner/ProductInformationBanner';
import { SuspenseLoader } from 'src/components/SuspenseLoader';

import type { RouteComponentProps } from 'react-router-dom';

const IAMLanding = React.lazy(() =>
  import('./IAMLanding').then((module) => ({
    default: module.IdentityAccessLanding,
  }))
);

const UserDetails = React.lazy(() =>
  import('./Users/UserDetailsLanding').then((module) => ({
    default: module.UserDetailsLanding,
  }))
);

const UserRoles = React.lazy(() =>
  import('./Users/UserRoles/UserRoles').then((module) => ({
    default: module.UserRoles,
  }))
);

const UserResources = React.lazy(() =>
  import('./Users/UserResources/UserResources').then((module) => ({
    default: module.UserResources,
  }))
);

export const IdentityAccessManagement = (props: RouteComponentProps) => {
  const path = props.match.path;

  return (
    <React.Suspense fallback={<SuspenseLoader />}>
      <ProductInformationBanner bannerLocation="Identity and Access" />
      <Switch>
        <Route
          component={UserDetails}
          exact
          path={`${path}/users/:username/details`}
        />
        <Route
          component={UserRoles}
          exact
          path={`${path}/users/:username/roles`}
        />
        <Route
          component={UserResources}
          exact
          path={`${path}/users/:username/resources`}
        />
        <Route component={IAMLanding} exact path={`${path}/users`} />

        {/* Default redirects */}
        <Redirect exact from={path} to={`${path}/users`} />
        <Redirect
          from={`${path}/users/roles/*`}
          to={`${path}/users/roles/details`}
        />
        <Redirect
          from={`${path}/users/:username/*`}
          to={`${path}/users/:username/details`}
        />
        <Redirect from={`${path}/*`} to={`${path}/users`} />
      </Switch>
    </React.Suspense>
  );
};
