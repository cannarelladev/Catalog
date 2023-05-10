import {
  Box,
  Button,
  Card,
  CardHeader,
  Checkbox,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  useTheme,
} from '@mui/material';
import PropTypes from 'prop-types';
import { ChangeEvent, FC, useState } from 'react';

import { Provider } from 'src/models';
import {
  Offer,
  OfferAvailability,
  OfferStatus,
  OfferType,
} from 'src/models/offer';
import BulkActions from './BulkActions';
import MyCatalogTableRow from './MyCatalogTableRow';

interface CatalogTableProps {
  className?: string;
  catalog: Offer[];
  clusterParameters: Provider;
}

interface Filters {
  status?: OfferStatus;
  offerType?: OfferType;
  availability?: OfferAvailability;
}

const applyFilters = (offers: Offer[], filters: Filters): Offer[] => {
  return offers.filter(offer => {
    let matches = true;

    if (
      (filters.offerType && offer.offerType !== filters.offerType) ||
      (filters.availability && offer.availability !== filters.availability) ||
      (filters.status && String(offer.status) !== filters.status)
    ) {
      matches = false;
    }

    return matches;
  });
};

const applyPagination = (
  offers: Offer[],
  page: number,
  limit: number
): Offer[] => {
  return offers.slice(page * limit, page * limit + limit);
};

const MyCatalogTable: FC<CatalogTableProps> = props => {
  const { catalog: offers, clusterParameters } = props;
  const [selectedOffers, setSelectedOffers] = useState<string[]>([]);
  const selectedBulkActions = selectedOffers.length > 0;
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [filters, setFilters] = useState<Filters>({
    status: null,
    availability: null,
  });

  const availabilityOptions = [
    {
      id: 'all',
      name: 'All',
    },
    {
      id: 'available',
      name: 'Available',
    },
    {
      id: 'limited',
      name: 'Limited stock',
    },
    {
      id: 'finished',
      name: 'Out of stock',
    },
  ];

  const typeOptions = [
    {
      id: 'all',
      name: 'All',
    },
    {
      id: 'storage',
      name: 'Storage',
    },
    {
      id: 'computational',
      name: 'Computational',
    },
    {
      id: 'gpu',
      name: 'Gpu',
    },
  ];

  const statusOptions = [
    {
      id: 'all',
      name: 'All',
    },
    {
      id: 'enabled',
      name: 'Enabled',
    },
    {
      id: 'disabled',
      name: 'Disabled',
    },
  ];

  const handleAvailabilityChange = (e: ChangeEvent<HTMLInputElement>): void => {
    let value = null;

    if (e.target.value !== 'all') {
      value = e.target.value;
    }

    setFilters(prevFilters => ({
      ...prevFilters,
      availability: value,
    }));
  };

  const handleTypeChange = (e: ChangeEvent<HTMLInputElement>): void => {
    let value = null;

    if (e.target.value !== 'all') {
      value = e.target.value;
    }

    setFilters(prevFilters => ({
      ...prevFilters,
      offerType: value,
    }));
  };

  const handleStatusChange = (e: ChangeEvent<HTMLInputElement>): void => {
    let value = null;

    if (e.target.value !== 'all') {
      value = e.target.value;
    }

    setFilters(prevFilters => ({
      ...prevFilters,
      status: value,
    }));
  };

  const handleSelectAllOffers = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setSelectedOffers(
      event.target.checked ? offers.map(offer => offer.offerID) : []
    );
  };

  const handlePageChange = (event: any, newPage: number): void => {
    setPage(newPage);
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setLimit(parseInt(event.target.value));
  };

  const filteredOffers = applyFilters(offers, filters);
  const paginatedOffers = applyPagination(filteredOffers, page, limit);
  const selectedSomeOffers =
    selectedOffers.length > 0 && selectedOffers.length < offers.length;
  const selectedAllOffers = selectedOffers.length === offers.length;
  const theme = useTheme();

  return (
    <Card>
      {selectedBulkActions && (
        <Box flex={1} p={2}>
          <BulkActions />
        </Box>
      )}
      {!selectedBulkActions && (
        <CardHeader
          action={
            <div className="flex gap-2 items-center">
              <Button
                sx={{ px: 2 }}
                variant="contained"
                size="medium"
                color="warning"
                onClick={() => setFilters({})}
              >
                Clear Filters
              </Button>
              <Box width={200}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Offer Type</InputLabel>
                  <Select
                    value={filters.offerType || 'all'}
                    onChange={handleTypeChange}
                    label="Offer Type"
                    autoWidth
                  >
                    {typeOptions.map(type => (
                      <MenuItem key={type.id} value={type.id}>
                        {type.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box width={150}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Availability</InputLabel>
                  <Select
                    value={filters.availability || 'all'}
                    onChange={handleAvailabilityChange}
                    label="Availability"
                    autoWidth
                  >
                    {availabilityOptions.map(availabilityOption => (
                      <MenuItem
                        key={availabilityOption.id}
                        value={availabilityOption.id}
                      >
                        {availabilityOption.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box width={150}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.status || 'all'}
                    onChange={handleStatusChange}
                    label="Status"
                    autoWidth
                  >
                    {statusOptions.map(statusOption => (
                      <MenuItem key={statusOption.id} value={statusOption.id}>
                        {statusOption.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </div>
          }
          title="Available offers"
        />
      )}
      <Divider />
      <TableContainer>
        <Table>
          <TableHead
            sx={{
              backgroundColor: theme.colors.secondary.lighter,
            }}
          >
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={selectedAllOffers}
                  indeterminate={selectedSomeOffers}
                  onChange={handleSelectAllOffers}
                />
              </TableCell>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell align="center">Provider</TableCell>
              <TableCell align="center">Type</TableCell>
              <TableCell align="center">Created</TableCell>
              <TableCell align="center">Availability</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedOffers.map(offer => {
              const isOfferSelected = selectedOffers.includes(offer.offerID);
              return (
                <MyCatalogTableRow
                  key={offer.offerID}
                  offer={offer}
                  isOfferSelected={isOfferSelected}
                  selectedOffers={selectedOffers}
                  setSelectedOffers={setSelectedOffers}
                />
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Box p={2}>
        <TablePagination
          component="div"
          count={filteredOffers.length}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleLimitChange}
          page={page}
          rowsPerPage={limit}
          rowsPerPageOptions={[5, 10, 25, 30]}
        />
      </Box>
    </Card>
  );
};

MyCatalogTable.propTypes = {
  catalog: PropTypes.array.isRequired,
};

MyCatalogTable.defaultProps = {
  catalog: [],
};

export default MyCatalogTable;
