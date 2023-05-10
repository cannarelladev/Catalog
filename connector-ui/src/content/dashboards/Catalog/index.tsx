import { Container, Grid } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import PageHeader from './PageHeader';

import AvailableOffers from './Catalog';

function Catalog() {
  return (
    <>
      <Helmet>
        <title>Dashboard - Catalog</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
      <Container maxWidth={false}>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <AvailableOffers />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default Catalog;
