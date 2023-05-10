import { Resources } from './offer';
import { OfferPlan } from 'src/models/offer';
import { Offer, Catalog, Provider } from 'src/models';

/* const mapJSONToCatalog = (json: any): Catalog => {
  return {
    clusterID: json['clusterID'],
    clusterName: json['clusterName'],
    token: json['token'],
    endpoint: json['endpoint'],
    offers: json['offers'].map(mapJSONToOffer),
  };
};

const mapJSONToOffer = (json: any): Offer => {
  return {
    offerID: json['offer-id'],
    offerName: json['offer-name'],
    offerType: json['offer-type'],
    status: json['offer-status'] ? JSON.parse(json['offer-status']) : true,
    description: json['description'],
    created: json['created'],
    plans: json['plans'].map(mapJSONToOfferPlan),
  };
};

const mapJSONToOfferPlan = (json: any): OfferPlan => {
  return {
    planID: json['plan-id'],
    planName: json['plan-name'],
    planCost: json['plan-cost'],
    planCostCurrency: json['plan-cost-currency'],
    planCostPeriod: json['plan-cost-period'],
    planQuantity: json['plan-quantity'],
    resources: mapJSONToResources(json['plan-resources']),
  };
};

const mapJSONToResources = (json: any): Resources => {
  let resources: Resources = {};
  if (json['cpu']) resources.cpu = json['cpu'];
  if (json['memory']) resources.memory = json['memory'];
  if (json['gpu']) resources.gpu = json['gpu'];
  if (json['storage']) resources.storage = json['storage'];
  return resources;
}; */

const mapJSONToCatalog = (json: any): Catalog => {
  return {
    clusterID: json.clusterID,
    clusterName: json.clusterName,
    token: json.token,
    endpoint: json.endpoint,
    clusterContractEndpoint: json.clusterContractEndpoint,
    clusterPrettyName: json.clusterPrettyName,
    offers: json.offers ? json.offers.map(mapJSONToOffer) : [],
  };
};

const mapJSONToOffer = (json: any): Offer => {
  return {
    offerID: json.offerID,
    offerName: json.offerName,
    offerType: json.offerType,
    clusterPrettyName: json.clusterPrettyName,
    status: json.status,
    description: json.description,
    created: json.created,
    plans: json.plans.map(mapJSONToOfferPlan),
  };
};

const mapJSONToOfferPlan = (json: any): OfferPlan => {
  return {
    planID: json.planID,
    planName: json.planName,
    planCost: json.planCost,
    planCostCurrency: json.planCostCurrency,
    planCostPeriod: json.planCostPeriod,
    planQuantity: parseInt(json.planQuantity),
    resources: mapJSONToResources(json.resources),
  };
};

const mapJSONToResources = (json: any): Resources => {
  let resources: Resources = {};
  if (json.cpu) resources.cpu = json.cpu;
  if (json.memory) resources.memory = json.memory;
  if (json.gpu) resources.gpu = json.gpu;
  if (json.storage) resources.storage = json.storage;
  return resources;
};

const mapJSONToProvider = (json: any): Provider => {
  return {
    clusterID: json.clusterID,
    clusterName: json.clusterName,
    endpoint: json.endpoint,
    token: json.token,
  };
};

export const Mappers = {
  mapJSONToOffer,
  mapJSONToOfferPlan,
  mapJSONToResources,
  mapJSONToCatalog,
  mapJSONToProvider,
};
