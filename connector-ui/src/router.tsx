import { Suspense, lazy, useContext, useEffect, useState } from 'react';
import { RouteObject } from 'react-router';
import { Navigate } from 'react-router-dom';

import BaseLayout from 'src/layouts/BaseLayout';
import SidebarLayout from 'src/layouts/SidebarLayout';

import { Backdrop, CircularProgress } from '@mui/material';
import SuspenseLoader from 'src/components/SuspenseLoader';
import InitCatalog from './content/dashboards/InitCatalog';
import { DataContext } from './contexts/DataContext';
import { SessionContext } from './contexts/SessionContext';

const Loader = Component => props => {
  const { initDashboard } = useContext(SessionContext);
  const { dirtyData } = useContext(DataContext);
  const [init, setInit] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (initDashboard) {
      setInit(true);
    }
  }, [initDashboard]);

  useEffect(() => {
    setDirty(dirtyData);
  }, [dirtyData]);

  return (
    <>
      {!init ? (
        <InitCatalog />
      ) : (
        <Suspense fallback={<SuspenseLoader />}>
          {dirty ? (
            <Backdrop
              sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }}
              open={dirty}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          ) : (
            <Component {...props} />
          )}
        </Suspense>
      )}
    </>
  );
};
// Pages

// Dashboards

const Overview = Loader(lazy(() => import('src/content/dashboards/Overview')));

const Catalog = Loader(lazy(() => import('src/content/dashboards/Catalog')));

const Offer = Loader(lazy(() => import('src/content/dashboards/Offer')));

const Debug = Loader(lazy(() => import('src/content/dashboards/Debug')));

// Applications

const Brokers = Loader(lazy(() => import('src/content/applications/Brokers')));

const MyCatalog = Loader(
  lazy(() => import('src/content/applications/MyCatalog'))
);

const Contracts = Loader(
  lazy(() => import('src/content/applications/Contracts'))
);

const MyOffer = Loader(lazy(() => import('src/content/applications/MyOffer')));

// Status

const Status404 = Loader(
  lazy(() => import('src/content/pages/Status/Status404'))
);
const Status500 = Loader(
  lazy(() => import('src/content/pages/Status/Status500'))
);
const StatusComingSoon = Loader(
  lazy(() => import('src/content/pages/Status/ComingSoon'))
);
const StatusMaintenance = Loader(
  lazy(() => import('src/content/pages/Status/Maintenance'))
);

const routes: RouteObject[] = [
  {
    path: '',
    element: <SidebarLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="dashboards" replace />,
      },
      {
        path: 'dashboards',
        children: [
          {
            path: '',
            element: <Navigate to="overview" replace />,
          },
          {
            path: 'overview',
            element: <Overview />,
          },
          {
            path: 'catalog',
            element: <Catalog />,
          },
          {
            path: 'offer/:id',
            element: <Offer />,
          },
          {
            path: 'debug',
            element: <Debug />,
          },
        ],
      },
      {
        path: '*',
        element: <Status404 />,
      },
    ],
  },
  {
    path: 'contracts',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="purchased" replace />,
      },
      {
        path: 'purchased',
        element: <Contracts />,
      },
      {
        path: 'sold',
        element: <Contracts />,
      },
    ],
  },
  {
    path: 'management',
    element: <SidebarLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="transactions" replace />,
      },
      {
        path: 'brokers',
        element: <Brokers />,
      },
      {
        path: 'mycatalog',
        element: <MyCatalog />,
      },
      {
        path: 'myoffer',
        children: [
          {
            path: '',
            element: <Navigate to="status" replace />,
          },
          { path: 'create', element: <MyOffer create /> },
          { path: 'preview/:id', element: <MyOffer create={false} /> },
        ],
      },
    ],
  },
  {
    path: 'status',
    element: <BaseLayout />,
    children: [
      {
        path: '',
        element: <Navigate to="404" replace />,
      },
      {
        path: '404',
        element: <Status404 />,
      },
      {
        path: '500',
        element: <Status500 />,
      },
      {
        path: 'maintenance',
        element: <StatusMaintenance />,
      },
      {
        path: 'coming-soon',
        element: <StatusComingSoon />,
      },
    ],
  },
];

export default routes;
