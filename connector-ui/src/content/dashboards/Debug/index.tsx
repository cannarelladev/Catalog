import CachedIcon from '@mui/icons-material/Cached';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  styled,
  Typography,
  useTheme,
} from '@mui/material';
import { Box } from '@mui/system';
import { FC, useContext, useState } from 'react';
import { SessionContext } from 'src/contexts/SessionContext';

interface IDebugProps {}

const Debug: FC<IDebugProps> = () => {
  const { setDirty, setMessage } = useContext(SessionContext);
  const theme = useTheme();
  const [error, setError] = useState('');

  /*   const initCatalog = async () => {
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
  }; */

  return (
    <Grid margin={5} xs={12} sm={6} md={4} item>
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
                Developer Tools
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="error"
              startIcon={<ClearIcon />}
              //onClick={edit ? () => updateInfo() : () => setEdit(true)}
            >
              HARD RESET
            </Button>
          </Box>
          <Divider />
          <CardContent sx={{ p: 4, alignItems: 'center' }}>
            <Typography variant="subtitle2">
              <Grid
                container
                spacing={0}
                display={'flex'}
                alignItems={'center'}
              >
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3}>Liqo Data:</Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9} gap={2} display={'flex'}>
                  <Button
                    variant="contained"
                    //onClick={/* () => setShowToken(true) */}
                    size="medium"
                    color="warning"
                    startIcon={<CachedIcon />}
                  >
                    Refresh
                  </Button>
                  <Button
                    variant="contained"
                    //onClick={/* () => setShowToken(true) */}
                    size="medium"
                    color="error"
                    startIcon={<DeleteIcon />}
                  >
                    Delete
                  </Button>
                </Grid>
              </Grid>
              <Grid
                container
                spacing={0}
                display={'flex'}
                alignItems={'center'}
                pt={2}
              >
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3}>Connector:</Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9} gap={2} display={'flex'}>
                  <Button
                    variant="contained"
                    //onClick={/* () => setShowToken(true) */}
                    size="medium"
                    color="warning"
                    startIcon={<DeleteIcon />}
                  >
                    Clear DB
                  </Button>
                  <Button
                    variant="contained"
                    //onClick={/* () => setShowToken(true) */}
                    size="medium"
                    color="error"
                    startIcon={<DeleteIcon />}
                  >
                    Reset
                  </Button>
                </Grid>
              </Grid>
              <Grid
                container
                spacing={0}
                display={'flex'}
                alignItems={'center'}
                pt={2}
              >
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3}>Contracts:</Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Button
                    variant="contained"
                    //onClick={/* () => setShowToken(true) */}
                    size="medium"
                    color="warning"
                    startIcon={<DeleteIcon />}
                  >
                    Clear DB
                  </Button>
                </Grid>
              </Grid>
              <Grid
                container
                spacing={0}
                display={'flex'}
                alignItems={'center'}
                pt={2}
              >
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3}>My Offers:</Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9}>
                  <Button
                    variant="contained"
                    //onClick={/* () => setShowToken(true) */}
                    size="medium"
                    color="warning"
                    startIcon={<DeleteIcon />}
                  >
                    Clear DB
                  </Button>
                </Grid>
              </Grid>
              <Grid
                container
                spacing={0}
                display={'flex'}
                alignItems={'center'}
                pt={2}
              >
                <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                  <Box pr={3}>Brokers:</Box>
                </Grid>
                <Grid item xs={12} sm={8} md={9} gap={2} display={'flex'}>
                  <Button
                    variant="contained"
                    //onClick={/* () => setShowToken(true) */}
                    size="medium"
                    color="warning"
                    startIcon={<DeleteIcon />}
                  >
                    Clear DB
                  </Button>
                  <Button
                    variant="contained"
                    //onClick={/* () => setShowToken(true) */}
                    size="medium"
                    color="error"
                    startIcon={<DeleteIcon />}
                  >
                    Reset
                  </Button>
                </Grid>
              </Grid>
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default Debug;
