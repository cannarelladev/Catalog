import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import {
  Avatar,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  Grid,
  ListItem,
  ListItemAvatar,
  ListItemText,
  styled,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { FC, useContext, useState } from 'react';
import { API } from 'src/api/Api';
import Text from 'src/components/Text';
import { DataContext } from 'src/contexts/DataContext';
import { SessionContext } from 'src/contexts/SessionContext';
import Broker from 'src/models/broker';

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

const AvatarAddWrapper = styled(Avatar)(
  ({ theme }) => `
        background: ${theme.colors.alpha.black[10]};
        color: ${theme.colors.primary.main};
        width: ${theme.spacing(8)};
        height: ${theme.spacing(8)};
        margin: ${theme.spacing(18.6, 0, 18.6, 0)};
`
);

const CardAddAction = styled(Card)(
  ({ theme }) => `
        border: ${theme.colors.primary.main} solid 1px;
        height: 100%;
        color: ${theme.colors.primary.main};
        transition: ${theme.transitions.create(['all'])};
        
        .MuiCardActionArea-root {
          height: 100%;
          justify-content: center;
          align-items: center;
          display: flex;
        }
        
        .MuiTouchRipple-root {
          opacity: .2;
        }
        
        &:hover {
          border-color: ${theme.colors.alpha.black[70]};
        }
`
);

const CardAddActionStarted = styled(Card)(
  ({ theme }) => `
        background: ${theme.colors.alpha.black[5]};
        border: ${theme.colors.primary.main} solid 1px;
        height: 100%;
        color: ${theme.colors.primary.main};
        
        .MuiCardActionArea-root {
          height: 100%;
          justify-content: center;
          align-items: center;
          display: flex;
        }
`
);

interface IBrokerNewProps {}

const BrokerNew: FC<IBrokerNewProps> = () => {
  const { setMessage, setSystemError } = useContext(SessionContext);
  const { setDirtyData: setDirty } = useContext(DataContext);
  const [filling, setFilling] = useState(false);
  const [subscribed, setSubscribed] = useState(true);
  const [name, setName] = useState('');
  const [path, setPath] = useState('');

  const handleToggle = () => {
    setSubscribed(old => !old);
  };

  const insertBroker = async () => {
    try {
      if (name !== '' && path !== '') {
        let broker = {
          brokerName: name,
          brokerEndpoint: path,
          subscribed: subscribed,
        } as Broker;
        await API.insertBroker(broker, setMessage);
        //broker.brokerID = response.brokerID;
        setFilling(false);
        setDirty();
      }
    } catch (error) {
      setSystemError(error);
    }
  };

  const clear = () => {
    setName('');
    setPath('');
    setSubscribed(true);
  };

  return (
    <Grid xs={12} sm={6} md={4} item>
      {!filling ? (
        <Tooltip arrow title="Click to add a new Peering">
          <CardAddAction>
            <CardActionArea
              sx={{
                px: 1,
              }}
            >
              <CardContent>
                <AvatarAddWrapper>
                  <AddTwoToneIcon
                    fontSize="large"
                    onClick={() => setFilling(true)}
                  />
                </AvatarAddWrapper>
              </CardContent>
            </CardActionArea>
          </CardAddAction>
        </Tooltip>
      ) : (
        <CardAddActionStarted>
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <ListItem
              sx={{
                py: 2,
              }}
            >
              <TextField
                sx={{
                  backgroundColor: 'white',
                  borderRadius: '10px',
                  width: '100%',
                }}
                color="primary"
                focused
                id="outlined-required"
                label="Name"
                placeholder="Insert here a broker name"
                required
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </ListItem>
            <ListItem
              sx={{
                py: 2,
              }}
            >
              <TextField
                sx={{
                  backgroundColor: 'white',
                  borderRadius: '10px',
                  width: '100%',
                }}
                color="primary"
                focused
                required
                id="outlined-required"
                label="Hostname or IP"
                placeholder="https://broker.example.com"
                value={path}
                onChange={e => setPath(e.target.value)}
              />
            </ListItem>

            <ListItem
              // TODO: when removing alert this has to become py: 2
              sx={{
                pt: 2,
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
                primary={<Text color="black">Subscribe on Add</Text>}
                primaryTypographyProps={{
                  variant: 'body1',
                  fontWeight: 'bold',
                  color: 'textPrimary',
                  gutterBottom: true,
                  noWrap: true,
                }}
                secondary={
                  <Text color={subscribed ? 'success' : 'error'}>
                    {subscribed ? 'Enabled' : 'Disabled'}
                  </Text>
                }
                secondaryTypographyProps={{ variant: 'body2', noWrap: true }}
              />
              <Switch
                edge="end"
                color="primary"
                onChange={handleToggle}
                checked={subscribed}
                disabled
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={
                  <Text color="error">
                    This feature is not fully supported yet! At the moment you
                    can Unsubscribe only when a broker is already added
                  </Text>
                }
                primaryTypographyProps={{ fontSize: 'smaller' }}
              />
            </ListItem>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Button
                sx={{ margin: 1, px: 5 }}
                variant="outlined"
                size="medium"
                color="warning"
                onClick={() => setFilling(false)}
              >
                Cancel
              </Button>
              <Button
                sx={{ margin: 1, px: 5 }}
                variant="contained"
                size="medium"
                color="primary"
                onClick={insertBroker}
              >
                Add
              </Button>
            </Box>
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
                  * Required
                </Typography>
              </Box>
            </ListItem>
          </CardContent>
        </CardAddActionStarted>
      )}
    </Grid>
  );
};

export default BrokerNew;
