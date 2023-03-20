import * as React from 'react';
import _LinodeIcon from 'src/assets/addnewmenu/linode.svg';
import Paper from 'src/components/core/Paper';
import H1Header from 'src/components/H1Header';
import AlgoliaSearchBar from './AlgoliaSearchBar';
import { useTheme, styled } from '@mui/material/styles';

const SearchPanel = () => {
  const theme = useTheme();

  return (
    <StyledPaper>
      <LinodeIcon />
      <H1Header
        title="What can we help you with?"
        data-qa-search-heading
        sx={{
          textAlign: 'center',
          color: theme.color.white,
          position: 'relative',
          zIndex: 2,
        }}
      />
      <AlgoliaSearchBar />
    </StyledPaper>
  );
};

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: theme.color.green,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(8),
  },
}));

const LinodeIcon = styled(_LinodeIcon)(({ theme }) => ({
  color: '#04994D',
  position: 'absolute',
  left: 0,
  width: 250,
  height: 250,
  '& .circle': {
    fill: 'transparent',
  },
  '& .outerCircle': {
    stroke: 'transparent',
  },
  '& .insidePath *': {
    stroke: '#04994D',
  },
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

export default SearchPanel;
