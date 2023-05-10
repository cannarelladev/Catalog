import { Container, Grid } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import PageHeader from './PageHeader';

import ClusterDetails from './ClusterDetails';
import Peerings from './Peerings';

function Overview() {
  return (
    <>
      <Helmet>
        <title>Dashboard - Overview</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={4}
        >
          <Grid item xs={12}>
            <ClusterDetails />
          </Grid>
          <Grid item xs={12}>
            <Peerings />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default Overview;
