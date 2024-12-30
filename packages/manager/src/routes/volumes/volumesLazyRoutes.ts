import { VolumesCreate as VolumesCreateMFE } from '@remote/VolumesCreate';
import { createLazyRoute } from '@tanstack/react-router';

import { VolumeCreate } from 'src/features/Volumes/VolumeCreate';
import { VolumesLanding } from 'src/features/Volumes/VolumesLanding';

export const volumesLandingLazyRoute = createLazyRoute('/')({
  component: VolumesLanding,
});

import('@remote/VolumesCreate')
  .then((module) => {
    console.log('Remote module loaded:', module);
    console.log('Module contents:', Object.keys(module));
  })
  .catch((error) => {
    console.error('Failed to load remote module:', error);
  });

export const volumeCreateLazyRoute = createLazyRoute('/volumes/create')({
  component: VolumeCreate,
});

export const volumeCreateMFELazyRoute = createLazyRoute('/volumes/create-mfe')({
  component: VolumesCreateMFE,
});
