import { Outlet, useNavigate } from 'react-router';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import { getNavigation } from './constant/navigations';
import React from 'react';
import { SessionContext, Session } from './SessionContext';

import './styles/global.css';

const BRANDING = {
  title: "Hospice Documents (IQ)",
};


export default function App() {
  const [session, setSessionState] = React.useState<Session | null>(() => {
    const storedSession = localStorage.getItem('session');
    return storedSession ? JSON.parse(storedSession) : null;
  });
  const navigate = useNavigate();

  const setSession = React.useCallback((newSession: Session | null) => {
    setSessionState(newSession);
    if (newSession) {
      localStorage.setItem('session', JSON.stringify(newSession));
    } else {
      localStorage.removeItem('session');
    }
  }, []);

  const signIn = React.useCallback(() => {
    navigate('/sign-in');
  }, [navigate]);

  const signOut = React.useCallback(() => {
    setSession(null);
    navigate('/sign-in');
  }, [navigate, setSession]);


  const sessionContextValue = React.useMemo(() => ({ session, setSession }), [session, setSession]);
  
  return (
    <SessionContext.Provider value={sessionContextValue}>
      <ReactRouterAppProvider navigation={getNavigation()} 
      branding={BRANDING} 
      session={session} 
      authentication={{ signIn, signOut }}>
        <Outlet />
      </ReactRouterAppProvider>
    </SessionContext.Provider>
  );
}