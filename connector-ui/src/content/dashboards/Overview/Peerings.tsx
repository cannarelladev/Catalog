import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Tooltip,
  Typography,
  styled
} from '@mui/material';
import Text from 'src/components/Text';

const AvatarAddWrapper = styled(Avatar)(
  ({ theme }) => `
        background: ${theme.colors.alpha.black[10]};
        color: ${theme.colors.primary.main};
        width: ${theme.spacing(8)};
        height: ${theme.spacing(8)};
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

function Peerings() {
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
        <Typography variant="h3">Active Peerings</Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<AddTwoToneIcon fontSize="small" />}
        >
          Add new Cluster
        </Button>
      </Box>
      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={2} item>
          <Card
            sx={{
              px: 1,
            }}
          >
            <CardContent>
             {/*  <AvatarWrapper>
                <img
                  alt="Cluster 1"
                  src="/static/images/placeholders/logo/bitcoin.png"
                />
              </AvatarWrapper> */}
              <Typography variant="h5" noWrap>
                Aruba
              </Typography>
              <Typography variant="subtitle1" noWrap>
                IT-3
              </Typography>
              <Box
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
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} md={2} item>
          <Card
            sx={{
              px: 1,
            }}
          >
            <CardContent>
              {/* <AvatarWrapper>
                <img
                  alt="Ripple"
                  src="/static/images/placeholders/logo/ripple.png"
                />
              </AvatarWrapper> */}
              <Typography variant="h5" noWrap>
                Engineering
              </Typography>
              <Typography variant="subtitle1" noWrap>
                IT-2
              </Typography>
              <Box
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
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} md={2} item>
          <Card
            sx={{
              px: 1,
            }}
          >
            <CardContent>
              {/* <AvatarWrapper>
                <img
                  alt="Cardano"
                  src="/static/images/placeholders/logo/cardano.png"
                />
              </AvatarWrapper> */}
              <Typography variant="h5" noWrap>
                Ionos
              </Typography>
              <Typography variant="subtitle1" noWrap>
                DE-4
              </Typography>
              <Box
                sx={{
                  pt: 3,
                }}
              >
                <Typography variant="subtitle2" noWrap>
                  Status
                </Typography>
                <Typography variant="h3" gutterBottom noWrap>
                  <Text color="error">DISABLED</Text>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid xs={12} sm={6} md={2} item>
          <Tooltip arrow title="Click to add a new Peering">
            <CardAddAction>
              <CardActionArea
                sx={{
                  px: 1,
                }}
              >
                <CardContent>
                  <AvatarAddWrapper>
                    <AddTwoToneIcon fontSize="large" />
                  </AvatarAddWrapper>
                </CardContent>
              </CardActionArea>
            </CardAddAction>
          </Tooltip>
        </Grid>
      </Grid>
    </>
  );
}

export default Peerings;
