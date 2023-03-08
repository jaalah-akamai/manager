import * as React from 'react';
import Grid from 'src/components/Grid';
import ImageCreate from './ImageCreate';
import LandingHeader from 'src/components/LandingHeader';

export const ImagesCreateContainer: React.FC = () => {
  return (
    <Grid container>
      <LandingHeader
        title="Create"
        docsLabel="Docs"
        docsLink="https://www.linode.com/docs/products/tools/images/"
        removeCrumbX={2}
        data-qa-create-image-header
      />
      <Grid item className="p0" xs={12}>
        <ImageCreate />
      </Grid>
    </Grid>
  );
};

export default ImagesCreateContainer;
