import CloudOffIcon from '@mui/icons-material/CloudOff';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import {
  alpha,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  ListItem,
  ListItemAvatar,
  ListItemText,
  styled,
  Switch,
  Typography,
} from '@mui/material';
import { FC, useContext, useState } from 'react';
import { API } from 'src/api/Api';
import topix_logo from 'src/assets/topix_logo.png';
import Text from 'src/components/Text';
import { DataContext } from 'src/contexts/DataContext';
import { SessionContext } from 'src/contexts/SessionContext';
import Broker from 'src/models/broker';

const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
    margin: ${theme.spacing(2, 0, 1, -0.5)};
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${theme.spacing(0.5)};
    border-radius: 60px;
    border: 5px solid ${
      theme.palette.mode === 'dark'
        ? theme.colors.alpha.trueWhite[30]
        : alpha(theme.colors.alpha.black[100], 0.07)
    };
    height: ${theme.spacing(12)};
    width: ${theme.spacing(12)};
    background: ${theme.colors.alpha.trueWhite[100]};
  
    img {
      padding: ${theme.spacing(1)};
      display: block;
      width: ${theme.spacing(9)};
    }
`
);

const AvatarWrapperSuccess = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.success.lighter};
      color:  ${theme.colors.success.main};
`
);

const AvatarWrapperError = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.error.lighter};
      color:  ${theme.colors.error.main};
`
);

interface IBrokerItemProps {
  broker: Broker;
}

const BrokerItem: FC<IBrokerItemProps> = props => {
  const { broker } = props;
  const { setDirtyData: setDirty } = useContext(DataContext);
  const { setMessage, setSystemError } = useContext(SessionContext);
  const [subscribed, setSubscribed] = useState(broker.subscribed);

  const handleToggle = () => {
    setSubscribed(old => !old);
  };

  const deleteBroker = async () => {
    try {
      const response = await API.deleteBroker(broker.brokerID, setMessage);
      setDirty();
    } catch (error) {
      setSystemError(error);
    }
  };

  return (
    <Grid xs={12} sm={6} md={4} item>
      <Card
        sx={{
          px: 1,
        }}
      >
        <CardContent
          sx={{
            textAlign: 'center',
          }}
        >
          <Box
            sx={{
              px: 10,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <AvatarWrapper>
              <img alt="TOP-IX Broker" src={topix_logo} />
            </AvatarWrapper>
          </Box>

          <Typography variant="h5" noWrap>
            {broker.brokerName}
          </Typography>
          <Typography variant="subtitle1" noWrap>
            IT (fake)
          </Typography>
          {/* <Box
            sx={{
              pt: 3,
            }}
          >
            <Typography variant="subtitle2" noWrap>
              Status
            </Typography>
            <Typography variant="h3" gutterBottom noWrap>
              <Text color="success">ACTIVE</Text>
            </Typography>
          </Box> */}
        </CardContent>
        <Divider />
        <ListItem
          sx={{
            py: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'left',
              alignItems: 'center',
            }}
          >
            <Typography variant="h5" noWrap>
              Hostname:
            </Typography>
            <Typography sx={{ ml: 1 }} variant="subtitle1" noWrap>
              {broker.brokerEndpoint}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'left',
              alignItems: 'center',
            }}
          >
            <Typography variant="h5" noWrap>
              IP:
            </Typography>
            <Typography sx={{ ml: 1 }} variant="subtitle1" noWrap>
              194.26.32.4 (fake)
            </Typography>
          </Box>
        </ListItem>
        <Divider />
        <ListItem
          sx={{
            py: 2,
          }}
        >
          <ListItemAvatar>
            {subscribed ? (
              <AvatarWrapperSuccess>
                <CloudSyncIcon />
              </AvatarWrapperSuccess>
            ) : (
              <AvatarWrapperError>
                <CloudOffIcon />
              </AvatarWrapperError>
            )}
          </ListItemAvatar>
          <ListItemText
            primary={<Text color="black">Subscription</Text>}
            primaryTypographyProps={{
              variant: 'body1',
              fontWeight: 'bold',
              color: 'textPrimary',
              gutterBottom: true,
              noWrap: true,
            }}
            secondary={
              <Text color={broker.subscribed ? 'success' : 'error'}>
                {broker.subscribed ? 'Enabled' : 'Disabled'}
              </Text>
            }
            secondaryTypographyProps={{ variant: 'body2', noWrap: true }}
          />
          <Switch
            edge="end"
            color="primary"
            onChange={handleToggle}
            checked={subscribed}
          />
        </ListItem>
        <Divider />
        <ListItem
          sx={{
            py: 1,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Button
            sx={{ margin: 1, px: 5 }}
            variant="outlined"
            size="medium"
            color="error"
            onClick={deleteBroker}
          >
            Remove
          </Button>
        </ListItem>
      </Card>
    </Grid>
  );
};

export default BrokerItem;
