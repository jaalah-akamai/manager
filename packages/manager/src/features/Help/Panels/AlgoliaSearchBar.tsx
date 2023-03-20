import Search from '@mui/icons-material/Search';
import { pathOr } from 'ramda';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withStyles } from 'tss-react/mui';
import { Theme } from '@mui/material/styles';
import EnhancedSelect, { Item } from 'src/components/EnhancedSelect';
import Notice from 'src/components/Notice';
import { selectStyles } from 'src/features/TopMenu/SearchBar';
import windowIsNarrowerThan from 'src/utilities/breakpoints';
import withSearch, { AlgoliaState as AlgoliaProps } from '../SearchHOC';
import SearchItem from './SearchItem';

type ClassNames =
  | 'root'
  | 'searchIcon'
  | 'searchItem'
  | 'enhancedSelectWrapper';

interface State {
  inputValue: string;
}

type Props = {
  classes?: Partial<Record<ClassNames, string>>;
  theme: Theme;
};

type CombinedProps = Props & AlgoliaProps & RouteComponentProps<{}>;

class _AlgoliaSearchBar extends React.Component<CombinedProps, State> {
  searchIndex: any = null;
  mounted: boolean = false;
  isMobile: boolean = false;
  state: State = {
    inputValue: '',
  };

  componentDidMount() {
    const { theme } = this.props;
    this.mounted = true;
    if (theme) {
      this.isMobile = windowIsNarrowerThan(theme.breakpoints.values.sm);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  getOptionsFromResults = () => {
    const [docs, community] = this.props.searchResults;
    const { inputValue } = this.state;
    const options = [...docs, ...community];
    return [
      { value: 'search', label: inputValue, data: { source: 'finalLink' } },
      ...options,
    ];
  };

  onInputValueChange = (inputValue: string) => {
    if (!this.mounted) {
      return;
    }
    this.setState({ inputValue });
    this.props.searchAlgolia(inputValue);
  };

  getLinkTarget = (inputValue: string) => {
    return inputValue
      ? `/support/search/?query=${inputValue}`
      : '/support/search/';
  };

  handleSelect = (selected: Item<string>) => {
    if (!selected) {
      return;
    }
    const { history } = this.props;
    const { inputValue } = this.state;
    if (!inputValue) {
      return;
    }
    const href = pathOr('', ['data', 'href'], selected);
    if (selected.value === 'search') {
      const link = this.getLinkTarget(inputValue);
      history.push(link);
    } else {
      window.open(href, '_blank', 'noopener');
    }
  };

  handleSubmit = () => {
    const { inputValue } = this.state;
    if (!inputValue) {
      return;
    }
    const { history } = this.props;
    const link = this.getLinkTarget(inputValue);
    history.push(link);
  };

  render() {
    const classes = withStyles.getClasses(this.props);
    const { searchEnabled, searchError } = this.props;
    const { inputValue } = this.state;
    const options = this.getOptionsFromResults();

    return (
      <React.Fragment>
        {searchError && (
          <Notice error spacingTop={8} spacingBottom={0}>
            {searchError}
          </Notice>
        )}
        <div className={classes.root}>
          <Search className={classes.searchIcon} data-qa-search-icon />
          <EnhancedSelect
            disabled={!searchEnabled}
            isMulti={false}
            isClearable={false}
            inputValue={inputValue}
            options={options}
            components={
              { Option: SearchItem, DropdownIndicator: () => null } as any
            }
            onChange={this.handleSelect}
            onInputChange={this.onInputValueChange}
            placeholder="Search for answers..."
            label="Search for answers"
            hideLabel
            className={classes.enhancedSelectWrapper}
            styles={selectStyles}
            value={false}
          />
        </div>
      </React.Fragment>
    );
  }
}

const search = withSearch({ hitsPerPage: 10, highlight: true });

const AlgoliaSearchBar = withStyles(_AlgoliaSearchBar, (theme: Theme) => ({
  root: {
    position: 'relative' as const,
  },
  searchItem: {
    '& em': {
      fontStyle: 'normal',
      color: theme.palette.primary.main,
    },
  },
  searchIcon: {
    position: 'absolute' as const,
    color: theme.color.grey1,
    zIndex: 3,
    top: 4,
    left: 5,
  },
  enhancedSelectWrapper: {
    margin: '0 auto',
    width: 300,
    maxHeight: 500,
    '& .react-select__value-container': {
      paddingLeft: theme.spacing(4),
    },
    '& .input': {
      maxWidth: '100%',
      '& p': {
        paddingLeft: theme.spacing(3),
        color: theme.color.grey1,
      },
      '& > div': {
        marginRight: 0,
      },
    },
    [theme.breakpoints.up('md')]: {
      width: 500,
    },
  },
}));

export default compose<CombinedProps, {}>(search, withRouter)(AlgoliaSearchBar);
