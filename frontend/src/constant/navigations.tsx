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
        title: 'Analysis',
      },
      {
        segment: 'analysis/adr',
        title: 'ADR',
        icon: <DescriptionIcon />,
        pattern: 'analysis/adr',
      },
      {
        segment: 'analysis/risk',
        title: 'Risk',
        icon: <DescriptionIcon />,
        pattern: 'analysis/risk',
      },
      {
        segment: 'analysis/notes',
        title: 'RN Notes',
        icon: <DescriptionIcon />,
        pattern: 'analysis/notes',
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