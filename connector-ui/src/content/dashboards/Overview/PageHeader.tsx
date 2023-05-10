import { Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

function PageHeader() {
  const user = {
    name: 'Admin',
    avatar: '/static/images/avatars/4.jpg',
  };
  const theme = useTheme();

  return (
    <Grid container alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          Welcome, {user.name}!
        </Typography>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
