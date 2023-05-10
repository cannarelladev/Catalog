import { Card } from '@mui/material';
import { useContext } from 'react';
import { DataContext } from 'src/contexts/DataContext';
import MyCatalogTable from './MyCatalogTable';

function MyCatalog() {
  const { myOffers, clusterParameters } = useContext(DataContext);

  return (
    <Card>
      <MyCatalogTable
        catalog={myOffers}
        clusterParameters={clusterParameters}
      />
    </Card>
  );
}

export default MyCatalog;
