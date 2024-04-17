import express from "express";
import { connection } from "./postgres/postgres.js";
import router from "./view/route.js";
import cors from "cors";

const app = express();

const port = 5000;

app.use(express.json()); //we parse the data using this

app.use(cors());

app.use(router);

app.listen(port, () => {
  console.log("server listening on ", +port);
});

connection();
