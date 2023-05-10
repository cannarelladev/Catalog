import { Container, Grid } from '@mui/material';
import { FC, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router';
import Footer from 'src/components/Footer';
import { DataContext } from 'src/contexts/DataContext';
import { Offer } from 'src/models/offer';
import { getOfferByID } from 'src/utils';
import Plans from './Plans';
import Summary from './Summary';

interface OfferProps {
  offer: Offer;
}

const OfferDetails: FC<OfferProps> = props => {
  const { catalog } = useContext(DataContext);

  const { id: offerID } = useParams();

  const offer = getOfferByID(catalog, offerID);

  return (
    <>
      <Helmet>
        <title>Dashboard - Offer details</title>
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
          {offer ? (
            <>
              <Grid item xs={12}>
                <Summary offer={offer} />
              </Grid>
              <Grid item xs={12}>
                <Plans offerID={offer.offerID} plans={offer.plans} />
              </Grid>
            </>
          ) : (
            <div></div>
          )}
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

export default OfferDetails;
