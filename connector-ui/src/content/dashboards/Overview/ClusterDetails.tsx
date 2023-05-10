import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import TrendingUp from '@mui/icons-material/TrendingUp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  alpha,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  Divider,
  Grid,
  ListItemAvatar,
  styled,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { API } from 'src/api/Api';
import Text from 'src/components/Text';
import { DataContext } from 'src/contexts/DataContext';
import { SessionContext } from 'src/contexts/SessionContext';

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.success.main};
      color: ${theme.palette.success.contrastText};
      width: ${theme.spacing(8)};
      height: ${theme.spacing(8)};
      box-shadow: ${theme.colors.shadows.success};
`
);

function ClusterDetails() {
  const { setMessage, setSystemError } = useContext(SessionContext);
  const {
    clusterParameters,
    clusterPrettyName,
    contractEndpoint,
    setDirtyData: setDirty,
  } = useContext(DataContext);
  const [edit, setEdit] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [providerPrettyName, setProviderPrettyName] = useState('');
  const [providerContractEndpoint, setProviderContractEndpoint] = useState('');

  useEffect(() => {
    setProviderPrettyName(clusterPrettyName);
    setProviderContractEndpoint(contractEndpoint);
  }, [clusterPrettyName, contractEndpoint]);

  const updateInfo = async () => {
    let change = false;
    if (providerPrettyName !== clusterPrettyName) {
      try {
        const result = await API.setClusterPrettyName(
          providerPrettyName,
          setMessage
        );
        if (result) {
          change = true;
        }
      } catch (e) {
        setSystemError(e);
      }
    }
    if (providerContractEndpoint !== contractEndpoint) {
      try {
        const result = await API.setContractEndpoint(
          providerContractEndpoint,
          setMessage
        );
        if (result) {
          change = true;
        }
      } catch (e) {
        setSystemError(e);
      }
    }
    if (change) {
      setDirty();
    }
    setEdit(false);
  };

  return (
    <>
      <Dialog onClose={() => setShowToken(false)} open={showToken}>
        <Box
          px={2}
          py={4}
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          gap={2}
        >
          <TextField
            disabled
            fullWidth
            multiline
            defaultValue={clusterParameters.token}
            sx={{
              width: 380,
            }}
          />
        </Box>
      </Dialog>
      <Grid spacing={3} container>
        <Grid item xs={12} md={6}>
          <Card>
            <Box p={4}>
              <Typography
                sx={{
                  pb: 3,
                }}
                variant="h4"
              >
                Your Cluster Stats
              </Typography>
              <Box>
                <Typography
                  variant="h4"
                  fontWeight="normal"
                  color="text.secondary"
                >
                  UPTIME
                </Typography>
                <Typography variant="h1" gutterBottom>
                  3 months 22 days 13 hours
                </Typography>
                <Box
                  display="flex"
                  sx={{
                    py: 4,
                  }}
                  alignItems="center"
                >
                  <AvatarSuccess
                    sx={{
                      mr: 2,
                    }}
                    variant="rounded"
                  >
                    <TrendingUp fontSize="large" />
                  </AvatarSuccess>
                  <Box>
                    <Typography variant="subtitle2" noWrap>
                      STATUS
                    </Typography>
                    <Typography variant="h4">Up & Running</Typography>
                  </Box>
                </Box>
              </Box>
              <Grid container spacing={3}>
                <Grid sm item>
                  <Button fullWidth variant="outlined">
                    Browse Catalog
                  </Button>
                </Grid>
                <Grid sm item>
                  <Button fullWidth variant="contained">
                    Manage you Catalog
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <Box
              paddingX={3}
              paddingY={1}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                <Typography variant="h4" gutterBottom>
                  Your Cluster Info
                </Typography>
              </Box>
              <Button
                variant="text"
                color={edit ? 'success' : 'primary'}
                startIcon={<EditTwoToneIcon />}
                onClick={edit ? () => updateInfo() : () => setEdit(true)}
              >
                {edit ? 'Save' : 'Edit'}
              </Button>
            </Box>
            <Divider />
            <CardContent sx={{ p: 4, alignItems: 'center' }}>
              <Typography variant="subtitle2">
                <Grid container spacing={0}>
                  <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                    <Box pr={3} pb={2}>
                      Pretty Name:
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={8} md={9}>
                    {edit ? (
                      <TextField
                        size="small"
                        value={providerPrettyName}
                        onChange={e => setProviderPrettyName(e.target.value)}
                      />
                    ) : (
                      <Text color="black">
                        <b>{providerPrettyName}</b>
                      </Text>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                    <Box pr={3} pb={2}>
                      Cluster ID:
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={8} md={9}>
                    <Text color="black">{clusterParameters.clusterID}</Text>
                  </Grid>
                  <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                    <Box pr={3} pb={2}>
                      Cluster Name:
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={8} md={9}>
                    <Text color="black">{clusterParameters.clusterName}</Text>
                  </Grid>
                  <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                    <Box pr={3} pb={2}>
                      Liqo Endpoint:
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={8} md={9}>
                    <Text color="black">{clusterParameters.endpoint}</Text>
                  </Grid>
                  <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                    <Box pr={3} pb={2}>
                      Liqo Token:
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={8} md={9}>
                    <Button
                      sx={{
                        py: 0,
                        px: 1,
                      }}
                      variant="text"
                      onClick={() => setShowToken(true)}
                      startIcon={<VisibilityIcon />}
                      size="small"
                    >
                      Show
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                    <Box pr={3} pb={2}>
                      Store:
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={8} md={9}>
                    {edit ? (
                      <TextField
                        size="small"
                        value={providerContractEndpoint}
                        onChange={e =>
                          setProviderContractEndpoint(e.target.value)
                        }
                      />
                    ) : (
                      <Text color="black">{contractEndpoint}</Text>
                    )}
                  </Grid>
                </Grid>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}

export default ClusterDetails;
