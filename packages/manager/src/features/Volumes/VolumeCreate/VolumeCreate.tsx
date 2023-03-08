import * as React from 'react';
import { connect, MapDispatchToProps } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { DocumentTitleSegment } from 'src/components/DocumentTitle';
import { useRegionsQuery } from 'src/queries/regions';
import { MapState } from 'src/store/types';
import { openForConfig, viewResizeInstructions } from 'src/store/volumeForm';
import CreateVolumeForm from './CreateVolumeForm';
import LandingHeader from 'src/components/LandingHeader';

interface StateProps {
  mode: string;
  volumeId?: number;
  volumeLabel?: string;
  volumeRegion?: string;
  volumeSize?: number;
  volumeTags?: string[];
  volumePath?: string;
  linodeId?: number;
  linodeLabel?: string;
  linodeRegion?: string;
  message?: string;
}

interface DispatchProps {
  actions: {
    openForConfig: (
      volumeLabel: string,
      volumePath: string,
      message?: string
    ) => void;
    openForResizeInstructions: (volumeLabel: string, message?: string) => void;
  };
}

const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = (
  dispatch
) => ({
  actions: {
    openForConfig: (
      volumeLabel: string,
      volumePath: string,
      message?: string
    ) => dispatch(openForConfig(volumeLabel, volumePath, message)),
    openForResizeInstructions: (volumeLabel: string, message?: string) =>
      dispatch(viewResizeInstructions({ volumeLabel, message })),
  },
});

type CombinedProps = StateProps & RouteComponentProps<{}> & DispatchProps;

const VolumeCreate: React.FC<CombinedProps> = (props) => {
  const regions = useRegionsQuery().data ?? [];

  const { actions, history } = props;

  return (
    <>
      <DocumentTitleSegment segment="Create Volume" />
      <LandingHeader title="Create" />
      <CreateVolumeForm
        onSuccess={actions.openForConfig}
        regions={regions}
        history={history}
      />
    </>
  );
};

const mapStateToProps: MapState<StateProps, {}> = (state) => {
  const {
    linodeId,
    linodeLabel,
    linodeRegion,
    mode,
    volumeId,
    volumeLabel,
    volumeRegion,
    volumeSize,
    volumeTags,
    volumePath,
    message,
  } = state.volumeDrawer;

  return {
    linode_id: linodeId,
    linodeLabel,
    linodeRegion,
    mode,
    volumeId,
    volumeLabel,
    volumeRegion,
    volumeSize,
    volumeTags,
    volumePath,
    message,
  };
};

const connected = connect(mapStateToProps, mapDispatchToProps);

export default connected(VolumeCreate);
