import { useRoutes } from 'react-router-dom';
import router from 'src/router';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import { CssBaseline } from '@mui/material';
import { useContext } from 'react';
import DataContextProvider from './contexts/DataContext';
import SessionContextProvider, {
  SessionContext,
} from './contexts/SessionContext';
import ThemeProvider from './theme/ThemeProvider';

function App() {
  const content = useRoutes(router);

  return (
    <ThemeProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <SessionContextProvider>
          <DataContextProvider>
            <CssBaseline />
            {content}
          </DataContextProvider>
        </SessionContextProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
export default App;
