import { Provider } from './provider';

export type OfferStatus = 'enabled' | 'disabled';

export enum OfferAvailability {
  available = 'available',
  limited = 'limited',
  finished = 'finished',
}

export type OfferType = 'storage' | 'computational' | 'gpu';

export type Resources = {
  cpu?: string;
  memory?: string;
  storage?: string;
  gpu?: string;
};

export type Cpu = {
  core: number;
  threads?: number;
  frequency?: number;
  architecture?: string;
  model?: string;
  manufacturer?: string;
};

export type Memory = {
  size: number;
  type?: string;
  frequency?: number;
  manufacturer?: string;
};

export type Storage = {
  size: number;
  type?: string;
  manufacturer?: string;
};

export type Gpu = {
  core: number;
  type?: string;
  memory?: number;
  frequency?: number;
  model?: string;
  manufacturer?: string;
};

export type OfferPlan = {
  planID: string;
  planName: string;
  planCost: number;
  planCostCurrency: string;
  planCostPeriod: string;
  planQuantity: number;
  resources: Resources;
};

export type Offer = {
  offerID: string;
  offerName: string;
  offerType: OfferType;
  description: string;
  status: boolean;
  availability?: OfferAvailability;
  plans: OfferPlan[];
  clusterID?: string;
  clusterName?: string;
  clusterContractEndpoint?: string;
  clusterPrettyName?: string;
  endpoint?: string;
  token?: string;
  created: number;
};
