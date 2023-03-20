import * as React from 'react';
import { DocumentTitleSegment } from 'src/components/DocumentTitle';
import OtherWays from './Panels/OtherWays';
import PopularPosts from './Panels/PopularPosts';
import SearchPanel from './Panels/SearchPanel';
import { styled } from '@mui/material/styles';

const Wrapper = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    padding: `${theme.spacing(2)} ${theme.spacing(14)}`,
  },
}));

export const HelpLanding = () => {
  return (
    <Wrapper>
      <DocumentTitleSegment segment="Get Help" />
      <SearchPanel />
      <PopularPosts />
      <OtherWays />
    </Wrapper>
  );
};

export default HelpLanding;
