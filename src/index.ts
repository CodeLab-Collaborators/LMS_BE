import express, { Application } from "express";
import { appConfig } from "./app";
import { dbConfig } from "../config/DB";
import { envVariable } from "../config/envVariable";

const app: Application = express();

(async () => {
  try {
    await dbConfig();
    appConfig(app);
    app.listen(envVariable.PORT, () =>
      console.log(`server listening on ${envVariable.PORT}`)
    );
  } catch (error) {
    console.log(error);
  }
})();
