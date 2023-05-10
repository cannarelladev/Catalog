import { Offer, OfferPlan } from './offer';
import { Provider } from './provider';

export type Contract = {
  contractID: string;
  seller: Provider;
  buyerID: string;
  offer: Offer;
  planID: string;
  created: number;
  enabled: boolean;
};
