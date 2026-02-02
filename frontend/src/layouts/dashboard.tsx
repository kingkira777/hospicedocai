import * as React from 'react';
import { Outlet } from 'react-router';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { SidebarFooterProps } from '@toolpad/core/DashboardLayout';
import { Typography } from '@mui/material';
import { useSession } from '../SessionContext';

function SidebarFooter({ mini }: SidebarFooterProps) {
  const { session } = useSession();

  return (
    <Typography
      variant="caption"
      sx={{ m: 1, whiteSpace: 'nowrap', overflow: 'hidden' }}
    >
      {mini ? `© ${session?.user.company}` : `© ${session?.user.company} ${new Date().getFullYear()}`}
    </Typography>
  );
}

export default function Layout() {
  
  return (
    <DashboardLayout 
      slots={{
        sidebarFooter : SidebarFooter
      }} 
    >
      <Outlet />
    </DashboardLayout>
  );
}