import {
  Alert,
  AlertTitle,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  ListItem,
  ListItemText,
  styled,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { Box } from '@mui/system';
import { FC, useContext, useState } from 'react';
import { API } from 'src/api/Api';
import Text from 'src/components/Text';
import { SessionContext } from 'src/contexts/SessionContext';

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

interface IInitCatalogProps {}

const InitCatalog: FC<IInitCatalogProps> = () => {
  const { setDirty, setMessage } = useContext(SessionContext);
  const theme = useTheme();
  const [prettyName, setPrettyName] = useState('');
  const [endopoint, setEndpoint] = useState('');
  const [error, setError] = useState('');

  const disabled = prettyName === '' || endopoint === '';

  const initCatalog = async () => {
    try {
      if (!disabled) {
        const response = await API.initCluster(
          prettyName,
          endopoint,
          setMessage
        );
        if (response) {
          setDirty(true);
        }
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const clear = () => {
    setPrettyName('');
    setEndpoint('');
    setError('');
  };

  return (
    <Grid margin={5} xs={12} sm={6} md={4} item>
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
          <ListItem>
            <ListItemText
              primary={<Text color="primary">Catalog Initialization</Text>}
              primaryTypographyProps={{
                fontSize: theme.typography.pxToRem(24),
                fontWeight: theme.typography.fontWeightBold,
                align: 'center',
              }}
            />
          </ListItem>
          <ListItem>
            <ListItemText
              primary={
                <Text color="secondary">
                  Before starting to use the catalog, you must configure it with
                  some basic information.
                  <br />
                  After that, you will be able to add your first broker,
                  download its catalog and/or create your own.
                </Text>
              }
              primaryTypographyProps={{ fontSize: 'medium', align: 'center' }}
            />
          </ListItem>
          {error && (
            <ListItem>
              <Alert
                severity="error"
                sx={{
                  width: '100%',
                }}
              >
                <AlertTitle>Error</AlertTitle>
                {error}
              </Alert>
            </ListItem>
          )}
          <ListItem
            sx={{
              py: 2,
              display: 'flex',
              flexDirection: 'column',
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
              label="Provider Pretty Name"
              placeholder="Insert here your Provider Pretty Name"
              required
              value={prettyName}
              onChange={e => setPrettyName(e.target.value)}
            />
            <ListItemText
              primary={
                <Text color="secondary">
                  This name will be used to identify your provider in the
                  catalog. In this way each your offer will be associated to
                  this name
                </Text>
              }
              primaryTypographyProps={{ fontSize: 'medium' }}
            />
          </ListItem>
          <ListItem
            sx={{
              py: 2,
              display: 'flex',
              flexDirection: 'column',
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
              label="Store Endpoint"
              placeholder="https://store.example.com"
              value={endopoint}
              onChange={e => setEndpoint(e.target.value)}
            />
            <ListItemText
              primary={
                <Text color="secondary">
                  This represents the endpoint of your store. It will be used to
                  receive purchase requests from other providers or customers.
                  It could be an IP address or a domain name.
                </Text>
              }
              primaryTypographyProps={{ fontSize: 'medium' }}
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
              onClick={() => clear()}
            >
              Clear
            </Button>
            <Button
              disabled={disabled}
              sx={{ margin: 1, px: 5 }}
              variant="contained"
              size="medium"
              color="primary"
              onClick={initCatalog}
            >
              Init Catalog
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
    </Grid>
  );
};

export default InitCatalog;
