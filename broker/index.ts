import express from "express";
import { Db, MongoClient } from "mongodb";
import { registerAuthenticationRoutes } from "./auth";
import { registerCustomerRoutes } from "./customer";
import { registerProviderRoutes } from "./provider";

const expressApp = express();
expressApp.use(express.json());

const httpPort = process.env.HTTP_PORT || 8000;

const mongoURL = process.env.MONGODB_URL || "mongodb://localhost:27017";
const mongoUser = process.env.MONGODB_USER;
const mongoPassword = process.env.MONGODB_PASSWORD;
if (mongoUser && mongoPassword) {
  mongoURL.replace("://", `://${mongoUser}:${mongoPassword}@`);
}
const mongoClient = new MongoClient(mongoURL);

async function mongoSetup(): Promise<Db> {
  console.log(`Connecting to ${mongoURL}...`);
  await mongoClient.connect();
  console.log(`Connected successfully!`);
  return mongoClient.db("liqo-broker-server");
}

mongoSetup()
  .then(async (db) => {
    registerAuthenticationRoutes(expressApp, db);
    registerProviderRoutes(expressApp, db);
    registerCustomerRoutes(expressApp, db);

    expressApp.listen(httpPort);
    console.log("Listening on port 8000");
  })
  .catch(console.error);
