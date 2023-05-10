const api = `/api`;

const refreshLiqoData = async () => {
  const response = await fetch(`${api}/data/refreshLiqo`);
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    throw new Error(data.message);
  }
};

const deleteLiqoData = async () => {
  const response = await fetch(`${api}/data/deleteLiqo`);
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    throw new Error(data.message);
  }
};

const clearConnector = async () => {
  const response = await fetch(`${api}/data/clearConnector`);
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    throw new Error(data.message);
  }
};

const clearContracts = async () => {
  const response = await fetch(`${api}/data/clearContracts`);
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    throw new Error(data.message);
  }
};

const clearOffers = async () => {
  const response = await fetch(`${api}/data/clearOffers`);
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    throw new Error(data.message);
  }
};

const clearBrokers = async () => {
  const response = await fetch(`${api}/data/clearBrokers`);
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    throw new Error(data.message);
  }
};

const resetBrokers = async () => {
  const response = await fetch(`${api}/data/resetBrokers`);
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    throw new Error(data.message);
  }
};

const resetConnector = async () => {
  const response = await fetch(`${api}/data/resetConnector`);
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    throw new Error(data.message);
  }
};

const hardReset = async () => {
  const response = await fetch(`${api}/data/hardReset`);
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    throw new Error(data.message);
  }
};

export const API = {
  refreshLiqoData,
  deleteLiqoData,
  clearConnector,
  clearContracts,
  clearOffers,
  clearBrokers,
  resetBrokers,
  resetConnector,
  hardReset,
};
