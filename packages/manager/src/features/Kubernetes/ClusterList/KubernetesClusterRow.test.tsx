import { render } from '@testing-library/react';
import * as React from 'react';

import { kubernetesClusterFactory, regionFactory } from 'src/factories';
import { makeResourcePage } from 'src/mocks/serverHandlers';
import { rest, server } from 'src/mocks/testServer';
import { wrapWithTableBody, wrapWithTheme } from 'src/utilities/testHelpers';

import { KubernetesClusterRow, Props } from './KubernetesClusterRow';

const cluster = kubernetesClusterFactory.build({ region: 'us-central' });

const props: Props = {
  cluster,
  openDeleteDialog: vi.fn(),
  openUpgradeDialog: vi.fn(),
};

describe('ClusterRow component', () => {
  it('should render', () => {
    const { getByTestId } = render(
      wrapWithTheme(wrapWithTableBody(<KubernetesClusterRow {...props} />))
    );

    getByTestId('cluster-row');
  });

  it('renders a TableRow with label, and region', async () => {
    server.use(
      rest.get('*/regions', (req, res, ctx) => {
        const regions = regionFactory.buildList(1, {
          id: 'us-central',
          label: 'Fake Region, NC',
        });
        return res(ctx.json(makeResourcePage(regions)));
      })
    );

    const { getByText, findByText } = render(
      wrapWithTableBody(<KubernetesClusterRow {...props} />)
    );

    getByText('cluster-0');
    await findByText('Fake Region, NC');
  });

  it('renders HA chip for highly available clusters and hides chip for non-ha clusters', () => {
    const { getByTestId, queryByTestId, rerender } = render(
      wrapWithTableBody(
        <KubernetesClusterRow
          {...props}
          cluster={kubernetesClusterFactory.build({
            control_plane: { high_availability: true },
          })}
        />
      )
    );

    getByTestId('ha-chip');

    rerender(
      wrapWithTableBody(
        <KubernetesClusterRow
          {...props}
          cluster={kubernetesClusterFactory.build({
            control_plane: { high_availability: false },
          })}
        />
      )
    );
    expect(queryByTestId('ha-chip')).toBeNull();
  });
});
