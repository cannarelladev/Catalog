import { Container, Grid } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import Footer from 'src/components/Footer';

import BrokersList from './BrokersList';

function Brokers() {
  return (
    <>
      <Helmet>
        <title>Dashboard - Brokers</title>
      </Helmet>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={4}
          paddingTop={4}
        >
          <Grid item xs={12}>
            <BrokersList />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default Brokers;
