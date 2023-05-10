import PolylineIcon from '@mui/icons-material/Polyline';
import { Box, Button, Grid, Typography } from '@mui/material';
import { useState } from 'react';
import { Contract } from 'src/models';
import { groupContractByProvider } from 'src/utils';
import Compose from './Compose';
import ContractItem from './ContractItem';

interface IContractListProps {
  contracts: Contract[];
  sold: boolean;
}

const ContractsList: React.FC<IContractListProps> = props => {
  const { contracts, sold } = props;
  const groupedContracts = groupContractByProvider(contracts);
  const [composeOpen, setComposeOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<string[]>([]);

  const handleSelect = (contractId: string) => {
    if (selectedContract.includes(contractId)) {
      setSelectedContract(selectedContract.filter(id => id !== contractId));
    } else {
      setSelectedContract([...selectedContract, contractId]);
    }
  };

  return (
    <>
      {composeOpen ? (
        <Compose open={composeOpen} setOpen={setComposeOpen} />
      ) : (
        <></>
      )}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          pb: 3,
        }}
      >
        <Typography variant="h3">
          Your {sold ? 'sold' : 'purchased'} Contracts
        </Typography>
      </Box>
      <Grid rowSpacing={3} container>
        {Object.entries(groupedContracts).map(([key, value]) => {
          return (
            <ContractItem
              key={key}
              contracts={value}
              selected={selectedContract}
              select={handleSelect}
            />
          );
        })}
      </Grid>
      <Box display={'flex'} justifyContent={'center'} mt={3}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<PolylineIcon />}
          onClick={() => setComposeOpen(true)}
          disabled={selectedContract.length === 0}
        >
          Compose Services
        </Button>
      </Box>
    </>
  );
};

export default ContractsList;
