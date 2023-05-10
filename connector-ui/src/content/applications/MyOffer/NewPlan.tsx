import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import DnsIcon from '@mui/icons-material/Dns';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MemoryIcon from '@mui/icons-material/Memory';
import StorageIcon from '@mui/icons-material/Storage';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogTitle,
  Divider,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  styled,
  useTheme,
} from '@mui/material';
import { Dispatch, FC, SetStateAction, SyntheticEvent, useState } from 'react';
import { OfferPlan, Resources } from 'src/models/offer';
import { numberToCoreParser, numberToMemoryParser } from 'src/models/parser';

const AvatarPrimary = styled(Avatar)(
  ({ theme }) => `
      background: ${theme.colors.primary.lighter};
      color: ${theme.colors.primary.main};
      width: ${theme.spacing(7)};
      height: ${theme.spacing(7)};
`
);

interface INewPlanProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  onClose: Dispatch<SetStateAction<boolean>>;
  addPlan: (plan: OfferPlan) => void;
  length: number;
  offerID: string;
}

const currencies = [
  {
    value: 'USD',
    label: '$',
  },
  {
    value: 'EUR',
    label: '€',
  },
  {
    value: 'GBP',
    label: '£',
  },
];

const periods = [
  {
    value: 'minute',
    label: 'Minute',
  },
  {
    value: 'hour',
    label: 'Hour',
  },
  {
    value: 'day',
    label: 'Day',
  },
  {
    value: 'week',
    label: 'Week',
  },
  {
    value: 'month',
    label: 'Month',
  },
  {
    value: 'year',
    label: 'Year',
  },
];

