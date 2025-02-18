import { createContext, ReactNode, useContext, useMemo } from 'react';

import { useGetOrganization } from '@app/hooks/api';
import { Organization } from '@app/hooks/api/types';

import { useWorkspace } from '../WorkspaceContext';

type TOrgContext = {
  orgs?: Organization[];
  currentOrg?: Organization;
  isLoading: boolean;
};

const OrgContext = createContext<TOrgContext | null>(null);

type Props = {
  children: ReactNode;
};

export const OrgProvider = ({ children }: Props): JSX.Element => {
  const { currentWorkspace } = useWorkspace();
  const { data: userOrgs, isLoading } = useGetOrganization();

  const currentWsOrgID = currentWorkspace?.organization;

  // memorize the workspace details for the context
  const value = useMemo<TOrgContext>(
    () => ({
      orgs: userOrgs,
      currentOrg: (userOrgs || []).find(({ _id }) => _id === currentWsOrgID),
      isLoading
    }),
    [currentWsOrgID, userOrgs, isLoading]
  );

  return <OrgContext.Provider value={value}>{children}</OrgContext.Provider>;
};

export const useOrganization = () => {
  const ctx = useContext(OrgContext);
  if (!ctx) {
    throw new Error('useOrganization to be used within <OrgContext.Provider>');
  }

  return ctx;
};
