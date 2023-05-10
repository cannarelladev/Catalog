import { Contract, Mappers, Offer, Provider } from 'src/models';
import Broker from '../models/broker';

const api = `/api`;

// OK
const getCatalogs = async () => {
  const response = await fetch(`${api}/catalog`);
  const catalogs = await response.json();
  if (response.ok) {
    if (catalogs) {
      return catalogs.map(Mappers.mapJSONToCatalog);
    }
    return [];
  } else {
    throw new Error(catalogs.message);
  }
};

// OK
const getBrokers = async () => {
  const response = await fetch(`${api}/brokers`);
  const data = await response.json();
  if (response.ok) {
    if (data) {
      return data;
    }
    return [];
  } else {
    throw new Error(data.message);
  }
};

// OK, check idempotency
const insertBroker = async (
  broker: Broker,
  handleMessage: (string) => void
) => {
  const response = await fetch(
    `${api}/brokers?path=${broker.brokerEndpoint}&name=${broker.brokerName}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(broker),
    }
  );
  const data = await response.json();
  if (response.ok) {
    handleMessage('Broker inserted');
    return data;
  } else {
    throw new Error(data.message);
  }
};

// seems OK
const deleteBroker = async (
  brokerID: string,
  handleMessage: (string) => void
) => {
  const response = await fetch(`${api}/brokers?id=${brokerID}`, {
    method: 'DELETE',
  });
  const data = await response.json();
  if (response.ok) {
    handleMessage('Broker deleted');
    return data;
  } else {
    throw new Error(data.message);
  }
};

const subscribeUnsubscribeBroker = async (
  brokerID: string,
  subscribe: number,
  handleMessage: (string) => void
) => {
  const response = await fetch(
    `${api}/brokersid=${brokerID}&subscribe=${subscribe}`,
    {
      method: 'PUT',
    }
  );
  const data = await response.json();
  if (response.ok) {
    handleMessage('Broker subscription updated');
    return data;
  } else {
    throw new Error(data.message);
  }
};

// OK
const getMyOffers = async () => {
  const response = await fetch(`${api}/offers`);
  const data = await response.json();
  if (response.ok) {
    if (data) {
      return data.map(Mappers.mapJSONToOffer);
    }
    return [] as Offer[];
  } else {
    throw new Error(data.message);
  }
};

//OK
const createOrUpdateMyOffer = async (
  offer: Offer,
  handleMessage: (string) => void
) => {
  const response = await fetch(`${api}/offers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': '*',
    },
    body: JSON.stringify(offer),
  });
  const data = await response.json();
  if (response.ok) {
    handleMessage('Offer created');
    return data;
  } else {
    throw new Error(data.message);
  }
};

// seems OK
const deleteMyOffer = async (
  offerID: string,
  handleMessage: (string) => void
) => {
  const response = await fetch(`${api}/offers?id=${offerID}`, {
    method: 'DELETE',
  });
  const data = await response.json();
  if (response.ok && data) {
    handleMessage('Offer deleted');
    return data;
  } else {
    throw new Error(data.message);
  }
};

const peerWithCluster = async (
  clusterParameters: Provider,
  handleMessage: (string) => void
) => {
  const response = await fetch(
    `${api}/peer?id=${clusterParameters.clusterID}&name=${clusterParameters.clusterName}&authtoken=${clusterParameters.token}&authurl=${clusterParameters.endpoint}`,
    {
      method: 'POST',
    }
  );
  const data = await response.json();
  if (response.ok) {
    handleMessage('Peering started');
    return data;
  } else {
    throw new Error(data.message);
  }
};

// OK
const getClusterParameters = async () => {
  const response = await fetch(`${api}/cluster/parameters`);
  const data = await response.json();
  if (response.ok && data) {
    return Mappers.mapJSONToProvider(data);
  } else {
    throw new Error(data.message);
  }
};

// OK
const getClusterPrettyName = async () => {
  const response = await fetch(`${api}/cluster/prettyname`);
  const data = await response.json();
  if (response.ok && data) {
    return JSON.parse(data);
  } else {
    throw new Error(data.message);
  }
};