const NewPlan: FC<INewPlanProps> = props => {
  const { onClose, setOpen, addPlan, open, length, offerID } = props;
  const [expanded, setExpanded] = useState<string | false>(false);
  const [error, setError] = useState<string>('');
  const [memory, setMemory] = useState(false);
  const [storage, setStorage] = useState(false);
  const [cpu, setCpu] = useState(true);
  const [gpu, setGpu] = useState(false);
  const [storageData, setStorageData] = useState<number>();
  const [cpuData, setCpuData] = useState<number>(1);
  const [memoryData, setMemoryData] = useState<number>();
  const [gpuData, setGpuData] = useState<number>();
  const [planName, setPlanName] = useState<string>('test');
  const [planCost, setPlanCost] = useState<number>(1);
  const [planCostCurrency, setPlanCostCurrency] = useState<string>('USD');
  const [planCostPeriod, setPlanCostPeriod] = useState<string>('month');
  const [planQuantity, setPlanQuantity] = useState<number>(1);
  const theme = useTheme();

  const handleExpandChange =
    (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const handleClose = () => {
    setMemory(false);
    setStorage(false);
    setCpu(false);
    setGpu(false);
    setStorageData(undefined);
    setCpuData(undefined);
    setMemoryData(undefined);
    setGpuData(undefined);
    setPlanName('');
    setPlanCost(undefined);
    setPlanCostCurrency('');
    setPlanCostPeriod('');
    setPlanQuantity(undefined);
    setError('');
    setOpen(false);
  };

  const handleSave = () => {
    if (
      (storageData || cpuData || memoryData || gpuData) &&
      planName &&
      planCost &&
      planCostCurrency &&
      planCostPeriod &&
      planQuantity
    ) {
      let resources: Resources = {};
      if (storage) resources.storage = numberToMemoryParser(storageData);
      if (cpu) resources.cpu = numberToCoreParser(cpuData);
      if (memory) resources.memory = numberToMemoryParser(memoryData);
      if (gpu) resources.gpu = numberToCoreParser(gpuData);
      const plan: OfferPlan = {
        planID: offerID + '_' + (length + 1),
        planName,
        planCost,
        planCostCurrency,
        planCostPeriod,
        planQuantity,
        resources: resources,
      };
      addPlan(plan);
      handleClose();
    } else {
      setError('Please fill all the required fields');
    }
  };

  const icon = {
    cpu: <MemoryIcon />,
    memory: <DnsIcon />,
    storage: <StorageIcon />,
    gpu: <WallpaperIcon />,
  };

  /* const handleCPUChange = ({
    core,
    manufacturer,
    frequency,
    architecture,
    model,
    threads,
  }: Cpu) => {
    setCpuData({ core, manufacturer, frequency, architecture, model, threads });
  };

  const handleMemoryChange = ({
    manufacturer,
    size,
    type,
    frequency,
  }: Memory) => {
    setMemoryData({ manufacturer, frequency, size, type });
  };

  const handleStorageChange = ({ manufacturer, size, type }: Storage) => {
    setStorageData({ manufacturer, size, type });
  };

  const handleGPUChange = ({
    manufacturer,
    model,
    memory,
    core,
    frequency,
    type,
  }: Gpu) => {
    setGpuData({ manufacturer, model, memory, core, frequency, type });
  }; */

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Create a new Offer Plan</DialogTitle>
      <Divider />

      <Box px={2} display="flex" alignItems="flex-start">
        <Accordion
          expanded={expanded === 'cpu'}
          onChange={handleExpandChange('cpu')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <AvatarPrimary>{icon['cpu']}</AvatarPrimary>
            <Typography
              sx={{ display: 'flex', alignItems: 'center', ml: 2 }}
              variant="h3"
            >
              CPU
              {cpu && (
                <>
                  {cpuData ? (
                    <CheckCircleIcon
                      color="success"
                      sx={{
                        ml: 2,
                      }}
                    />
                  ) : (
                    ''
                  )}
                  <DeleteIcon
                    type="button"
                    color="error"
                    onClick={e => {
                      e.stopPropagation();
                      setCpu(false);
                      setCpuData(undefined);
                    }}
                    sx={{
                      ml: 1,
                    }}
                  />
                </>
              )}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box pl={2} flex={1}>
              <Grid container display="flex" justifyContent="space-between">
                <Grid item pr={5} columns={6} maxWidth="50%">
                  <Typography
                    gutterBottom
                    variant="caption"
                    sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}
                  >
                    CORE *
                  </Typography>
                  <TextField
                    sx={{
                      width: '100%',
                    }}
                    color="primary"
                    required
                    inputProps={{
                      min: 0,
                    }}
                    value={cpu ? cpuData : ''}
                    type="number"
                    onChange={e => {
                      setCpu(true);
                      setCpuData(parseInt(e.target.value));
                    }}
                    placeholder="vCore"
                  />
                </Grid>
                {/* <Grid item pr={5} columns={6} maxWidth="50%">
                  <Typography
                    gutterBottom
                    variant="caption"
                    sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}
                  >
                    FREQUENCY
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                      color="primary"
                      inputProps={{
                        min: 0,
                        step: 0.1,
                      }}
                      type="number"
                      value={cpu ? cpuData?.frequency : ''}
                      onChange={e => {
                        setCpu(true);
                        handleCPUChange({
                          ...cpuData,
                          frequency: Number(e.target.value),
                        });
                      }}
                      placeholder="(optional)"
                    />
                    <Typography>GHz</Typography>
                  </Box>
                </Grid>
                <Grid item pr={5} columns={6} maxWidth="50%">
                  <Typography
                    gutterBottom
                    variant="caption"
                    sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}
                  >
                    THREADS
                  </Typography>
                  <TextField
                    sx={{
                      width: '100%',
                    }}
                    color="primary"
                    value={cpu ? cpuData?.threads : ''}
                    type="number"
                    onChange={e => {
                      setCpu(true);
                      handleCPUChange({
                        ...cpuData,
                        threads: Number(e.target.value),
                      });
                    }}
                    placeholder="(optional)"
                  />
                </Grid>
                <Grid item pr={5} columns={6} maxWidth="50%">
                  <Typography
                    gutterBottom
                    variant="caption"
                    sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}
                  >
                    ARCH
                  </Typography>
                  <TextField
                    color="primary"
                    value={cpu ? cpuData?.architecture : ''}
                    onChange={e => {
                      setCpu(true);
                      handleCPUChange({
                        ...cpuData,
                        architecture: e.target.value,
                      });
                    }}
                    placeholder="(optional)"
                  />
                </Grid>
                <Grid item pr={5} columns={6} maxWidth="50%">
                  <Typography
                    gutterBottom
                    variant="caption"
                    sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}
                  >
                    MANUFACTURER
                  </Typography>
                  <TextField
                    sx={{
                      width: '100%',
                    }}
                    color="primary"
                    value={cpu ? cpuData?.manufacturer : ''}
                    onChange={e => {
                      setCpu(true);
                      handleCPUChange({
                        ...cpuData,
                        manufacturer: e.target.value,
                      });
                    }}
                    placeholder="(optional)"
                  />
                </Grid>
                <Grid item pr={5} columns={6} maxWidth="50%">
                  <Typography
                    gutterBottom
                    variant="caption"
                    sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}
                  >
                    MODEL
                  </Typography>
                  <TextField
                    sx={{
                      width: '100%',
                    }}
                    color="primary"
                    value={cpu ? cpuData?.model : ''}
                    onChange={e => {
                      setCpu(true);
                      handleCPUChange({ ...cpuData, model: e.target.value });
                    }}
                    placeholder="(optional)"
                  />
                </Grid> */}
              </Grid>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
      <Divider />
      <Box px={2} display="flex" alignItems="flex-start">
        <Accordion
          expanded={expanded === 'memory'}
          onChange={handleExpandChange('memory')}
        >
          <AccordionSummary
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
            expandIcon={<ExpandMoreIcon />}
          >
            <AvatarPrimary>{icon['memory']}</AvatarPrimary>
            <Typography
              sx={{ display: 'flex', alignItems: 'center', ml: 2 }}
              variant="h3"
            >
              MEMORY
              {memory && (
                <>
                  {memoryData ? (
                    <CheckCircleIcon
                      color="success"
                      sx={{
                        ml: 2,
                      }}
                    />
                  ) : (
                    ''
                  )}
                  <DeleteIcon
                    type="button"
                    color="error"
                    onClick={e => {
                      e.stopPropagation();
                      setMemory(false);
                      setMemoryData(undefined);
                    }}
                    sx={{
                      ml: 1,
                    }}
                  />
                </>
              )}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box pl={2} flex={1}>
              <Grid container display="flex" justifyContent="space-between">
                <Grid item pr={5} columns={6} maxWidth="50%">
                  <Typography
                    gutterBottom
                    variant="caption"
                    sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}
                  >
                    SIZE *
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                      sx={{
                        width: '100%',
                      }}
                      color="primary"
                      required
                      inputProps={{
                        min: 0,
                      }}
                      value={memory ? memoryData : ''}
                      type="number"
                      onChange={e => {
                        setMemory(true);
                        setMemoryData(parseInt(e.target.value));
                      }}
                      placeholder=""
                    />
                    <Typography>GB</Typography>
                  </Box>
                </Grid>
                {/* <Grid item pr={5} columns={6} maxWidth="50%">
                  <Typography
                    gutterBottom
                    variant="caption"
                    sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}
                  >
                    FREQUENCY
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                      color="primary"
                      inputProps={{
                        min: 0,
                        step: 0.1,
                      }}
                      type="number"
                      value={memory ? memoryData?.frequency : ''}
                      onChange={e => {
                        setMemory(true);
                        handleMemoryChange({
                          ...memoryData,
                          frequency: Number(e.target.value),
                        });
                      }}
                      placeholder="(optional)"
                    />
                    <Typography>GHz</Typography>
                  </Box>
                </Grid>
                <Grid item pr={5} columns={6} maxWidth="50%">
                  <Typography
                    gutterBottom
                    variant="caption"
                    sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}
                  >
                    TYPE
                  </Typography>
                  <TextField
                    color="primary"
                    value={memory ? memoryData?.type : ''}
                    onChange={e => {
                      setMemory(true);
                      handleMemoryChange({
                        ...memoryData,
                        type: e.target.value,
                      });
                    }}
                    placeholder="(optional)"
                  />
                </Grid>
                <Grid item pr={5} columns={6} maxWidth="50%">
                  <Typography
                    gutterBottom
                    variant="caption"
                    sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}
                  >
                    MANUFACTURER
                  </Typography>
                  <TextField
                    sx={{
                      width: '100%',
                    }}
                    color="primary"
                    value={memory ? memoryData?.manufacturer : ''}
                    onChange={e => {
                      setMemory(true);
                      handleMemoryChange({
                        ...memoryData,
                        manufacturer: e.target.value,
                      });
                    }}
                    placeholder="(optional)"
                  />
                </Grid> */}
              </Grid>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
      <Divider />
      <Box px={2} display="flex" alignItems="flex-start">
        <Accordion
          expanded={expanded === 'storage'}
          onChange={handleExpandChange('storage')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <AvatarPrimary>{icon['storage']}</AvatarPrimary>
            <Typography
              sx={{ display: 'flex', alignItems: 'center', ml: 2 }}
              variant="h3"
            >
              STORAGE
              {storage && (
                <>
                  {storageData ? (
                    <CheckCircleIcon
                      color="success"
                      sx={{
                        ml: 2,
                      }}
                    />
                  ) : (
                    ''
                  )}
                  <DeleteIcon
                    type="button"
                    color="error"
                    onClick={e => {
                      e.stopPropagation();
                      setStorage(false);
                      setStorageData(undefined);
                    }}
                    sx={{
                      ml: 1,
                    }}
                  />
                </>
              )}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box pl={2} flex={1}>
              <Grid container display="flex" justifyContent="space-between">
                <Grid item pr={5} columns={6} maxWidth="50%">
                  <Typography
                    gutterBottom
                    variant="caption"
                    sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}
                  >
                    SIZE *
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                      sx={{
                        width: '100%',
                      }}
                      color="primary"
                      required
                      inputProps={{
                        min: 0,
                      }}
                      value={storage ? storageData : ''}
                      type="number"
                      onChange={e => {
                        setStorage(true);
                        setStorageData(parseInt(e.target.value));
                      }}
                    />
                    <Typography>GB</Typography>
                  </Box>
                </Grid>
                {/* <Grid item pr={5} columns={6} maxWidth="50%">
                  <Typography
                    gutterBottom
                    variant="caption"
                    sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}
                  >
                    TYPE
                  </Typography>
                  <TextField
                    color="primary"
                    value={storage ? storageData?.type : ''}
                    onChange={e => {
                      setStorage(true);
                      handleStorageChange({
                        ...storageData,
                        type: e.target.value,
                      });
                    }}
                    placeholder="(optional)"
                  />
                </Grid>
                <Grid item pr={5} columns={6} maxWidth="50%">
                  <Typography
                    gutterBottom
                    variant="caption"
                    sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}
                  >
                    MANUFACTURER
                  </Typography>
                  <TextField
                    sx={{
                      width: '100%',
                    }}
                    color="primary"
                    value={storage ? storageData?.manufacturer : ''}
                    onChange={e => {
                      setStorage(true);
                      handleStorageChange({
                        ...storageData,
                        manufacturer: e.target.value,
                      });
                    }}
                    placeholder="(optional)"
                  />
                </Grid> */}
              </Grid>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
      <Divider />
      <Box px={2} display="flex" alignItems="flex-start">
        <Accordion
          expanded={expanded === 'gpu'}
          onChange={handleExpandChange('gpu')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <AvatarPrimary>{icon['gpu']}</AvatarPrimary>
            <Typography
              sx={{ display: 'flex', alignItems: 'center', ml: 2 }}
              variant="h3"
            >
              GPU
              {gpu && (
                <>
                  {gpuData ? (
                    <CheckCircleIcon
                      color="success"
                      sx={{
                        ml: 2,
                      }}
                    />
                  ) : (
                    ''
                  )}
                  <DeleteIcon
                    type="button"
                    color="error"
                    onClick={e => {
                      e.stopPropagation();
                      setGpu(false);
                      setGpuData(undefined);
                    }}
                    sx={{
                      ml: 1,
                    }}
                  />
                </>
              )}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box pl={2} flex={1}>
              <Grid container display="flex" justifyContent="space-between">
                <Grid item pr={5} columns={6} maxWidth="50%">
                  <Typography
                    gutterBottom
                    variant="caption"
                    sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}
                  >
                    CORE *
                  </Typography>
                  <TextField
                    sx={{
                      width: '100%',
                    }}
                    color="primary"
                    required
                    inputProps={{
                      min: 0,
                    }}
                    value={gpu ? gpuData : ''}
                    type="number"
                    onChange={e => {
                      setGpu(true);
                      setGpuData(parseInt(e.target.value));
                    }}
                    placeholder="vCore"
                  />
                </Grid>
                {/* <Grid item pr={5} columns={6} maxWidth="50%">
                  <Typography
                    gutterBottom
                    variant="caption"
                    sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}
                  >
                    FREQUENCY
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                      color="primary"
                      inputProps={{
                        min: 0,
                        step: 0.1,
                      }}
                      type="number"
                      value={gpu ? gpuData?.frequency : ''}
                      onChange={e => {
                        setGpu(true);
                        handleGPUChange({
                          ...gpuData,
                          frequency: Number(e.target.value),
                        });
                      }}
                      placeholder="(optional)"
                    />
                    <Typography>GHz</Typography>
                  </Box>
                </Grid>
                <Grid item pr={5} columns={6} maxWidth="50%">
                  <Typography
                    gutterBottom
                    variant="caption"
                    sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}
                  >
                    MEMORY
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                      sx={{
                        width: '100%',
                      }}
                      color="primary"
                      value={gpu ? gpuData?.memory : ''}
                      type="number"
                      onChange={e => {
                        setGpu(true);
                        handleGPUChange({
                          ...gpuData,
                          memory: Number(e.target.value),
                        });
                      }}
                      placeholder="(optional)"
                    />
                    <Typography>GB</Typography>
                  </Box>
                </Grid>
                <Grid item pr={5} columns={6} maxWidth="50%">
                  <Typography
                    gutterBottom
                    variant="caption"
                    sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}
                  >
                    TYPE
                  </Typography>
                  <TextField
                    color="primary"
                    value={gpu ? gpuData?.type : ''}
                    onChange={e => {
                      setGpu(true);
                      handleGPUChange({
                        ...gpuData,
                        type: e.target.value,
                      });
                    }}
                    placeholder="(optional)"
                  />
                </Grid>
                <Grid item pr={5} columns={6} maxWidth="50%">
                  <Typography
                    gutterBottom
                    variant="caption"
                    sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}
                  >
                    MANUFACTURER
                  </Typography>
                  <TextField
                    sx={{
                      width: '100%',
                    }}
                    color="primary"
                    value={gpu ? gpuData?.manufacturer : ''}
                    onChange={e => {
                      setGpu(true);
                      handleGPUChange({
                        ...gpuData,
                        manufacturer: e.target.value,
                      });
                    }}
                    placeholder="(optional)"
                  />
                </Grid>
                <Grid item pr={5} columns={6} maxWidth="50%">
                  <Typography
                    gutterBottom
                    variant="caption"
                    sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}
                  >
                    MODEL
                  </Typography>
                  <TextField
                    sx={{
                      width: '100%',
                    }}
                    color="primary"
                    value={gpu ? gpuData?.model : ''}
                    onChange={e => {
                      setGpu(true);
                      handleGPUChange({
                        ...gpuData,
                        model: e.target.value,
                      });
                    }}
                    placeholder="(optional)"
                  />
                </Grid> */}
              </Grid>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
      <Divider />
      <Box px={2} py={2} display="flex" alignItems="center">
        <Grid container>
          <Grid
            item
            pb={2}
            columns={6}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '50%',
              px: 1,
            }}
          >
            <Typography
              gutterBottom
              variant="caption"
              sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}
            >
              PLAN NAME
              {planName && (
                <CheckCircleIcon
                  fontSize="small"
                  color="success"
                  sx={{
                    ml: 1,
                  }}
                />
              )}
            </Typography>
            <TextField
              fullWidth
              required
              color="primary"
              value={planName}
              onChange={e => setPlanName(e.target.value)}
              placeholder="Plan Name"
            />
          </Grid>
          <Grid
            item
            pb={2}
            columns={6}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '50%',
              px: 1,
            }}
          >
            <Typography
              gutterBottom
              variant="caption"
              sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}
            >
              QUANTITY
              {planQuantity ? (
                <CheckCircleIcon
                  fontSize="small"
                  color="success"
                  sx={{
                    ml: 1,
                  }}
                />
              ) : (
                ''
              )}
            </Typography>
            <TextField
              required
              type="number"
              color="primary"
              inputProps={{
                min: 0,
              }}
              value={planQuantity}
              onChange={e => setPlanQuantity(Number(e.target.value))}
              placeholder="Quantity"
            />
          </Grid>
          <Grid
            item
            pb={2}
            columns={6}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '50%',
              px: 1,
            }}
          >
            <Typography
              gutterBottom
              variant="caption"
              sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}
            >
              COST
              {planCost ? (
                <CheckCircleIcon
                  fontSize="small"
                  color="success"
                  sx={{
                    ml: 1,
                  }}
                />
              ) : (
                ''
              )}
            </Typography>
            <TextField
              required
              color="primary"
              type="number"
              inputProps={{
                min: 0,
                step: 0.1,
              }}
              value={planCost}
              onChange={e => setPlanCost(Number(e.target.value))}
              placeholder="Plan Cost"
            />
          </Grid>
          <Grid
            item
            pb={2}
            columns={3}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '25%',
              px: 1,
            }}
          >
            <Typography
              gutterBottom
              variant="caption"
              sx={{
                fontSize: `${theme.typography.pxToRem(16)}`,
              }}
            >
              CURRENCY
              {planCostCurrency && (
                <CheckCircleIcon
                  fontSize="small"
                  color="success"
                  sx={{
                    ml: 1,
                  }}
                />
              )}
            </Typography>
            <Select
              fullWidth
              required
              color="primary"
              value={planCostCurrency}
              onChange={e => setPlanCostCurrency(e.target.value)}
            >
              {currencies.map(currency => (
                <MenuItem key={currency.value} value={currency.value}>
                  {currency.value}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid
            item
            pb={2}
            columns={3}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '25%',
              px: 1,
            }}
          >
            <Typography
              gutterBottom
              variant="caption"
              sx={{
                fontSize: `${theme.typography.pxToRem(16)}`,
              }}
            >
              PERIOD
              {planCostPeriod && (
                <CheckCircleIcon
                  fontSize="small"
                  color="success"
                  sx={{
                    ml: 1,
                  }}
                />
              )}
            </Typography>
            <Select
              fullWidth
              required
              color="primary"
              value={planCostPeriod}
              onChange={e => setPlanCostPeriod(e.target.value)}
            >
              {periods.map(period => (
                <MenuItem key={period.value} value={period.value}>
                  {period.label}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid
            item
            pb={2}
            columns={6}
            sx={{
              display: 'flex',
              flexDirection: 'column',
            }}
          ></Grid>
        </Grid>
      </Box>
      <Divider />
      <Box
        px={2}
        py={4}
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        gap={2}
      >
        <Button
          onClick={() => setOpen(false)}
          variant="outlined"
          size="medium"
          color="warning"
        >
          Close
        </Button>
        <Button
          onClick={() => handleSave()}
          variant="contained"
          size="medium"
          color="primary"
        >
          Save
        </Button>
      </Box>
    </Dialog>
  );
};

export default NewPlan;
