import { mockGetAccount } from 'support/intercepts/account';
import { mockAppendFeatureFlags } from 'support/intercepts/feature-flags';
import {
  mockGetObjectStorageEndpoints,
  mockGetBuckets,
  mockDeleteBucket,
  mockCreateBucket,
} from 'support/intercepts/object-storage';
import { mockGetRegions } from 'support/intercepts/regions';
import { ui } from 'support/ui';
import { randomLabel } from 'support/util/random';
import {
  accountFactory,
  objectStorageBucketFactoryGen2,
  objectStorageEndpointsFactory,
  regionFactory,
} from 'src/factories';
import { chooseRegion } from 'support/util/regions';
import type {
  ObjectStorageEndpoint,
  ObjectStorageEndpointTypes,
} from '@linode/api-v4';

describe('Object Storage Gen2 create bucket tests', () => {
  const mockRegions = regionFactory.buildList(10, {
    capabilities: ['Object Storage'],
  });
  const mockRegion = chooseRegion({ regions: [...mockRegions] });

  const mockEndpoints: ObjectStorageEndpoint[] = [
    objectStorageEndpointsFactory.build({
      endpoint_type: 'E0',
      region: mockRegion.id,
      s3_endpoint: null,
    }),
    objectStorageEndpointsFactory.build({
      endpoint_type: 'E1',
      region: mockRegion.id,
      s3_endpoint: null,
    }),
    objectStorageEndpointsFactory.build({
      endpoint_type: 'E1',
      region: mockRegion.id,
      s3_endpoint: 'us-sea-1.linodeobjects.com',
    }),
    objectStorageEndpointsFactory.build({
      endpoint_type: 'E2',
      region: mockRegion.id,
      s3_endpoint: null,
    }),
    objectStorageEndpointsFactory.build({
      endpoint_type: 'E3',
      region: mockRegion.id,
      s3_endpoint: null,
    }),
  ];

  const setupTest = (
    endpointType: ObjectStorageEndpointTypes,
    bucketLabel: string
  ) => {
    const mockBucket = objectStorageBucketFactoryGen2.build({
      label: bucketLabel,
      region: mockRegion.id,
      endpoint_type: endpointType,
      s3_endpoint: undefined,
    });

    mockGetBuckets([]).as('getBuckets');
    mockDeleteBucket(bucketLabel, mockRegion.id).as('deleteBucket');
    mockCreateBucket({
      label: bucketLabel,
      endpoint_type: endpointType,
      cors_enabled: endpointType === 'E0' || endpointType === 'E1',
      region: mockRegion.id,
    }).as('createBucket');

    mockAppendFeatureFlags({
      objMultiCluster: true,
      objectStorageGen2: { enabled: true },
    }).as('getFeatureFlags');
    mockGetAccount(
      accountFactory.build({
        capabilities: [
          'Object Storage',
          'Object Storage Endpoint Types',
          'Object Storage Access Key Regions',
        ],
      })
    ).as('getAccount');

    mockGetObjectStorageEndpoints(mockEndpoints).as(
      'getObjectStorageEndpoints'
    );
    mockGetRegions(mockRegions);

    cy.visitWithLogin('/object-storage/buckets/create');
    cy.wait([
      '@getFeatureFlags',
      '@getBuckets',
      '@getAccount',
      '@getObjectStorageEndpoints',
    ]);

    return mockBucket;
  };

  const createBucket = (
    endpointType: ObjectStorageEndpointTypes,
    bucketLabel: string
  ) => {
    ui.drawer
      .findByTitle('Create Bucket')
      .should('be.visible')
      .within(() => {
        cy.findByText('Label').click().type(bucketLabel);
        ui.regionSelect.find().click().type(`${mockRegion.label}{enter}`);
        cy.findByLabelText('Object Storage Endpoint Type')
          .should('be.visible')
          .click();

        ui.autocompletePopper
          .findByTitle(`Standard (${endpointType})`)
          .scrollIntoView()
          .should('be.visible')
          .should('be.enabled')
          .click();

        // Check for rate limits text and table based on endpoint type
        if (endpointType !== 'E0' && endpointType !== 'E1') {
          cy.findByText('Bucket Rate Limits').should('be.visible');
          cy.contains(
            'Specifies the maximum Requests Per Second (RPS) for a bucket'
          ).should('be.visible');
          cy.get('[data-testid="bucket-rate-limit-table"]').should('exist');
          checkRateLimitsTable(endpointType);
        } else {
          cy.contains(
            'This endpoint type supports up to 750 Requests Per Second (RPS)'
          ).should('be.visible');
          cy.get('[data-testid="bucket-rate-limit-table"]').should('not.exist');
        }

        ui.buttonGroup
          .findButtonByTitle('Create Bucket')
          .should('be.visible')
          .should('be.enabled')
          .click();
      });
  };

  const checkRateLimitsTable = (endpointType: ObjectStorageEndpointTypes) => {
    const expectedHeaders = ['Limits', 'GET', 'PUT', 'LIST', 'DELETE', 'OTHER'];
    const expectedBasicValues = ['Basic', '2,000', '500', '100', '200', '400'];
    const expectedHighValues =
      endpointType === 'E3'
        ? ['High', '20,000', '2,000', '400', '400', '1,000']
        : ['High', '5,000', '1,000', '200', '200', '800'];

    cy.get('[data-testid="bucket-rate-limit-table"]').within(() => {
      [expectedHeaders, expectedBasicValues, expectedHighValues].forEach(
        (values, rowIndex) => {
          cy.findAllByRole('row')
            .eq(rowIndex)
            .within(() => {
              values.forEach((value, columnIndex) => {
                const selector =
                  columnIndex === 0 ? 'th' : `td:nth-child(${columnIndex + 1})`;
                cy.get(selector)
                  .scrollIntoView()
                  .should('be.visible')
                  .and('contain.text', value);
              });
            });
        }
      );

      cy.findByLabelText('Basic').should('be.checked');
    });
  };

  const verifyAndDeleteBucket = (endpointType: string, bucketLabel: string) => {
    cy.findByText(`Standard (${endpointType})`).should('be.visible');
    cy.findByText(bucketLabel)
      .should('be.visible')
      .closest('tr')
      .within(() => {
        cy.findByText(mockRegion.label).should('be.visible');
        ui.button.findByTitle('Delete').should('be.visible').click();
      });

    ui.dialog
      .findByTitle(`Delete Bucket ${bucketLabel}`)
      .should('be.visible')
      .within(() => {
        cy.findByLabelText('Bucket Name').click().type(bucketLabel);
        ui.buttonGroup
          .findButtonByTitle('Delete')
          .should('be.visible')
          .should('be.enabled')
          .click();
      });

    mockGetBuckets([]).as('getBuckets');
    cy.wait(['@deleteBucket', '@getBuckets']);
    cy.findByText(bucketLabel).should('not.exist');
  };

  const testEndpointType = (endpointType: ObjectStorageEndpointTypes) => {
    it(`can create a bucket with endpoint type ${endpointType}`, () => {
      const bucketLabel = randomLabel();
      const mockBucket = setupTest(endpointType, bucketLabel);

      createBucket(endpointType, bucketLabel);

      mockGetBuckets([mockBucket]).as('getBuckets');
      cy.wait(['@getBuckets']);

      cy.wait('@createBucket').then((xhr) => {
        const requestPayload = xhr.request.body;
        expect(requestPayload['endpoint_type']).to.equal(endpointType);
        expect(requestPayload['cors_enabled']).to.equal(
          endpointType === 'E0' || endpointType === 'E1'
        );
      });

      ui.drawer.find().should('not.exist');

      verifyAndDeleteBucket(endpointType, bucketLabel);
    });
  };

  ['E0', 'E1', 'E2', 'E3'].forEach(testEndpointType);
});
