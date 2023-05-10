import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import HubIcon from '@mui/icons-material/Hub';
import LoginIcon from '@mui/icons-material/Login';
import PolylineIcon from '@mui/icons-material/Polyline';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import {
  Avatar,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  Divider,
  Typography,
  styled,
  useTheme,
} from '@mui/material';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';

interface IComposeProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const Compose: FC<IComposeProps> = props => {
  const { setOpen, open } = props;
  const [networkAvailability, setNetworkAvailability] =
    useState<boolean>(false);
  const [serviceComposition, setServiceComposition] = useState<boolean>(false);
  const [bestEndpoint, setBestEndpoint] = useState<boolean>(false);
  const [accessCredentials, setAccessCredentials] = useState<boolean>(false);
  const theme = useTheme();

  setTimeout(() => {
    setNetworkAvailability(true);
  }, 4000);

  useEffect(() => {
    if (networkAvailability) {
      setTimeout(() => {
        setServiceComposition(true);
      }, 4000);
    }
  }, [networkAvailability]);

  useEffect(() => {
    if (serviceComposition) {
      setTimeout(() => {
        setBestEndpoint(true);
      }, 4000);
    }
  }, [serviceComposition]);

  useEffect(() => {
    if (bestEndpoint) {
      setTimeout(() => {
        setAccessCredentials(true);
      }, 4000);
    }
  }, [bestEndpoint]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog onClose={handleClose} open={open} fullWidth>
      <DialogTitle>
        <div className="flex justify-between items-center">
          <Typography
            gutterBottom
            variant="h1"
            sx={{ fontSize: `${theme.typography.pxToRem(20)}` }}
          >
            <b>Composing Services...</b>
          </Typography>
          <Button variant="text" color="primary" onClick={handleClose}>
            <CloseIcon />
          </Button>
        </div>
      </DialogTitle>
      <Divider />
      <div className="p-4 flex justify-between items-center">
        <div className="gap-2 flex">
          <TravelExploreIcon />
          <Typography
            gutterBottom
            variant="subtitle1"
            sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}
          >
            Checking Network Availability for Service Composition
          </Typography>
        </div>
        {!networkAvailability ? (
          <CircularProgress color="warning" size={30} />
        ) : (
          <CheckCircleIcon
            fontSize="large"
            color="success"
            sx={{
              ml: 1,
            }}
          />
        )}
      </div>
      <div className="p-4 flex justify-between items-center">
        <div className="gap-2 flex">
          <PolylineIcon />
          <Typography
            gutterBottom
            variant="subtitle1"
            sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}
          >
            Connecting and composing Services
          </Typography>
        </div>
        {!serviceComposition ? (
          <CircularProgress color="warning" size={30} />
        ) : (
          <CheckCircleIcon
            fontSize="large"
            color="success"
            sx={{
              ml: 1,
            }}
          />
        )}
      </div>
      <div className="p-4 flex justify-between items-center">
        <div className="gap-2 flex">
          <HubIcon />
          <Typography
            gutterBottom
            variant="subtitle1"
            sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}
          >
            Finding the best endpoint to access your services
          </Typography>
        </div>
        {!bestEndpoint ? (
          <CircularProgress color="warning" size={30} />
        ) : (
          <CheckCircleIcon
            fontSize="large"
            color="success"
            sx={{
              ml: 1,
            }}
          />
        )}
      </div>
      <div className="p-4 flex justify-between items-center">
        <div className="gap-2 flex">
          <VpnKeyIcon />
          <Typography
            gutterBottom
            variant="subtitle1"
            sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}
          >
            Generating access credentials
          </Typography>
        </div>
        {!accessCredentials ? (
          <CircularProgress color="warning" size={30} />
        ) : (
          <CheckCircleIcon
            fontSize="large"
            color="success"
            sx={{
              ml: 1,
            }}
          />
        )}
      </div>
      <div className="p-4 flex justify-center items-center">
        <Button
          variant="contained"
          color={'primary'}
          startIcon={<LoginIcon />}
          disabled={
            !networkAvailability ||
            !serviceComposition ||
            !bestEndpoint ||
            !accessCredentials
          }
        >
          Retrieve Access Credentials
        </Button>
      </div>

      {/* <Box px={2} py={2} display="flex" alignItems="center">
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
      </Box> */}
    </Dialog>
  );
};

export default Compose;
