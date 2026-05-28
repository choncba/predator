import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#108ee9',
    },
    background: {
      default: '#fafafa',
    },
    success: {
      main: '#2fbb67',
    },
    error: {
      main: '#f44336',
    },
  },
  typography: {
    fontFamily: '"Bai Jamjuree", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundImage: 'linear-gradient(142deg, #00041a, #00126b)',
        },
      },
    },
  },
});
