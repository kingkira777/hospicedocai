import type { Navigation } from '@toolpad/core/AppProvider';
import { 
  Dashboard as DashboardIcon,
  FileUploadOutlined as FileUploadOutlinedIcon,
  Description as DescriptionIcon,
  People as PeopleIcon,
  BackupTableOutlined,
  GroupOutlined
} from '@mui/icons-material';
import { Session } from '../SessionContext';

const getNavigation = (session: Session | null): Navigation => {

    const NAVIGATION: Navigation = [
      {
        kind: 'header',
        title: 'Main items',
      },
      {
        title: 'Dashboard',
        icon: <DashboardIcon />,
      },
      {
        segment: 'patients',
        title: 'Patients',
        icon: <PeopleIcon />,
        pattern: '/patients',
      },
      {
        segment: 'documents',
        title: 'Documents',
        icon: <BackupTableOutlined />,
        pattern: '/cases/documents',
      },
      {
        kind: 'header',
        title: 'Analytics',
      },
      {
        segment: 'adr',
        title: 'ADR Analysis',
        icon: <DescriptionIcon />,
        pattern: '/adr',
      },
      {
        segment: 'notes',
        title: 'RN Notes Analysis',
        icon: <DescriptionIcon />,
        pattern: '/notes',
      },
      
    ];

    if(session?.user.role === 'admin') {
      NAVIGATION.push(
        {
          kind: 'header',
          title: 'Settings',
        },
        {
          segment: 'users',
          title: 'Users',
          icon: <GroupOutlined />,
          pattern: '/users',
        }
      );
    }
    
    return NAVIGATION;
}

export { getNavigation };