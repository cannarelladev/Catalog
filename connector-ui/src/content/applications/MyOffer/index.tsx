import { Container, Grid } from '@mui/material';
import { FC, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router';
import Footer from 'src/components/Footer';
import { DataContext } from 'src/contexts/DataContext';
import { getOfferByID } from 'src/utils';
import MyOfferWrapper from './MyOfferWrapper';

export type pageMode = 'edit' | 'view' | 'create';

interface OfferProps {
  create: boolean;
}

const MyOffer: FC<OfferProps> = ({ create }) => {
  const { myOffers } = useContext(DataContext);

  const { id: offerID } = useParams();

  const offer = getOfferByID(myOffers, offerID);

  return (
    <>
      <Helmet>
        <title>Dashboard - My Offer</title>
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
          <MyOfferWrapper offer={offer} create={create} />
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

export default MyOffer;
