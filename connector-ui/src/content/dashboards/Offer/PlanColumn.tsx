import DnsIcon from '@mui/icons-material/Dns';
import MemoryIcon from '@mui/icons-material/Memory';
import StorageIcon from '@mui/icons-material/Storage';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import {
  alpha,
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  Grid,
  styled,
  Typography,
  useTheme,
} from '@mui/material';
import { FC, useContext } from 'react';
import Label from 'src/components/Label';
import { DataContext } from 'src/contexts/DataContext';
import { SessionContext } from 'src/contexts/SessionContext';
import { Provider } from 'src/models';
import { OfferPlan, Resources } from 'src/models/offer';
import { coreParser, memoryParser } from 'src/models/parser';
import { API } from '../../../api/Api';

const AvatarPrimary = styled(Avatar)(
  ({ theme }) => `
      background: ${theme.colors.primary.lighter};
      color: ${theme.colors.primary.main};
      width: ${theme.spacing(7)};
      height: ${theme.spacing(7)};
`
);

interface PlanColumnProps {
  offerID: string;
  id: number;
  plan: OfferPlan;
}

const PlanColumn: FC<PlanColumnProps> = props => {
  const { offerID, plan, id } = props;
  const { catalog, setDirtyData: setDirty } = useContext(DataContext);
  const { setMessage, setSystemError } = useContext(SessionContext);
  const theme = useTheme();

  const {
    clusterID,
    clusterName,
    clusterContractEndpoint,
    clusterPrettyName,
    endpoint,
    token,
  } = catalog.find(offer => offer.offerID === offerID);

  const provider: Provider = {
    clusterID,
    clusterName,
    endpoint,
    token,
    clusterPrettyName,
    clusterContractEndpoint,
  };

  const {
    planID,
    planName,
    planCost,
    resources,
    planCostCurrency,
    planCostPeriod,
    planQuantity,
  } = plan;

  const handleBuyOffer = async () => {
    if (
      (provider.clusterID,
      provider.clusterName,
      provider.endpoint,
      provider.token,
      provider.clusterPrettyName,
      provider.clusterContractEndpoint)
    ) {
      try {
        const response = await API.buyOffer(
          provider,
          offerID,
          planID,
          setMessage
        );
        if (response) {
          setDirty();
        }
      } catch (error) {
        setSystemError(error);
      }
    } else {
      setSystemError('provider values are not set');
    }
  };

  const getResourceDetails = (resources: Resources): JSX.Element => {
    const map = {
      cpu: {
        title: 'CPU',
        label: 'vCORE',
        value: () => coreParser(resources.cpu),
      },
      memory: {
        title: 'MEMORY',
        label: 'RAM',
        value: () => memoryParser(resources.memory),
        suffix: 'GB',
      },
      storage: {
        title: 'STORAGE',
        label: 'HDD',
        value: () => memoryParser(resources.storage),
        suffix: 'GB',
      },
      gpu: {
        title: 'GPU',
        label: 'vCore',
        value: () => coreParser(resources.gpu),
      },
    };

    const icon = {
      cpu: <MemoryIcon />,
      memory: <DnsIcon />,
      storage: <StorageIcon />,
      gpu: <WallpaperIcon />,
    };

    let result = [];
    for (const key in resources) {
      if (resources[key]) {
        const { title, label, value, suffix } = map[key];
        result.push(
          <>
            <Box
              key={result.length}
              px={2}
              py={4}
              display="flex"
              alignItems="flex-start"
            >
              <AvatarPrimary>{icon[key]}</AvatarPrimary>
              <Box pl={2} flex={1}>
                <Typography variant="h3">{title}</Typography>
                <Grid
                  container
                  pt={2}
                  display="flex"
                  justifyContent="space-between"
                >
                  <Grid item pr={5} columns={6} maxWidth="50%">
                    <Typography
                      gutterBottom
                      variant="caption"
                      sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}
                    >
                      {label}
                    </Typography>

                    <Typography variant="h3">
                      {value()}
                      {suffix ? map[key].suffix : ''}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Box>
            <Divider />
          </>
        );
      }
    }
    return <>{result}</>;
  };

  const getStatusLabel = (quantity: number): JSX.Element => {
    const map = {
      finished: {
        text: 'Finished',
        color: 'error',
      },
      available: {
        text: 'Available',
        color: 'success',
      },
      latest: {
        text: 'Latest',
        color: 'warning',
      },
    };

    const status =
      quantity == 0
        ? 'finished'
        : quantity == 1 || quantity == 2
        ? 'latest'
        : 'available';

    const { text, color }: any = map[status];

    return <Label color={color}>{text}</Label>;
  };

  const mapColors = {
    0: theme.colors.primary.main,
    1: theme.colors.warning.main,
    2: theme.colors.success.main,
    3: theme.colors.secondary.main,
    4: theme.colors.error.main,
    5: theme.colors.info.main,
    6: theme.colors.gradients.purple1,
    7: theme.colors.gradients.pink1,
  };

  return (
    <Grid item md={4} xs={12}>
      <Card
        sx={{
          overflow: 'visible',
        }}
      >
        <CardHeader
          sx={{
            textAlign: 'center',
            textTransform: 'uppercase',
            backgroundColor: mapColors[id],
            borderStartEndRadius: `${theme.general.borderRadius}`,
            borderStartStartRadius: `${theme.general.borderRadius}`,
            color: `${theme.colors.alpha.white[100]}`,
          }}
          title={planName}
        />
        {getResourceDetails(resources)}
        <Box
          sx={{
            p: 3,
            textAlign: 'center',
            textTransform: 'uppercase',
            backgroundColor: `${theme.colors.primary.lighter}`,
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="center">
            <Box>
              <Typography
                variant="h3"
                noWrap
                sx={{
                  fontWeight: 700,
                  color: `${theme.colors.primary.main}`,
                }}
              >
                Price
              </Typography>
              <Typography
                display="inline"
                variant="h2"
                sx={{
                  pr: 1,
                  mb: 1,
                }}
              >
                {`${planCost} ${planCostCurrency}`}
              </Typography>
              <Typography
                display="inline"
                color={theme.colors.primary.main}
                className="h2"
              >{`/ ${planCostPeriod}`}</Typography>
              <Typography
                sx={{
                  py: 1,
                }}
                align="center"
                variant="subtitle2"
                noWrap
              >
                {getStatusLabel(planQuantity)}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Box p={3} display="flex" justifyContent="center">
          <Button
            size="medium"
            variant="contained"
            color="success"
            onClick={handleBuyOffer}
          >
            Join Offer
          </Button>
        </Box>
      </Card>
    </Grid>
  );
};

export default PlanColumn;
