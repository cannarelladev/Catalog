import {
  Button,
  Card,
  Grid,
  Box,
  CardContent,
  Typography,
  Avatar,
  alpha,
  Tooltip,
  CardActionArea,
  styled,
  ListItemAvatar,
  ListItem,
  Divider,
  Switch,
  ListItemText,
} from '@mui/material';
import Text from 'src/components/Text';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import BrokerItem from './BrokerItem';
import BrokerNew from './BrokerNew';
import { SessionContext } from 'src/contexts/SessionContext';
import { useContext } from 'react';
import { DataContext } from 'src/contexts/DataContext';

function BrokersList() {
  const { brokers } = useContext(DataContext);
  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          pb: 3,
        }}
      >
        <Typography variant="h3">Registered Brokers</Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<AddTwoToneIcon fontSize="small" />}
        >
          Add new Cluster
        </Button>
      </Box>
      <Grid container spacing={3}>
        {brokers.map(broker => (
          <BrokerItem key={broker.brokerID} broker={broker} />
        ))}
        <BrokerNew />
      </Grid>
    </>
  );
}

export default BrokersList;
