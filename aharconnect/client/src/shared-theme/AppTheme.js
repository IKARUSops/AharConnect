import * as React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { inputsCustomizations } from './customizations/inputs';
import { dataDisplayCustomizations } from './customizations/dataDisplay';
import { feedbackCustomizations } from './customizations/feedback';
import { navigationCustomizations } from './customizations/navigation';
import { surfacesCustomizations } from './customizations/surfaces';
import { colorSchemes, typography, shadows, shape } from './themePrimitives';

function AppTheme(props) {
  const { children, disableCustomTheme, themeComponents } = props;
  const theme = React.useMemo(() => {
    return disableCustomTheme
      ? {}
      : createTheme({
          cssVariables: {
            colorSchemeSelector: 'data-mui-color-scheme',
            cssVarPrefix: 'template',
          },
          colorSchemes: {
            light: {
              palette: {
                primary: {
                  main: '#28104E',
                  contrastText: '#FFFFFF',
                },
                secondary: {
                  main: '#6237A0',
                  contrastText: '#FFFFFF',
                },
                accent: {
                  main: '#9754CB',
                  light: '#DEACFS',
                },
                background: {
                  default: '#F5F5F7',
                  paper: '#FFFFFF',
                },
                text: {
                  primary: '#28104E',
                  secondary: '#6237A0',
                },
              },
            },
            dark: {
              palette: {
                primary: {
                  main: '#9754CB',
                  contrastText: '#FFFFFF',
                },
                secondary: {
                  main: '#6237A0',
                  contrastText: '#FFFFFF',
                },
                accent: {
                  main: '#DEACFS',
                  light: '#28104E',
                },
                background: {
                  default: '#1A1A1A',
                  paper: '#2D2D2D',
                },
                text: {
                  primary: '#FFFFFF',
                  secondary: '#DEACFS',
                },
              },
            },
          },
          typography,
          shadows,
          shape: {
            borderRadius: 12,
          },
          components: {
            ...inputsCustomizations,
            ...dataDisplayCustomizations,
            ...feedbackCustomizations,
            ...navigationCustomizations,
            ...surfacesCustomizations,
            ...themeComponents,
            MuiButton: {
              styleOverrides: {
                root: {
                  borderRadius: 8,
                  textTransform: 'none',
                  fontWeight: 600,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  },
                },
                contained: {
                  backgroundColor: '#6237A0',
                  color: '#FFFFFF',
                  '&:hover': {
                    backgroundColor: '#9754CB',
                  },
                },
                outlined: {
                  borderColor: '#6237A0',
                  color: '#6237A0',
                  '&:hover': {
                    borderColor: '#9754CB',
                    color: '#9754CB',
                  },
                },
              },
            },
            MuiCard: {
              styleOverrides: {
                root: {
                  borderRadius: 12,
                  transition: 'transform 0.2s ease-in-out',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                },
              },
            },
            MuiCardContent: {
              styleOverrides: {
                root: {
                  padding: '24px',
                  flex: 1,
                },
              },
            },
            MuiTextField: {
              styleOverrides: {
                root: {
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 8,
                    '&:hover fieldset': {
                      borderColor: '#9754CB',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#6237A0',
                    },
                  },
                },
              },
            },
            MuiChip: {
              styleOverrides: {
                root: {
                  borderRadius: 16,
                  fontWeight: 500,
                  '&.MuiChip-filled': {
                    backgroundColor: '#9754CB',
                    color: '#FFFFFF',
                    '&:hover': {
                      backgroundColor: '#6237A0',
                    },
                  },
                  '&.MuiChip-outlined': {
                    borderColor: '#9754CB',
                    color: '#6237A0',
                  },
                },
              },
            },
            MuiPaper: {
              styleOverrides: {
                root: {
                  borderRadius: 12,
                },
              },
            },
            MuiContainer: {
              styleOverrides: {
                root: {
                  borderRadius: 12,
                },
              },
            },
            MuiGrid: {
              styleOverrides: {
                root: {
                  '&.MuiGrid-container': {
                    gap: 24,
                  },
                },
              },
            },
          },
        });
  }, [disableCustomTheme, themeComponents]);
  if (disableCustomTheme) {
    return <React.Fragment>{children}</React.Fragment>;
  }
  return (
    <ThemeProvider theme={theme} disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}

AppTheme.propTypes = {
  children: PropTypes.node,
  /**
   * This is for the docs site. You can ignore it or remove it.
   */
  disableCustomTheme: PropTypes.bool,
  themeComponents: PropTypes.object,
};

export default AppTheme;
