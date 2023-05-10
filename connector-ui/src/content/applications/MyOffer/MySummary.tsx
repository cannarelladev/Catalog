import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import MemoryIcon from '@mui/icons-material/Memory';
import StorageIcon from '@mui/icons-material/Storage';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import {
  Box,
  Button,
  Card,
  Dialog,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Switch,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';

import { Dispatch, FC, SetStateAction, useState } from 'react';
import Label from 'src/components/Label';
import { OfferAvailability, OfferType } from 'src/models/offer';

interface MySummaryProps {
  offerID: string;
  offerName: string;
  offerType: OfferType;
  offerStatus: boolean;
  description: string;
  availability: OfferAvailability;
  clusterPrettyName: string;
  create: boolean;
  edit: boolean;
  setOfferName: Dispatch<SetStateAction<string>>;
  setOfferType: Dispatch<SetStateAction<OfferType>>;
  setOfferStatus: Dispatch<SetStateAction<boolean>>;
  setDescription: Dispatch<SetStateAction<string>>;
  setEdit: Dispatch<SetStateAction<boolean>>;
  publishOrUpdateOffer: () => void;
}

const typeOptions = [
  {
    id: 'storage',
    name: 'Storage',
  },
  {
    id: 'computational',
    name: 'Computational',
  },
  {
    id: 'gpu',
    name: 'Gpu',
  },
];

const MySummary: FC<MySummaryProps> = props => {
  const theme = useTheme();

  const {
    offerID,
    offerName,
    offerStatus,
    offerType,
    availability,
    description,
    clusterPrettyName,
    edit,
    create,
    setDescription,
    setOfferName,
    setOfferStatus,
    setOfferType,
    setEdit,
    publishOrUpdateOffer,
  } = props;

  const [showID, setShowID] = useState(false);

  const getAvailabilityLabel = (
    availability: OfferAvailability
  ): JSX.Element => {
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

  const handleOfferStatus = event => {
    setOfferStatus(event.target.checked);
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
                  {!edit ? (
                    <Typography align="center" variant="subtitle2" noWrap>
                      {offerName}
                    </Typography>
                  ) : (
                    <TextField
                      sx={{
                        width: '100%',
                      }}
                      color="primary"
                      required
                      value={offerName}
                      onChange={e => setOfferName(e.target.value)}
                      placeholder="Insert the offer name"
                    />
                  )}
                </Grid>
                <Grid sm item>
                  <Typography align="center" variant="h3" noWrap>
                    PROVIDER
                  </Typography>
                  <Typography align="center" variant="subtitle2" noWrap>
                    {clusterPrettyName}
                  </Typography>
                </Grid>
                <Grid sm item>
                  <Typography align="center" variant="h3" noWrap>
                    TYPE
                  </Typography>
                  {!edit ? (
                    <Typography align="center" variant="subtitle2" noWrap>
                      {getTypeLabel(offerType)}
                    </Typography>
                  ) : (
                    <FormControl fullWidth variant="outlined">
                      <Select
                        color="primary"
                        value={offerType || 'all'}
                        onChange={e =>
                          setOfferType(e.target.value as OfferType)
                        }
                        autoWidth
                      >
                        {typeOptions.map(type => (
                          <MenuItem key={type.id} value={type.id}>
                            {type.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </Grid>
                <Grid sm item>
                  <Typography align="center" variant="h3" noWrap>
                    AVAILABILITY
                  </Typography>
                  <Typography align="center" variant="subtitle2" noWrap>
                    {getAvailabilityLabel(availability)}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={3} paddingY={2}>
                <Grid sm item>
                  <Typography align="center" variant="h3" noWrap>
                    DESCRIPTION
                  </Typography>
                  {!edit ? (
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
                  ) : (
                    <TextField
                      multiline
                      minRows={3}
                      sx={{
                        width: '100%',
                      }}
                      color="primary"
                      required
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Insert the offer description"
                    />
                  )}
                </Grid>
              </Grid>
              <Grid container spacing={3} paddingTop={2} paddingX={10}>
                <Grid
                  sm
                  item
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    variant="h2"
                    sx={{
                      color: offerStatus
                        ? theme.colors.success.main
                        : theme.colors.error.main,
                    }}
                    //color={offerStatus ? 'success' : 'error'}
                  >
                    {offerStatus ? 'Enabled' : 'Disabled'}
                  </Typography>

                  <Switch
                    disabled={!edit}
                    edge="end"
                    color="primary"
                    onChange={handleOfferStatus}
                    checked={offerStatus}
                  />
                </Grid>
                <Grid sm item>
                  {!edit ? (
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() => setEdit(true)}
                    >
                      Edit
                    </Button>
                  ) : (
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={publishOrUpdateOffer}
                    >
                      Save
                    </Button>
                  )}
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Card>
    </>
  );
};

export default MySummary;
