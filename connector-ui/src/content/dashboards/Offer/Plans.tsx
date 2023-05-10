import { Box, Button, Card, Grid, styled, Typography } from '@mui/material';
import { FC } from 'react';
import { OfferPlan } from 'src/models/offer';
import PlanColumn from './PlanColumn';

const EmptyResultsWrapper = styled('img')(
  ({ theme }) => `
      max-width: 100%;
      width: ${theme.spacing(66)};
      height: ${theme.spacing(34)};
`
);
interface PlansProps {
  offerID: string;
  plans: OfferPlan[];
}

const Plans: FC<PlansProps> = props => {
  const { offerID, plans } = props;

  const planCards = plans.map((plan, i) => (
    <PlanColumn offerID={offerID} plan={plan} id={i} key={i} />
  ));

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
        <Typography variant="h3">Plans</Typography>
      </Box>
      <Grid
        container
        direction="row"
        justifyContent="justify"
        alignItems="stretch"
        spacing={3}
      >
        {planCards}
      </Grid>

      {!planCards && (
        <Card
          sx={{
            textAlign: 'center',
            p: 3,
          }}
        >
          <EmptyResultsWrapper src="/static/images/placeholders/illustrations/1.svg" />

          <Typography
            align="center"
            variant="h2"
            fontWeight="normal"
            color="text.secondary"
            sx={{
              mt: 3,
            }}
            gutterBottom
          >
            Click something, anything!
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              mt: 4,
            }}
          >
            Maybe, a button?
          </Button>
        </Card>
      )}
    </>
  );
};

export default Plans;
