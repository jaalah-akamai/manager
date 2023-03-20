import { assocPath } from 'ramda';
import * as React from 'react';
import { reactRouterProps } from 'src/__data__/reactRouterProps';
import { CombinedProps, SupportSearchLanding } from './SupportSearchLanding';
import LinodeThemeWrapper from 'src/LinodeThemeWrapper';
import { renderWithTheme } from 'src/utilities/testHelpers';

const H1 = 'Search results for "search"';

const classes = {
  root: '',
  backButton: '',
  searchBar: '',
  searchBoxInner: '',
  searchHeading: '',
  searchField: '',
  searchIcon: '',
};

const props: CombinedProps = {
  classes,
  searchAlgolia: jest.fn(),
  searchResults: [[], []],
  searchEnabled: true,
  ...reactRouterProps,
};

const propsWithQuery = assocPath(
  ['location', 'search'],
  '?query=search',
  props
);

const propsWithMultiWordURLQuery = assocPath(
  ['location', 'search'],
  '?query=search%20two%20words',
  props
);

// Convert to react testing library test
describe('SupportSearchLanding', () => {
  it('should render with generic text if no query provided', () => {
    const { getByText } = renderWithTheme(
      <LinodeThemeWrapper>
        <SupportSearchLanding {...props} />
      </LinodeThemeWrapper>
    );
    expect(getByText(H1)).toBeInTheDocument();
  });

  it('should read multi-word queries correctly', () => {
    const { getByText } = renderWithTheme(
      <LinodeThemeWrapper>
        <SupportSearchLanding {...propsWithMultiWordURLQuery} />
      </LinodeThemeWrapper>
    );
    expect(
      getByText('Search results for "search two words"')
    ).toBeInTheDocument();
  });

  it('should display the query text in the header', () => {
    const { getByText } = renderWithTheme(
      <LinodeThemeWrapper>
        <SupportSearchLanding {...propsWithQuery} />
      </LinodeThemeWrapper>
    );
    expect(getByText('Search results for "search"')).toBeInTheDocument();
  });
});
