import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { Box, Button, Card, Grid, styled, Typography } from '@mui/material';
import { Dispatch, FC, SetStateAction, useEffect, useState } from 'react';
import { OfferPlan } from 'src/models/offer';
import { swapPlans } from 'src/utils';
import MyPlan from './MyPlan';
import NewPlan from './NewPlan';

const EmptyResultsWrapper = styled('img')(
  ({ theme }) => `
      max-width: 100%;
      width: ${theme.spacing(66)};
      height: ${theme.spacing(34)};
`
);

interface IMyPlansProps {
  offerID: string;
  offerPlans: OfferPlan[];
  edit: boolean;
  create: boolean;
  setOfferPlans: Dispatch<SetStateAction<OfferPlan[]>>;
}

const MyPlans: FC<IMyPlansProps> = props => {
  const { offerID, offerPlans, edit, create, setOfferPlans } = props;
  const [open, setOpen] = useState<boolean>(false);

  const swap = (indexA: number, indexB: number) => {
    setOfferPlans([...swapPlans(offerPlans, indexA, indexB)]);
  };

  const remove = (index: number) => {
    const newOfferPlans = offerPlans.filter((_, i) => i !== index);
    setOfferPlans([...newOfferPlans]);
  };

  const addPlan = (plan: OfferPlan) => {
    const newOfferPlans = [...offerPlans, plan];
    setOfferPlans([...newOfferPlans]);
  };

  const planCards = offerPlans.map((plan, i) => (
    <MyPlan
      plan={plan}
      id={i}
      key={i}
      length={offerPlans.length}
      edit={edit}
      create={create}
      swapLeft={() => swap(i, i - 1)}
      swapRight={() => swap(i, i + 1)}
      remove={() => remove(i)}
    />
  ));

  useEffect(() => {
    setOfferPlans(offerPlans);
  }, [offerPlans]);

  return (
    <>
      <NewPlan
        open={open}
        setOpen={setOpen}
        addPlan={addPlan}
        onClose={() => setOpen(false)}
        length={offerPlans.length}
        offerID={offerID}
      />
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          pb: 3,
        }}
      >
        <Typography variant="h3">Plans</Typography>
        {(edit || create) && offerPlans.length < 7 && (
          <Button
            sx={{ mt: { xs: 2, md: 0 } }}
            variant="outlined"
            startIcon={<AddTwoToneIcon fontSize="small" />}
            onClick={() => setOpen(true)}
          >
            Add a new Plan
          </Button>
        )}
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

export default MyPlans;
