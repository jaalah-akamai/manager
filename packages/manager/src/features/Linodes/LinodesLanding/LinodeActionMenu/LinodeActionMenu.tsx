import { LinodeBackups, LinodeType } from '@linode/api-v4/lib/linodes';
import * as React from 'react';
import { useHistory } from 'react-router-dom';

import { ActionMenu } from 'src/components/ActionMenu/ActionMenu';
import {
  ActionType,
  getRestrictedResourceText,
} from 'src/features/Account/utils';
import { buildQueryStringForLinodeClone } from 'src/features/Linodes/LinodesLanding/LinodeActionMenu/LinodeActionMenuUtils';
import { useLinodeActionVisibility } from 'src/features/Linodes/LinodesLanding/LinodeActionMenu/useLinodeActionVisibility';
import { LinodeHandlers } from 'src/features/Linodes/LinodesLanding/LinodesLanding';
import { lishLaunch } from 'src/features/Lish/lishUtils';
import { useRegionsQuery } from 'src/queries/regions';
import { useSpecificTypes } from 'src/queries/types';
import {
  sendLinodeActionEvent,
  sendLinodeActionMenuItemEvent,
  sendMigrationNavigationEvent,
} from 'src/utilities/analytics';
import { extendType } from 'src/utilities/extendType';

export interface LinodeActionMenuProps extends LinodeHandlers {
  inListView?: boolean;
  linodeBackups: LinodeBackups;
  linodeId: number;
  linodeLabel: string;
  linodeRegion: string;
  linodeStatus: string;
  linodeType?: LinodeType;
}

interface ActionConfig {
  condition: boolean;
  disabled: boolean;
  isReadOnly: boolean;
  onClick: () => void;
  title: string;
  tooltipAction: ActionType;
  tooltipText?: string;
}

export const LinodeActionMenu = (props: LinodeActionMenuProps) => {
  const {
    inListView,
    linodeId,
    linodeRegion,
    linodeStatus,
    linodeType,
  } = props;
  const typesQuery = useSpecificTypes(linodeType?.id ? [linodeType.id] : []);
  const type = typesQuery[0]?.data;
  const extendedType = type ? extendType(type) : undefined;
  const history = useHistory();
  const regions = useRegionsQuery().data ?? [];
  const isBareMetalInstance = linodeType?.class === 'metal';
  const hasHostMaintenance = true;
  const { isLinodeReadOnly, isVisible } = useLinodeActionVisibility({
    inListView,
    linodeId,
  });

  const maintenanceTooltipText =
    hasHostMaintenance && !isLinodeReadOnly
      ? 'This action is unavailable while your Linode is undergoing host maintenance.'
      : undefined;

  const handlePowerAction = () => {
    const action = linodeStatus === 'running' ? 'Power Off' : 'Power On';
    sendLinodeActionMenuItemEvent(`${action} Linode`);
    props.onOpenPowerDialog(action);
  };

  const actionConfigs: ActionConfig[] = [
    {
      condition: isVisible,
      disabled:
        !['offline', 'running'].includes(linodeStatus) || isLinodeReadOnly,
      isReadOnly: isLinodeReadOnly,
      onClick: handlePowerAction,
      title: linodeStatus === 'running' ? 'Power Off' : 'Power On',
      tooltipAction: 'modify',
    },
    {
      condition: isVisible,
      disabled: linodeStatus !== 'running' || isLinodeReadOnly,
      isReadOnly: isLinodeReadOnly,
      onClick: () => {
        sendLinodeActionMenuItemEvent('Reboot Linode');
        props.onOpenPowerDialog('Reboot');
      },
      title: 'Reboot',
      tooltipAction: 'reboot',
      tooltipText: !isLinodeReadOnly
        ? 'This action is unavailable while your Linode is offline.'
        : undefined,
    },
    {
      condition: isVisible,
      disabled: isLinodeReadOnly,
      isReadOnly: isLinodeReadOnly,
      onClick: () => {
        sendLinodeActionMenuItemEvent('Launch Console');
        lishLaunch(linodeId);
      },
      title: 'Launch LISH Console',
      tooltipAction: 'edit',
    },
    {
      condition: !isBareMetalInstance,
      disabled: isLinodeReadOnly || hasHostMaintenance,
      isReadOnly: isLinodeReadOnly,
      onClick: () => {
        sendLinodeActionMenuItemEvent('Clone');
        history.push({
          pathname: '/linodes/create',
          search: buildQueryStringForLinodeClone(
            linodeId,
            linodeRegion,
            linodeType?.id ?? null,
            extendedType ? [extendedType] : null,
            regions
          ),
        });
      },
      title: 'Clone',
      tooltipAction: 'clone',
      tooltipText: maintenanceTooltipText,
    },
    {
      condition: !isBareMetalInstance,
      disabled: isLinodeReadOnly || hasHostMaintenance,
      isReadOnly: isLinodeReadOnly,
      onClick: props.onOpenResizeDialog,
      title: 'Resize',
      tooltipAction: 'resize',
      tooltipText: maintenanceTooltipText,
    },
    {
      condition: true,
      disabled: isLinodeReadOnly || hasHostMaintenance,
      isReadOnly: isLinodeReadOnly,
      onClick: props.onOpenRebuildDialog,
      title: 'Rebuild',
      tooltipAction: 'rebuild',
      tooltipText: maintenanceTooltipText,
    },
    {
      condition: true,
      disabled: isLinodeReadOnly || hasHostMaintenance,
      isReadOnly: isLinodeReadOnly,
      onClick: props.onOpenRescueDialog,
      title: 'Rescue',
      tooltipAction: 'rescue',
      tooltipText: maintenanceTooltipText,
    },
    {
      condition: !isBareMetalInstance,
      disabled: isLinodeReadOnly || hasHostMaintenance,
      isReadOnly: isLinodeReadOnly,
      onClick: () => {
        sendMigrationNavigationEvent('/linodes');
        sendLinodeActionMenuItemEvent('Migrate');
        props.onOpenMigrateDialog();
      },
      title: 'Migrate',
      tooltipAction: 'migrate',
      tooltipText: maintenanceTooltipText,
    },
    {
      condition: true,
      disabled: isLinodeReadOnly || hasHostMaintenance,
      isReadOnly: isLinodeReadOnly,
      onClick: () => {
        sendLinodeActionMenuItemEvent('Delete Linode');
        props.onOpenDeleteDialog();
      },
      title: 'Delete',
      tooltipAction: 'delete',
      tooltipText: maintenanceTooltipText,
    },
  ];

  const actions = createActionMenuItems(actionConfigs, isLinodeReadOnly);

  return (
    <ActionMenu
      actionsList={actions}
      ariaLabel={`Action menu for Linode ${props.linodeLabel}`}
      onOpen={sendLinodeActionEvent}
    />
  );
};

export const createActionMenuItems = (
  configs: ActionConfig[],
  isReadOnly: boolean
) =>
  configs
    .filter(({ condition }) => condition)
    .map(({ disabled, onClick, title, tooltipAction, tooltipText }) => {
      const defaultTooltipText = isReadOnly
        ? getRestrictedResourceText({
            action: tooltipAction,
            resourceType: 'Linodes',
          })
        : undefined;

      return {
        disabled: disabled || isReadOnly,
        onClick,
        title,
        tooltip: tooltipText || defaultTooltipText,
      };
    });
