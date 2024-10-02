import express from "express";

import seeder from "./seeder.js";

const apiRouter = express.Router();

apiRouter.get("/users", (req, res) => {
  res.json({ users: ["user1", "user2"] });
});

apiRouter.get("/status", async (req, res, next) => {
  res.json({status:"success"});
});

apiRouter.use("/seeder",seeder);

export default apiRouter;