// OK
const getContractEndpoint = async () => {
  const response = await fetch(`${api}/cluster/contractendpoint`);
  const data = await response.json();
  if (response.ok && data) {
    return JSON.parse(data);
  } else {
    throw new Error(data.message);
  }
};

// OK
const getInitStatus = async () => {
  const response = await fetch(`${api}/cluster/init`);
  //const responseClone = response.clone();
  try {
    const data = await response.json();
    if (response.ok && data) {
      return JSON.parse(data);
    } else {
      throw new Error(data.message);
    }
  } catch {
    /* const text = await responseClone.text()
    console.log(text); */
    throw new Error('Error while parsing Server response');
  }
};

// OK
const initCluster = async (
  clusterPrettyName: string,
  clusterContractEndpoint: string,
  handleMessage: (string) => void
) => {
  const response = await fetch(
    `${api}/cluster/init?prettyname=${clusterPrettyName}&endpoint=${clusterContractEndpoint}`,
    {
      method: 'POST',
    }
  );
  const result = await response.json();
  const data = JSON.parse(result);
  if (response.ok && result) {
    handleMessage('Catalog initialized');
    return data;
  } else {
    throw new Error(data.error);
  }
};

// OK
const setClusterPrettyName = async (
  prettyname: string,
  handleMessage: (string) => void
) => {
  const response = await fetch(`${api}/cluster/prettyname?id=${prettyname}`, {
    method: 'POST',
  });
  const data = await response.json();
  if (response.ok) {
    handleMessage('Cluster PrettyName updated');
    return data;
  } else {
    throw new Error(data.message);
  }
};

// OK
const setContractEndpoint = async (
  clusterContractEndpoint: string,
  handleMessage: (string) => void
) => {
  const response = await fetch(
    `${api}/cluster/contractendpoint?id=${clusterContractEndpoint}`,
    {
      method: 'POST',
    }
  );
  try {
    const data = await response.json();
    if (response.ok) {
      handleMessage('Contract Endpoint updated');
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch {
    /* const text = await responseClone.text()
    console.log(text); */
    throw new Error('Error while parsing Server response');
  }
};

// TO BE IMPLEMENTED Server-side
const getAvailableResources = async () => {
  const response = await fetch(`${api}/resources`);
  const data = await response.json();
  if (response.ok) {
    return data;
  } else {
    throw new Error(data.message);
  }
};

const buyOffer = async (
  seller: Provider,
  offerID: string,
  planID: string,
  handleMessage: (string) => void
) => {
  const response = await fetch(
    `${api}/contracts/buy?offer-id=${offerID}&plan-id=${planID}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(seller),
    }
  );
  try {
    const data = await response.json();
    if (response.ok && data) {
      handleMessage('Purchase request sent');
      console.log(data);
      return data;
    } else {
      console.log(data);
      throw new Error(data.message);
    }
  } catch {
    /* const text = await responseClone.text()
    console.log(text); */
    throw new Error('Error while parsing Server response');
  }
};

const getContracts = async () => {
  const response = await fetch(`${api}/contracts`);
  try {
    const data = await response.json();
    if (response.ok) {
      if (data) {
        return data;
      }
      return [] as Contract[];
    } else {
      throw new Error(data.message);
    }
  } catch {
    /* const text = await responseClone.text()
    console.log(text); */
    throw new Error('Error while parsing Server response');
  }
};

export const API = {
  getBrokers,
  insertBroker,
  deleteBroker,
  subscribeUnsubscribeBroker,
  getMyOffers,
  createMyOffer: createOrUpdateMyOffer,
  //updateMyOffer,
  deleteMyOffer,
  peerWithCluster,
  getClusterParameters,
  buyOffer,
  getCatalogs,
  getClusterPrettyName,
  setClusterPrettyName,
  getContractEndpoint,
  setContractEndpoint,
  getContracts,
  initCluster,
  getInitStatus,
};
