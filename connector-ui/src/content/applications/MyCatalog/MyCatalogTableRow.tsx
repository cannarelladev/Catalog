import {
  Box,
  Button,
  Checkbox,
  Dialog,
  IconButton,
  TableCell,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import { format } from 'date-fns';
import {
  ChangeEvent,
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import { NavLink as RouterLink } from 'react-router-dom';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import MemoryIcon from '@mui/icons-material/Memory';
import StorageIcon from '@mui/icons-material/Storage';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import { API } from 'src/api/Api';
import Label from 'src/components/Label';
import { DataContext } from 'src/contexts/DataContext';
import { SessionContext } from 'src/contexts/SessionContext';
import { Offer, OfferAvailability, OfferType } from 'src/models/offer';

interface IMyCatalogTableRowProps {
  offer: Offer;
  isOfferSelected: boolean;
  selectedOffers: string[];
  setSelectedOffers: Dispatch<SetStateAction<string[]>>;
}

const getAvailabilityLabel = (availability: OfferAvailability): JSX.Element => {
  const map = {
    finished: {
      text: 'Out of stock',
      color: 'error',
    },
    available: {
      text: 'Available',
      color: 'success',
    },
    limited: {
      text: 'Limited stock',
      color: 'warning',
    },
  };

  const { text, color }: any = map[availability];

  return <Label color={color}>{text}</Label>;
};

const getStatusLabel = (status: boolean): JSX.Element => {
  const map = {
    false: {
      text: 'Disabled',
      color: 'error',
    },
    true: {
      text: 'Enabled',
      color: 'success',
    },
  };

  const { text, color }: any = map[String(status)];

  return <Label color={color}>{text}</Label>;
};

const MyCatalogTableRow: FC<IMyCatalogTableRowProps> = props => {
  const { offer, isOfferSelected, selectedOffers, setSelectedOffers } = props;
  const { setDirtyData: setDirty } = useContext(DataContext);
  const { setMessage, setSystemError } = useContext(SessionContext);
  const [showID, setShowID] = useState(false);

  const removeOffer = async () => {
    try {
      await API.deleteMyOffer(offer.offerID, setMessage);
      setDirty();
    } catch (error) {
      setSystemError(error);
    }
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

  const handleSelectOneOffer = (
    event: ChangeEvent<HTMLInputElement>,
    offerId: string
  ): void => {
    if (!selectedOffers.includes(offerId)) {
      setSelectedOffers(prevSelected => [...prevSelected, offerId]);
    } else {
      setSelectedOffers(prevSelected =>
        prevSelected.filter(id => id !== offerId)
      );
    }
  };

  const theme = useTheme();

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
            defaultValue={offer.offerID}
            sx={{
              width: 380,
            }}
          />
          <Tooltip title="Click to copy" placement="top">
            <IconButton
              size="medium"
              color="primary"
              onClick={() => {
                navigator.clipboard.writeText(offer.offerID);
              }}
            >
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Dialog>
      <TableRow hover key={offer.offerID} selected={isOfferSelected}>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            checked={isOfferSelected}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              handleSelectOneOffer(event, offer.offerID)
            }
            value={isOfferSelected}
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
              onClick={() => setShowID(true)}
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
            {offer.offerName}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {offer.description}
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
            {offer.clusterPrettyName || offer.clusterName}
          </Typography>
        </TableCell>
        <TableCell align="center">
          <Typography variant="body2" color="text.secondary" noWrap>
            {getTypeLabel(offer.offerType)}
          </Typography>
        </TableCell>
        <TableCell align="center">
          <Typography variant="body2" color="text.secondary" noWrap>
            {offer.created ? format(offer.created, 'dd/MM/yyyy') : ''}
          </Typography>
        </TableCell>
        <TableCell align="center">
          {offer.availability ? getAvailabilityLabel(offer.availability) : ''}
        </TableCell>
        <TableCell align="center">{getStatusLabel(offer.status)}</TableCell>
        <TableCell align="right">
          <Button
            sx={{ margin: 1 }}
            component={RouterLink}
            variant="contained"
            size="small"
            color="primary"
            to={'/management/myoffer/preview/' + offer.offerID}
          >
            Preview
          </Button>
          <Tooltip title="Delete Offer" arrow>
            <IconButton
              sx={{
                '&:hover': {
                  background: theme.colors.error.lighter,
                },
                color: theme.palette.error.main,
              }}
              color="inherit"
              size="small"
              onClick={removeOffer}
            >
              <DeleteTwoToneIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
    </>
  );
};

export default MyCatalogTableRow;
