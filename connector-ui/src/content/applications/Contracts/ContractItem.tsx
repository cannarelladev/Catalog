import CableIcon from '@mui/icons-material/Cable';
import PolylineIcon from '@mui/icons-material/Polyline';
import {
  alpha,
  Avatar,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { FC, useContext } from 'react';
import { API } from 'src/api/Api';
import topix_logo from 'src/assets/topix_logo.png';
import { SessionContext } from 'src/contexts/SessionContext';
import { Contract, Provider } from 'src/models';
import ContractItemRow from './ContractItemRow';

const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 60px;
    border: 5px solid ${
      theme.palette.mode === 'dark'
        ? theme.colors.alpha.trueWhite[30]
        : alpha(theme.colors.alpha.black[100], 0.07)
    };
    height: ${theme.spacing(7)};
    width: ${theme.spacing(7)};
    background: ${theme.colors.alpha.trueWhite[100]};
  
    img {
      padding: ${theme.spacing(1)};
      display: block;
      width: ${theme.spacing(9)};
    }
`
);

interface IContractItemProps {
  contracts: Contract[];
  selected: Array<string>;
  select: (string) => void;
}

const ContractItem: FC<IContractItemProps> = props => {
  const { contracts, selected, select } = props;
  const { setMessage, setSystemError } = useContext(SessionContext);
  const theme = useTheme();

  const clusterParameters: Provider = {
    clusterName: contracts[0].seller.clusterName,
    clusterID: contracts[0].seller.clusterID,
    token: contracts[0].seller.token,
    endpoint: contracts[0].seller.endpoint,
  };

  const startPeering = async () => {
    console.log('Starting peering');
    try {
      const response = await API.peerWithCluster(clusterParameters, setMessage);
      if (response.ok) {
        console.log('Peering started');
      }
    } catch (error) {
      setSystemError(error);
    }
  };

  return (
    <Grid xs={12} item>
      <Card>
        <Box
          paddingX={3}
          paddingY={1}
          display="flex"
          alignItems="center"
          justifyContent="left"
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'left',
              alignItems: 'center',
              flexGrow: 0,
            }}
          >
            <AvatarWrapper>
              <img
                alt={contracts[0].seller.clusterPrettyName}
                src={topix_logo}
              />
            </AvatarWrapper>
          </Box>
          <Box sx={{ flexGrow: 1, paddingX: 3 }}>
            <Typography variant="h4" gutterBottom>
              {contracts[0].seller.clusterPrettyName}
            </Typography>
            <Typography variant="subtitle2">
              {contracts[0].seller.clusterName}
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 0, gap: 2, display: 'flex' }}>
            <Tooltip
              title='This Service is eligible to be automatically composed with other "Composable Services". on a single network layer.
                    This allows for the creation of complex applications with multiple services, without the need to manage the network infrastructure.
                    Moreover you will access the services through a single endpoint.'
              arrow
              placement="top"
            >
              <Button
                variant="outlined"
                color={'primary'}
                startIcon={<PolylineIcon />}
              >
                Composable Service
              </Button>
            </Tooltip>
            <Button
              variant="contained"
              color="success"
              startIcon={<CableIcon />}
              onClick={() => startPeering()}
            >
              Start Peering
            </Button>
          </Box>
        </Box>
        <Divider />
        <TableContainer>
          <Table>
            <TableHead
              sx={{
                backgroundColor: theme.colors.secondary.lighter,
              }}
            >
              <TableRow>
                <TableCell align="center">Select</TableCell>
                <TableCell>Contract ID</TableCell>
                <TableCell>Offer ID</TableCell>
                <TableCell>Offer Name</TableCell>
                <TableCell align="center">Type</TableCell>
                <TableCell align="center">Plan</TableCell>
                <TableCell align="center">Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contracts.map(contract => {
                return (
                  <ContractItemRow
                    key={contract.contractID}
                    contract={contract}
                    selected={selected.includes(contract.contractID)}
                    select={select}
                  />
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Grid>
  );
};

export default ContractItem;
