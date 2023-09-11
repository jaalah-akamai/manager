/* eslint-disable @typescript-eslint/no-empty-function */
import * as React from 'react';

import { Action, ActionMenu } from 'src/components/ActionMenu';

interface SubnetsActionMenuProps {
  onUnassignSubnet: () => void;
}

export const SubnetsActionMenu = ({
  onUnassignSubnet,
}: SubnetsActionMenuProps) => {
  const handleAssignLinode = () => {};

  const handleUnassignLinode = () => {
    onUnassignSubnet();
  };

  const handleEdit = () => {};

  const handleDelete = () => {};

  const actions: Action[] = [
    {
      onClick: () => {
        handleAssignLinode();
      },
      title: 'Assign Linode',
    },
    {
      onClick: () => {
        handleUnassignLinode();
      },
      title: 'Unassign Linode',
    },
    {
      onClick: () => {
        handleEdit();
      },
      title: 'Edit',
    },
    {
      onClick: () => {
        handleDelete();
      },
      title: 'Delete',
    },
  ];

  return (
    <ActionMenu actionsList={actions} ariaLabel={`Action menu for Subnet`} />
  );
};

export default SubnetsActionMenu;
