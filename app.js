import bodyParser from "body-parser";
import * as dotenv from "dotenv";
import express from "express";
import expressLayouts from "express-ejs-layouts";
import morgan from "morgan";

import apiRouter from "./routes/api/index.js";
import webRouter from "./routes/web/index.js";
dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("layout", "partials/layout-main");
app.use(expressLayouts);
app.use(morgan(":method :url :status :res[content-length] - :response-time ms"));
app.use("/static", express.static("public", {
  maxAge: "86400"
}));

app.use("/", webRouter);
app.use("/api", apiRouter);

app.use((req, res, next) => {
  res.status(404).send("Sorry, page not found | 404");
});

app.listen(process.env.PORT, () =>
  console.log(`⚡️[server]: Server is running at http://localhost:${process.env.PORT}`)
);