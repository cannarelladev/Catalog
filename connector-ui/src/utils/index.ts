import { Offer, OfferAvailability, OfferPlan } from './../models/offer';
import { Catalog } from 'src/models/catalog';
import { Provider } from 'src/models/provider';
import { Contract } from 'src/models';

const catalogToProvider = (catalog: Catalog): Provider => {
  return {
    clusterID: catalog.clusterID,
    clusterName: catalog.clusterName,
    token: catalog.token,
    endpoint: catalog.endpoint,
  };
};

export const catalogsToProvidersList = (catalogs: Catalog[]): Provider[] => {
  return catalogs.map(catalogToProvider);
};

export const catalogToOffersMapper = (catalogs: Catalog[]): Offer[] => {
  return catalogs
    .map(catalog => {
      return catalog.offers.map(offer => {
        return {
          ...offer,
          clusterID: catalog.clusterID,
          clusterName: catalog.clusterName,
          endpoint: catalog.endpoint,
          clusterContractEndpoint: catalog.clusterContractEndpoint,
          token: catalog.token,
          availability: calculateAvailability(offer.plans),
        };
      });
    })
    .flat();
};

export const populateOffersDetails = (
  offers: Offer[],
  clusterID: string,
  clusterName: string
): Offer[] => {
  return offers.map(offer => {
    return {
      ...offer,
      providerID: clusterID,
      providerName: clusterName,
      availability: calculateAvailability(offer.plans),
    };
  });
};

export const getProviderByID = (
  providers: Provider[],
  providerID: string
): Provider | undefined => {
  return providers.find(provider => provider.clusterID === providerID);
};

export const getOfferByID = (
  offers: Offer[],
  offerID: string
): Offer | undefined => {
  return offers.find(offer => offer.offerID === offerID);
};

export const calculateAvailability = (plans: OfferPlan[]) => {
  const quantity = plans.reduce((acc, plan) => acc + plan.planQuantity, 0);
  return quantity == 0
    ? OfferAvailability.finished
    : quantity < 10
    ? OfferAvailability.limited
    : OfferAvailability.available;
};

export const swapPlans = (arr: OfferPlan[], indexA: number, indexB: number) => {
  const temp = arr[indexA];
  arr[indexA] = arr[indexB];
  arr[indexB] = temp;
  return arr;
};

export const groupContractByProvider = (contracts: Contract[]) => {
  return contracts.reduce((acc, contract) => {
    const providerID = contract.seller.clusterID;
    if (!acc[providerID]) {
      acc[providerID] = [];
    }
    acc[providerID].push(contract);
    return acc;
  }, {} as Record<string, Contract[]>);
};
