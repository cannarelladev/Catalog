import { generateClusterCatalog } from "./utils";
// Customer APIs

import cookieParser from "cookie-parser";
import express from "express";
import ews from "express-ws";
import jwt from "jsonwebtoken";
import { Db } from "mongodb";
import { jwtSecret } from "./auth";
import { Offer, Provider } from "./models";
import { updatesEmitter as updates } from "./provider";

export function registerCustomerRoutes(app: express.Application, db: Db) {
  app.use(cookieParser());

  const expressWs = ews(app);
  expressWs.app.ws("/subscribe", async function (ws, req) {
    // We use cookie-based JWT because header-based JWT doesn't work with ws: https://stackoverflow.com/questions/4361173/http-headers-in-websockets-client-api
    let credentials;
    try {
      const jwtToken = req.cookies["jwt-token"];
      credentials = jwt.verify(jwtToken, jwtSecret);
      // todo: further authentication?
      if (!credentials) {
        ws.send(
          '{"error":"A valid JWT cookie is required: please call /authenticate."}',
          () => ws.close()
        );
        return;
      }
    } catch (e) {
      ws.close();
      return;
    }
    // Find all offers except the one with the given ID
    const clusters = await db
      .collection("clusters")
      .find<Provider>(
        { _id: { $ne: credentials.clusterID } },
        { projection: { _id: 0 } }
      )
      .toArray();

    // Find all offers except the ones from the cluster corresponding to the credentials
    const offers = await db
      .collection("offers")
      .find<Offer>(
        { clusterID: { $ne: credentials.clusterID } },
        { projection: { _id: 0 } }
      )
      .toArray();

    // Map the catalog for each cluster
    const catalog = clusters.reduce((acc, cluster) => {
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

    ws.send(JSON.stringify(catalog));
  });

  async function onUpdate({ clusterID }: { clusterID: string }) {
    // Broadcast the new catalog for this cluster ID, to all customers
    const catalog = await generateClusterCatalog(db, clusterID);

    const response = JSON.stringify(catalog);
    const clients = Array.from(expressWs.getWss().clients);
    try {
      await Promise.all(clients.map(async (client) => client.send(response)));
    } catch (e) {
      console.error("Could not send some updates:", e);
    }
  }
  updates.on("update", onUpdate);
  updates.on("delete", onUpdate);
}
