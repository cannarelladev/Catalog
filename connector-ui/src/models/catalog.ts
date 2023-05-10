import { Offer } from './offer';

export type Catalog = {
  clusterID: string;
  clusterName: string;
  token: string;
  endpoint: string;
  clusterContractEndpoint?: string;
  clusterPrettyName?: string;
  offers: Offer[];
};
