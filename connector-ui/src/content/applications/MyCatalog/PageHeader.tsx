import {
  Avatar,
  Button,
  Grid,
  Typography,
  styled,
  useTheme,
} from '@mui/material';
import { NavLink as RouterLink } from 'react-router-dom';

import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import StorefrontIcon from '@mui/icons-material/Storefront';

const AvatarPrimary = styled(Avatar)(
  ({ theme }) => `
      background: ${theme.colors.primary.lighter};
      color: ${theme.colors.primary.main};
      width: ${theme.spacing(7)};
      height: ${theme.spacing(7)};
`
);

function PageHeader() {
  const theme = useTheme();
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item display="flex">
        <Grid item>
          <AvatarPrimary
            sx={{
              mr: 2,
              width: theme.spacing(8),
              height: theme.spacing(8),
              fontSize: '2rem',
            }}
            variant="rounded"
          >
            <StorefrontIcon fontSize="large" />
          </AvatarPrimary>
        </Grid>
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            My Offers
          </Typography>
          <Typography variant="subtitle2">
            Manage your resource Offers and Plans
          </Typography>
        </Grid>
      </Grid>
      <Grid item>
        <Button
          sx={{ mt: { xs: 2, md: 0 } }}
          variant="contained"
          startIcon={<AddTwoToneIcon fontSize="small" />}
          component={RouterLink}
          to={'/management/myoffer/create'}
        >
          Add a new Offer
        </Button>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
