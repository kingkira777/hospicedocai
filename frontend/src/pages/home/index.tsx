import * as React from 'react';
import { AppProvider, type Navigation } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { Box, Typography, Container, createTheme, Stack, Button } from '@mui/material';
import HomeSection from '../../components/home/homeSection';
import SolutionsSection from '../../components/home/SolutionSection';
import ResourcesSection from '../../components/home/ResourcesSection';
import CompanySection from '../../components/home/CompanySection';
import RequestDemoSection from '../../components/home/RequestDemoSection';


// 1. Define the Navigation (This controls the mobile drawer)
const NAVIGATION: Navigation = [
  { segment: 'solutions', title: 'Solutions' },
  { segment: 'resources', title: 'Resources' },
  { segment: 'company', title: 'Company' }
];

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#4480FF' },
  },
});

// Helper for smooth scrolling
const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

// 2. Custom Desktop Menu (Visible on larger screens)
function DesktopMenu() {
  return (
    <Stack 
      direction="row" 
      spacing={3} 
      sx={{ display: { xs: 'none', md: 'flex' }, mr: 10 }}
    >
      {NAVIGATION.map((item:any) => (
        <Button 
          key={item.segment} 
          onClick={() => scrollToSection(item.segment as string)}
          sx={{ color: 'text.primary', fontWeight: 600, textTransform: 'none' }}
        >
          {item.title}
        </Button>
      ))}
    </Stack>
  );
}

// 3. Right-side Actions (Sign In / Request Demo)
function HeaderActions() {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Button  
        onClick={() => {
          navigation.navigate('/sign-in');
        }}
        sx={{ color: 'black', fontWeight: 'bold' }}>SIGN IN</Button>
      <Button 
      onClick={() => {
        scrollToSection('requestDemo');
      }}
      variant="contained" sx={{ borderRadius: 2, px: 3 }}>
        Request Demo
      </Button>
    </Stack>
  );
}

// 2. Component for each section
const Section = ({ id, title, color, children }: { id: string; title: string; color: string, children?: React.ReactNode }) => (
  <Box
    id={id}
    sx={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: color,
      borderBottom: '1px solid #eee',
    }}
  >
    {children}
  </Box>
);

export default function HomeClientPage() {const [pathname, setPathname] = React.useState('/solution');

  // 3. Handle Smooth Scroll when pathname changes
  React.useEffect(() => {
    const id = pathname.replace('/', '');
    const element = document.getElementById(id);
     if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, [pathname]);

    const router = React.useMemo(() => ({
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path: string | URL) => setPathname(String(path)),
    }), [pathname]);
    

  return (    
       <AppProvider
        router={router}
        theme={theme}
        branding={{ title: '', logo: (
          <Button onClick={() => {
            scrollToSection('home')
          }} sx={{ color: 'black', fontWeight: 'bold' }}>
            <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
              HOSPICEIQ
            </Typography>
          </Button>
        )}}
      >
        {/* 'hideNavigation' removes the sidebar for a landing page feel */}
        <DashboardLayout 
          hideNavigation
          slots={{
            toolbarActions: () => (
            <Stack direction="row" alignItems="center" flexGrow={1} justifyContent="flex-end">
               <DesktopMenu />
               <HeaderActions />
            </Stack>
          ),
          }}
        >
          <Box sx={{ pt: 2 }}>
            <Section id="home" title="Home" color="#f0f7ff"
              children={<HomeSection />}
            />
            <Section id="solutions" title="Solution" color="#f0f7ff" 
              children={<SolutionsSection />}
            />
            <Section id="resources" title="Resources" color="#ffffff" 
              children={<ResourcesSection />}
            />
            <Section id="company" title="Company" color="#f9f9f9"
              children={<CompanySection />}
            />
            <Section id="requestDemo" title="Request Demo" color="#f9f9f9"
              children={<RequestDemoSection />}
            />
          </Box>
        </DashboardLayout>
      </AppProvider>
  );
}
