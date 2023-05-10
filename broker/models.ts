
export type Offer = {
  offerID: string;
  offerName: string;
  offerType: string;
  clusterPrettyName: string;
  description: string;
  plans: Plan[];
  created: number;
  status: boolean;
  clusterID?: string;
};

export type Plan = {
  planID: string;
  planName: string;
  planCost: number;
  planCostCurrency: string;
  planCostPeriod: string;
  planQuantity: number;
  resources: Resource;
};

export type Resource = {
  cpu?: string;
  memory?: string;
  storage?: string;
  gpu?: string;
};

export type Provider = {
  clusterID: string;
  clusterName: string;
  token: string;
  endpoint: string;
  clusterContractEndpoint: string;
};

export type Catalog = {
  clusterID: string;
  clusterName: string;
  token: string;
  endpoint: string;
  clusterContractEndpoint: string;
  offers: Offer[];
};
