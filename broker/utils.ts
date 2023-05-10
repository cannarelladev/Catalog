import { Db } from "mongodb";
import { Offer, Provider } from "./models";

export const generateClusterCatalog = async (
  database: Db,
  clusterID: string
) => {
  const cluster = await database.collection("clusters").findOne<Provider>(
    {
      _id: clusterID,
    },
    { projection: { _id: 0 } }
  );

  const offers = await database
    .collection("offers")
    .find<Offer>(
      {
        clusterID: clusterID,
      },
      { projection: { _id: 0 } }
    )
    .toArray();

  const catalog = {
    ...cluster,
    offers,
  };
  console.log("Catalog for cluster", clusterID, "is", catalog);
  return catalog;
};
