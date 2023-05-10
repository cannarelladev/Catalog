import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import MemoryIcon from '@mui/icons-material/Memory';
import PolylineIcon from '@mui/icons-material/Polyline';
import SecurityIcon from '@mui/icons-material/Security';
import StorageIcon from '@mui/icons-material/Storage';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import {
  Avatar,
  Box,
  Button,
  Card,
  Dialog,
  Grid,
  IconButton,
  ListItemAvatar,
  TextField,
  Tooltip,
  Typography,
  alpha,
  styled,
  useTheme,
} from '@mui/material';
import { FC, useState } from 'react';
import Label from 'src/components/Label';
import { Offer } from 'src/models';
import { OfferType } from 'src/models/offer';

interface SummaryProps {
  offer: Offer;
}

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.success.main};
      color: ${theme.palette.success.contrastText};
      width: ${theme.spacing(8)};
      height: ${theme.spacing(8)};
      box-shadow: ${theme.colors.shadows.success};
`
);

const ListItemAvatarWrapper = styled(ListItemAvatar)(
  ({ theme }) => `
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${theme.spacing(1)};
  padding: ${theme.spacing(0.5)};
  border-radius: 60px;
  background: ${
    theme.palette.mode === 'dark'
      ? theme.colors.alpha.trueWhite[30]
      : alpha(theme.colors.alpha.black[100], 0.07)
  };

  img {
    background: ${theme.colors.alpha.trueWhite[100]};
    padding: ${theme.spacing(0.5)};
    display: block;
    border-radius: inherit;
    height: ${theme.spacing(4.5)};
    width: ${theme.spacing(4.5)};
  }
`
);
const Summary: FC<SummaryProps> = ({ offer }) => {
  const theme = useTheme();

  const {
    offerID,
    clusterID,
    clusterName,
    clusterPrettyName,
    offerName,
    description,
    //status,
    offerType,
    created,
    plans,
  } = offer;

  const [showID, setShowID] = useState(false);

  const getStatusLabel = (quantity: number): JSX.Element => {
    const map = {
      finished: {
        text: 'Out of stock',
        color: 'error',
      },
      available: {
        text: 'Available',
        color: 'success',
      },
      low: {
        text: 'Low stock',
        color: 'warning',
      },
    };

    const status =
      quantity == 0 ? 'finished' : quantity < 10 ? 'low' : 'available';

    const { text, color }: any = map[status];

    return <Label color={color}>{text}</Label>;
  };

  const getTypeLabel = (offerType: OfferType): JSX.Element => {
    const map = {
      computational: {
        text: 'Computational',
        color: 'secondary',
        icon: <MemoryIcon className="mr-2" />,
      },
      storage: {
        text: 'Storage',
        color: 'secondary',
        icon: <StorageIcon className="mr-2" />,
      },
      gpu: {
        text: 'GPU',
        color: 'secondary',
        icon: <WallpaperIcon className="mr-2" />,
      },
    };

    const { text, color, icon }: any = map[offerType];

    return (
      <Label color={color} className="">
        {icon}
        {text}
      </Label>
    );
  };

  return (
    <>
      <Dialog onClose={() => setShowID(false)} open={showID}>
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
            defaultValue={offerID}
            sx={{
              width: 380,
            }}
          />
          <Tooltip title="Click to copy" placement="top">
            <IconButton
              size="medium"
              color="primary"
              onClick={() => {
                navigator.clipboard.writeText(offerID);
              }}
            >
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Dialog>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          pb: 3,
        }}
      >
        <Typography variant="h3">Offer Summary</Typography>
      </Box>
      <Card>
        <Grid spacing={0} container>
          <Grid item xs={12}>
            <Box p={4}>
              <Grid container spacing={3} paddingY={2}>
                <Grid sm item>
                  <Typography align="center" variant="h3" noWrap>
                    OFFER ID
                  </Typography>
                  <Typography align="center" variant="subtitle2" noWrap>
                    <Button
                      variant="text"
                      onClick={() => setShowID(true)}
                      startIcon={<VisibilityIcon />}
                    >
                      Show
                    </Button>
                  </Typography>
                </Grid>
                <Grid sm item>
                  <Typography align="center" variant="h3" noWrap>
                    OFFER NAME
                  </Typography>
                  <Typography align="center" variant="subtitle2" noWrap>
                    {offerName}
                  </Typography>
                </Grid>
                <Grid sm item>
                  <Typography align="center" variant="h3" noWrap>
                    PROVIDER
                  </Typography>
                  <Typography align="center" variant="subtitle2" noWrap>
                    {clusterPrettyName || clusterName}
                  </Typography>
                </Grid>
                <Grid sm item>
                  <Typography align="center" variant="h3" noWrap>
                    TYPE
                  </Typography>
                  <Typography align="center" variant="subtitle2" noWrap>
                    {getTypeLabel(offerType)}
                  </Typography>
                </Grid>
                <Grid sm item>
                  <Typography align="center" variant="h3" noWrap>
                    AVAILABILITY
                  </Typography>
                  <Typography align="center" variant="subtitle2" noWrap>
                    {getStatusLabel(
                      plans.map(p => p.planQuantity).reduce((a, b) => a + b, 0)
                    )}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={3} paddingY={2}>
                <Grid sm item>
                  <Typography align="center" variant="h3" noWrap>
                    DESCRIPTION
                  </Typography>
                  <Box
                    component="span"
                    sx={{
                      display: 'block',
                      p: 2,
                      borderRadius: theme.general.borderRadius,
                      backgroundColor: theme.colors.secondary.lighter,
                      width: '100%',
                      textAlign: 'center',
                      mt: 1,
                    }}
                    className="w-full"
                  >
                    {description}
                  </Box>
                </Grid>
              </Grid>
              <Grid container spacing={3} paddingTop={2} paddingX={10}>
                <Grid sm item>
                  <Tooltip
                    title='This Service is eligible to be automatically composed with other "Composable Services" on a single network layer.
                    This allows for the creation of complex applications with multiple services, without the need to manage the network infrastructure.
                    Moreover you will access the services through a single endpoint.'
                    arrow
                    placement="top"
                  >
                    <Button
                      fullWidth
                      variant="outlined"
                      color={'primary'}
                      startIcon={<PolylineIcon />}
                    >
                      Composable Service
                    </Button>
                  </Tooltip>
                </Grid>
                <Grid sm item>
                  <Tooltip
                    title="This service is provided through a secure network infrastructure, which is isolated from the public internet."
                    arrow
                    placement="top"
                  >
                    <Button
                      fullWidth
                      variant="outlined"
                      color="success"
                      startIcon={<SecurityIcon />}
                    >
                      Secure Network Infrastructure
                    </Button>
                  </Tooltip>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </>
  );
};

export default Summary;
