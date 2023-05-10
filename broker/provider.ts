import { Catalog, Plan } from "./models";
// Provider APIs

import EventEmitter from "events";
import express, { Response } from "express";
import { ExpressJwtRequest } from "express-jwt";
import { Db } from "mongodb";
import { jwtMiddleware } from "./auth";
import { Offer, Provider } from "./models";

// updatesEmitter can be used to listen to changes in offers.
export const updatesEmitter = new EventEmitter();

export function registerProviderRoutes(app: express.Application, db: Db) {
  app.get(
    "/catalog",
    jwtMiddleware,
    async function (req: ExpressJwtRequest, res: Response) {
      const providerCredentials = req.auth as Provider;

      // Find all offers except the one with the given ID
      const clusters = await db
        .collection("clusters")
        .find<Provider>(
          { _id: { $ne: providerCredentials.clusterID } },
          { projection: { _id: 0 } }
        )
        .toArray();

      // Find all offers except the ones from the cluster corresponding to the credentials
      const offers = await db
        .collection("offers")
        .find<Offer>(
          {
            clusterID: { $ne: providerCredentials.clusterID },
          },
          { projection: { _id: 0 } }
        )
        .toArray();

      // Map the catalog for each cluster
      const catalog: Catalog[] = clusters.reduce((acc, cluster) => {
        const offersFromCluster = offers.filter(
          (offer) => offer.clusterID === cluster.clusterID
        );
        if (offersFromCluster.length) {
          acc.push({
            ...cluster,
            offers: offersFromCluster,
          });
        }
        return acc;
      }, []);

      res.json(catalog);
    }
  );

  app.post(
    "/offer/:id",
    jwtMiddleware,
    async function (req: ExpressJwtRequest, res: Response) {
      const peeringCredentials = req.auth as Provider;
      const offer: Offer = Object.assign(req.body);
      console.log(
        `Offer reveived from ${
          peeringCredentials.clusterName
        }: ${JSON.stringify(offer)}`
      );

      const expectedKeys = [
        "offerID",
        "offerName",
        "offerType",
        "clusterPrettyName",
        "description",
        "plans",
        "created",
      ];

      // Validate the input
      if (
        expectedKeys.some((key) => !(key in offer)) ||
        typeof offer["plans"] != typeof Array<Plan>()
      ) {
        res.status(400).json({
          error:
            "The input must contain the following keys: " +
            expectedKeys.join(", "),
        });
        console.log("Invalid Offer received");
        return;
      }

      try {
        // upsert
        const o = Object.assign({}, offer, {
          clusterID: peeringCredentials.clusterID,
        });
        await db
          .collection("offers")
          .updateOne({ _id: o.offerID }, { $set: o }, { upsert: true });
      } catch (e) {
        console.error(e);
        res.status(500).json({ status: "error", error: e });
        return;
      }

      updatesEmitter.emit("update", {
        clusterID: peeringCredentials.clusterID,
      });

      res.json({ status: "OK" });
    }
  );

  app.post(
    "/offers",
    jwtMiddleware,
    async function (req: ExpressJwtRequest, res: Response) {
      const peeringCredentials = req.auth as Provider;
      const offers = req.body as Offer[];
      console.log(
        `Offers reveived from ${
          peeringCredentials.clusterName
        }: ${JSON.stringify(offers)}`
      );
      const expectedKeys = [
        "offerID",
        "offerName",
        "offerType",
        "clusterPrettyName",
        "description",
        "plans",
        "created",
      ];

      // Validate the input
      for (const offer of offers) {
        if (
          expectedKeys.some((key) => !(key in offer)) ||
          typeof offer["plans"] != typeof Array<Plan>()
        ) {
          res.status(400).json({
            error:
              "The input must contain the following keys: " +
              expectedKeys.join(", "),
          });
          console.log("Invalid Offer received");
          return;
        }
      }

      for (const o of offers) {
        // upsert
        try {
          const offer = Object.assign({}, o, {
            clusterID: peeringCredentials.clusterID,
          });
          await db
            .collection("offers")
            .updateOne(
              { _id: offer.offerID },
              { $set: offer },
              { upsert: true }
            );
        } catch (e) {
          console.error(e);
          res.status(500).json({ status: "error", error: e });
          return;
        }
      }

      updatesEmitter.emit("update", {
        clusterID: peeringCredentials.clusterID,
      });

      res.json({ status: "OK" });
    }
  );

  app.delete(
    "/offer/:id",
    jwtMiddleware,
    async function (req: ExpressJwtRequest, res: Response) {
      const peeringCredentials = req.auth as Provider;
      const offerID = req.params.id;
      console.log("Deleting offer " + offerID);
      try {
        await db.collection("offers").deleteOne({ _id: offerID });
      } catch (e) {
        res.status(500).json({ status: "error", error: e });
        return;
      }
      console.log("Offer successfully deleted");

      updatesEmitter.emit("delete", {
        clusterID: peeringCredentials.clusterID,
      });

      res.json({ status: "OK" });
    }
  );

  app.delete(
    "/cluster",
    jwtMiddleware,
    async function (req: ExpressJwtRequest, res: Response) {
      const peeringCredentials = req.auth as Provider;
      const clusterID = peeringCredentials.clusterID;
      console.log("Deleting offers of cluster " + clusterID);
      try {
        await db.collection("offers").deleteMany({ clusterID: clusterID });
      } catch (e) {
        res.status(500).json({ status: "error", error: e });
        return;
      }
      console.log("Offers of cluster " + clusterID + " successfully deleted");

      console.log("Deleting cluster " + clusterID);
      try {
        await db.collection("clusters").deleteOne({ clusterID: clusterID });
      } catch (e) {
        res.status(500).json({ status: "error", error: e });
        return;
      }
      console.log("Cluster " + clusterID + " successfully deleted");

      updatesEmitter.emit("delete", {
        clusterID: clusterID,
      });

      res.json({ status: "OK" });
    }
  );
}
