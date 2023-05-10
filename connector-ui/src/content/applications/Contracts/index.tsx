import { Container, Grid } from '@mui/material';
import { useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router';
import Footer from 'src/components/Footer';
import { DataContext } from 'src/contexts/DataContext';
import ContractsList from './ContractsList';
//import { contracts } from 'src/contexts/fakeData';

function Contracts() {
  const { contracts, clusterParameters } = useContext(DataContext);

  const page = useLocation().pathname.split('/')[2];
  const sold = page === 'sold';

  const soldContracts = contracts.filter(
    contract => contract.buyerID !== clusterParameters.clusterID
  );
  const purchasedContracts = contracts.filter(
    contract => contract.buyerID === clusterParameters.clusterID
  );

  return (
    <>
      <Helmet>
        <title>Dashboard - Contracts</title>
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
            <ContractsList
              contracts={sold ? soldContracts : purchasedContracts}
              sold={sold}
            />
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default Contracts;
