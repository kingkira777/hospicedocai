
  "use client";
  import { createTheme } from '@mui/material/styles';

  const theme = createTheme({
    cssVariables: {
      colorSchemeSelector: 'data-toolpad-color-scheme',
    },
    colorSchemes: { light: true, dark: true },
    components: {
      // 1. Target the Top Navbar Container
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: 'rgba(61, 106, 252, 1)', // Dark midnight blue
            color: '#e9ebf2',           // Off-white text
            boxShadow: 'none',          // Optional: removes the shadow for a flat look
          },
        },
      },
      // Target the specific Typography used for the App Title
      MuiTypography: {
        styleOverrides: {
          root: {
            // This ensures any text in the header turns white
            '&.MuiTypography-h6': { 
              color: '#ffffff',
              fontWeight: 700,
            },
          },
        },
      },
      // 2. Target the Toolbar (the inner part of the header)
      MuiToolbar: {
        styleOverrides: {
          root: {
            // This ensures the area behind the "Hospice Documents" text is colored
            backgroundColor: 'inherit', 
          },
        },
      },
      // 3. Optional: Change the color of the icons (Menu toggle, Dark mode moon, etc.)
      MuiIconButton: {
        styleOverrides: {
          root: {
            // 1. Force the color of the button and its SVG icon to white
            color: '#ffffff !important', 
            
            '& svg': {
              fill: '#ffffff !important', // Ensures the actual icon shape is white
            },

            // 2. Adjust hover so it doesn't look weird on blue
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.12)', 
            },
          },
        },
      },

      // 1. Target the Sidebar Container
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: 'rgba(0, 60, 255, 0.7)', // Dark midnight blue
            color: '#e9ebf2',           // Off-white text
            width: 240,
            // top: 65,                    // Align with the top of the viewport
            // height: '94vh',           // Full viewport height
            boxShadow: 'none', 
            borderRight: 'none',         // Optional: removes the shadow for a flat look
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)', // Optional: subtle separator
          },
        },
      },
      MuiListSubheader: {
        styleOverrides: {
          root: {
            // 1. Make the background match the sidebar
            backgroundColor: 'transparent', 
            
            // 2. Change the text color so it's readable on dark
            color: 'rgba(255, 255, 255, 0.7)', 
            
            // 3. Optional: Adjust font weight or spacing
            fontWeight: 700,
            lineHeight: '48px', // Matches standard MUI sidebar item height
          },
        },
      },
      // 2. Target the Navigation Items (Hover/Active states)
      MuiListItemButton: {
        styleOverrides: {
          root: {// 1. Standard (Unselected) Text Color
            transition: 'background-color 0.3s ease, color 0.3s ease',
            color: 'rgba(255, 255, 255, 0.8)',
              '&.Mui-selected': {
                // 2. Selected Text Color
                backgroundColor: 'rgba(0, 255, 255, 0.16)', // Subtle highlight
                // Force the Typography (label) color
              '& .MuiListItemText-root .MuiTypography-root': {
                color: '#ffffff !important', // Your bright active text color
                fontWeight: 600,  // Optional: make it bold when active
              },
              '&:hover': {
                backgroundColor: 'rgba(0, 255, 255, 0.24)',
              },
              
              // 1. Target the Icon container AND the SVG inside it
              '& .MuiListItemIcon-root, & .MuiListItemIcon-root svg': {
                color: '#ffffff !important', // Force white
                fill: '#ffffff !important',  // Ensure SVG fill is also white
              },


            
            },
          }
        },
      },
      // 3. Target the Icons specifically
      MuiListItemIcon: {
        styleOverrides: {
          root: {// This ensures the logo/title area matches
            transition: 'color 0.3s ease',
            color: 'rgba(255, 255, 255, 0.5)',
          },
        },
      },

        // Sometimes Toolpad uses specific SVG overrides, so let's be safe:
      MuiSvgIcon: {
        styleOverrides: {
          root: {
            // This targets icons that might be floating outside an IconButton
            // inside the AppBar specifically.
            '.MuiAppBar-root &': {
              color: '#ffffff !important',
            },
          },
        },
      },
    },
  });

  export default theme;
  