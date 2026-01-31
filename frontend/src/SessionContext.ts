import * as React from 'react';
import type { Session as ToolpadSession } from '@toolpad/core';

// Extend Toolpad's Session to include role
export interface User {
  id: string;
  companyId: string;
  name: string;
  email: string;
  image?: string;
  role: string;
}

export interface Session extends Omit<ToolpadSession, 'user'> {
  user: User;
}

export interface SessionContextValue {
  session: Session | null;
  setSession: (session: Session | null) => void;
}

export const SessionContext = React.createContext<SessionContextValue>({
  session: null,
  setSession: () => {},
});

export function useSession() {
  return React.useContext(SessionContext);
}
