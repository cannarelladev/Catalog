import { Card } from '@mui/material';
import { useContext } from 'react';
import { DataContext } from 'src/contexts/DataContext';
import CatalogTable from './CatalogTable';

function AvailableOffers() {
  const { catalog } = useContext(DataContext);

  return (
    <Card>
      <CatalogTable catalog={catalog} />
    </Card>
  );
}

export default AvailableOffers;
