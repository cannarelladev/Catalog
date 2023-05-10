import { Grid, Typography, useTheme } from '@mui/material';
import { Cpu, Gpu, Memory, Storage } from 'src/models/offer';

const getCpuDetails = (cpu: Cpu): JSX.Element => {
  const theme = useTheme();
  const map = {
    core: {
      text: 'Core',
      unit: '',
    },
    architecture: {
      text: 'Arch',
      unit: '',
    },
    frequency: {
      text: 'Frequecy',
      unit: 'Ghz',
    },
    manufacturer: {
      text: 'Manufacturer',
      unit: '',
    },
    model: {
      text: 'Model',
      unit: '',
    },
    threads: {
      text: 'Threads',
      unit: '',
    },
  };

  let details = [];

  for (const key in cpu) {
    if (cpu[key]) {
      details.push(
        <Grid item pr={5} columns={6} maxWidth="50%" key={key}>
          <Typography
            gutterBottom
            variant="caption"
            sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}
          >
            {map[key].text.toUpperCase()}
          </Typography>
          {key == 'model' ? (
            <Typography variant="h5">{cpu[key]}</Typography>
          ) : (
            <Typography variant="h3">
              {cpu[key]}
              {map[key].unit}
            </Typography>
          )}
        </Grid>
      );
    }
  }

  return (
    <>
      <Typography variant="h3">CPU</Typography>
      <Grid container pt={2} display="flex" justifyContent="space-between">
        {details}
      </Grid>
    </>
  );
};

const getMemoryDetails = (memory: Memory): JSX.Element => {
  const theme = useTheme();
  const map = {
    size: {
      text: 'Size',
      unit: 'GB',
    },
    frequency: {
      text: 'Frequency',
      unit: 'Ghz',
    },
    type: {
      text: 'Type',
      unit: '',
    },
    manufacturer: {
      text: 'Manufacturer',
      unit: '',
    },
  };

  let details = [];

  for (const key in memory) {
    if (memory[key]) {
      details.push(
        <Grid item pr={5} columns={6} maxWidth="50%" key={key}>
          <Typography
            gutterBottom
            variant="caption"
            sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}
          >
            {map[key].text.toUpperCase()}
          </Typography>
          {key == 'model' ? (
            <Typography variant="h5">{memory[key]}</Typography>
          ) : (
            <Typography variant="h3">
              {memory[key]}
              {map[key].unit}
            </Typography>
          )}
        </Grid>
      );
    }
  }

  return (
    <>
      <Typography variant="h3">Memory</Typography>
      <Grid container pt={2} display="flex" justifyContent="space-between">
        {details}
      </Grid>
    </>
  );
};

const getGpuDetails = (gpu: Gpu): JSX.Element => {
  const theme = useTheme();
  const map = {
    core: {
      text: 'Core',
      unit: '',
    },
    frequency: {
      text: 'Frequecy',
      unit: 'Ghz',
    },
    manufacturer: {
      text: 'Manufacturer',
      unit: '',
    },
    model: {
      text: 'Model',
      unit: '',
    },
    memory: {
      text: 'Memory',
      unit: 'GB',
    },
    type: {
      text: 'Type',
      unit: '',
    },
  };

  let details = [];

  for (const key in gpu) {
    if (gpu[key]) {
      details.push(
        <Grid item pr={5} columns={6} maxWidth="50%" key={key}>
          <Typography
            gutterBottom
            variant="caption"
            sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}
          >
            {map[key].text.toUpperCase()}
          </Typography>
          {key == 'model' ? (
            <Typography variant="h5">{gpu[key]}</Typography>
          ) : (
            <Typography variant="h3">
              {gpu[key]}
              {map[key].unit}
            </Typography>
          )}
        </Grid>
      );
    }
  }

  return (
    <>
      <Typography variant="h3">GPU</Typography>
      <Grid container pt={2} display="flex" justifyContent="space-between">
        {details}
      </Grid>
    </>
  );
};

const getStorageDetails = (storage: Storage): JSX.Element => {
  const theme = useTheme();
  const map = {
    size: {
      text: 'Size',
      unit: 'GB',
    },
    frequency: {
      text: 'Frequency',
      unit: 'Ghz',
    },
    type: {
      text: 'Type',
      unit: '',
    },
    manufacturer: {
      text: 'Manufacturer',
      unit: '',
    },
  };

  let details = [];

  for (const key in storage) {
    if (storage[key]) {
      details.push(
        <Grid item pr={5} columns={6} maxWidth="50%" key={key}>
          <Typography
            gutterBottom
            variant="caption"
            sx={{ fontSize: `${theme.typography.pxToRem(16)}` }}
          >
            {map[key].text.toUpperCase()}
          </Typography>
          {key == 'model' ? (
            <Typography variant="h5">{storage[key]}</Typography>
          ) : (
            <Typography variant="h3">
              {storage[key]}
              {map[key].unit}
            </Typography>
          )}
        </Grid>
      );
    }
  }

  return (
    <>
      <Typography variant="h3">Storage</Typography>
      <Grid container pt={2} display="flex" justifyContent="space-between">
        {details}
      </Grid>
    </>
  );
};

export { getCpuDetails, getGpuDetails, getMemoryDetails, getStorageDetails };
