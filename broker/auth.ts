import { Db } from "mongodb";
import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { expressjwt } from "express-jwt";
import { Provider } from "./models";

export const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret)
  throw Error(
    "Please set the environment variable JWT_SECRET to a passphrase."
  );
export const brokerID = process.env.BROKER_UUID;
if (!/^[0-9a-f-]+$/i.test(brokerID))
  throw Error("Please set the environment variable BROKER_UUID to a UUID.");

export const jwtMiddleware = expressjwt({
  secret: jwtSecret,
  algorithms: ["HS256"],
});

export function registerAuthenticationRoutes(app: express.Application, db: Db) {
  app.use(express.json());
  app.post("/authenticate", async function (req: Request, res: Response) {
    const providerCredentials = req.body as Provider;
    console.log("Received authentication request for", providerCredentials);
    const expectedKeys = [
      "clusterID",
      "clusterName",
      "token",
      "endpoint",
      "clusterContractEndpoint",
    ];
    if (expectedKeys.some((key) => !(key in providerCredentials))) {
      console.log("Invalid authentication request", providerCredentials);
      res.status(400).json({ status: "error", error: "Malformed input" });
      return;
    }

    // todo: authentication logic
    try {
      // create cluster document if it does not exist
      await db.collection("clusters").updateOne(
        {
          _id: providerCredentials.clusterID,
        },
        { $setOnInsert: providerCredentials },
        { upsert: true }
      );
    } catch (e) {
      res.status(500).json({ status: "error", error: e });
      return;
    }
    const token = jwt.sign(providerCredentials, jwtSecret);
    res.cookie("jwt-token", token, { sameSite: "none" });
    res.json({ status: "OK", brokerID, token });
  });
}
