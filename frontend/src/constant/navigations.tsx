import type { Navigation } from '@toolpad/core/AppProvider';
import { 
  Dashboard as DashboardIcon,
  FileUploadOutlined as FileUploadOutlinedIcon,
  Description as DescriptionIcon,
  People as PeopleIcon
} from '@mui/icons-material';

const getNavigation = (): Navigation => {

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
        kind: 'header',
        title: 'Analytics',
      },
      {
        segment: 'cases',
        title: 'Quality Cases',
        icon: <DescriptionIcon />,
        pattern: '/cases',
      },
      {
        segment: 'cases/documents',
        title: 'Documents',
        icon: <FileUploadOutlinedIcon />,
        pattern: '/cases/documents',
      },
    ];
    
    return NAVIGATION;
}

export { getNavigation };