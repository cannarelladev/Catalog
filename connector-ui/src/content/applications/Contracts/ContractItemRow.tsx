import CloseIcon from '@mui/icons-material/Close';
import DnsIcon from '@mui/icons-material/Dns';
import MemoryIcon from '@mui/icons-material/Memory';
import StorageIcon from '@mui/icons-material/Storage';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardHeader,
  Checkbox,
  Dialog,
  Divider,
  Grid,
  TableCell,
  TableRow,
  Typography,
  styled,
  useTheme,
} from '@mui/material';
import { format } from 'date-fns';
import { FC, useState } from 'react';
import Label from 'src/components/Label';
import { Contract } from 'src/models';
import { OfferType, Resources } from 'src/models/offer';
import { coreParser, memoryParser } from 'src/models/parser';
import DialogDetail from './DialogDetail';

const AvatarPrimary = styled(Avatar)(
  ({ theme }) => `
      background: ${theme.colors.primary.lighter};
      color: ${theme.colors.primary.main};
      width: ${theme.spacing(7)};
      height: ${theme.spacing(7)};
`
);

interface IContractItemRowProps {
  contract: Contract;
  selected: boolean;
  select: (string) => void;
}

const ContractItemRow: FC<IContractItemRowProps> = props => {
  const { contract, selected, select } = props;
  const [showContractID, setShowContractID] = useState(false);
  const [showOfferID, setShowOfferID] = useState(false);
  const [showPlanDetail, setShowPlanDetail] = useState(false);

  console.log('contract', contract);
  const plan = contract.offer.plans.find(
    plan => plan.planID === contract.planID
  );

  const offer = contract.offer;

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
            <Grid item xs={12} md={6}>
              <Box
                key={result.length}
                px={2}
                py={4}
                display="flex"
                alignItems="flex-start"
              >
                <Divider orientation="vertical" />
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
                <Divider />
              </Box>
            </Grid>
          </>
        );
      }
    }
    return <>{result}</>;
  };

  const getTypeLabel = (offerType: OfferType): JSX.Element => {
    const map = {
      computational: {
        text: 'Computational',
        color: 'secondary',
        icon: <MemoryIcon className="mr-2" />,
      },
      storage: {
        icon: <StorageIcon className="mr-2" />,
        text: 'Storage',
        color: 'secondary',
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

  const theme = useTheme();

  return (
    <>
      <DialogDetail
        content={contract.contractID}
        open={showContractID}
        onClose={() => setShowContractID(false)}
        copyOnClick={false}
        multiline={true}
      />
      <DialogDetail
        content={offer.offerID}
        open={showOfferID}
        onClose={() => setShowOfferID(false)}
        copyOnClick={false}
        multiline={true}
      />
      <Dialog onClose={() => setShowPlanDetail(false)} open={showPlanDetail}>
        <Card
          sx={{
            overflow: 'visible',
          }}
        >
          <CardHeader
            sx={{
              textAlign: 'center',
              textTransform: 'uppercase',
              backgroundColor: theme.colors.primary.main,
              borderStartEndRadius: `${theme.general.borderRadius}`,
              borderStartStartRadius: `${theme.general.borderRadius}`,
              color: `${theme.colors.alpha.white[100]}`,
            }}
            title={plan.planName}
          />
          <Grid container>{getResourceDetails(plan.resources)}</Grid>

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
                  {`${plan.planCost} ${plan.planCostCurrency}`}
                </Typography>
                <Typography
                  display="inline"
                  color={theme.colors.primary.main}
                  className="h2"
                >{`/ ${plan.planCostPeriod}`}</Typography>
              </Box>
            </Box>
          </Box>
        </Card>
      </Dialog>
      <TableRow hover key={contract.contractID}>
        <TableCell align="center">
          <Checkbox
            checked={selected}
            onClick={() => select(contract.contractID)}
          />
        </TableCell>
        <TableCell>
          <Typography
            variant="body1"
            fontWeight="bold"
            color="text.primary"
            gutterBottom
            noWrap
          >
            <Button
              variant="text"
              onClick={() => setShowContractID(true)}
              startIcon={<VisibilityIcon />}
            >
              Show
            </Button>
          </Typography>
        </TableCell>
        <TableCell>
          <Typography
            variant="body1"
            fontWeight="bold"
            color="text.primary"
            gutterBottom
            noWrap
          >
            <Button
              variant="text"
              onClick={() => setShowOfferID(true)}
              startIcon={<VisibilityIcon />}
            >
              Show
            </Button>
          </Typography>
        </TableCell>

        <TableCell>
          <Typography
            variant="body1"
            fontWeight="bold"
            color="text.primary"
            gutterBottom
            noWrap
          >
            {contract.offer.offerName}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {contract.offer.description}
          </Typography>
        </TableCell>
        <TableCell align="center">
          <Typography variant="body2" color="text.secondary" noWrap>
            {getTypeLabel(contract.offer.offerType)}
          </Typography>
        </TableCell>
        <TableCell align="center">
          <Typography
            variant="body1"
            fontWeight="bold"
            color="text.primary"
            gutterBottom
            noWrap
          >
            <Button
              variant="outlined"
              onClick={() => setShowPlanDetail(true)}
              //startIcon={<VisibilityIcon />}
            >
              Details
            </Button>
          </Typography>
        </TableCell>
        <TableCell align="center">
          <Typography variant="body2" color="text.secondary" noWrap>
            {contract.offer.created
              ? format(contract.offer.created, 'dd/MM/yyyy')
              : ''}
          </Typography>
        </TableCell>
        <TableCell align="right">
          <Button
            sx={{ margin: 1 }}
            variant="contained"
            color="error"
            startIcon={<CloseIcon fontSize="small" />}
          >
            Revoke
          </Button>
        </TableCell>
      </TableRow>
    </>
  );
};

export default ContractItemRow;
