import express from "express";

import seeder from "../../models/seeder.js";

const apiRouter = express.Router();

apiRouter.get("/users", async (req, res, next) => {
  let result = await seeder.Users();
  res.send(result);
      return;
  });

apiRouter.get("/roles", async (req, res, next) => {
  let result = await seeder.Roles();
  res.send(result);
      return;
  });

  apiRouter.get("/userrole", async (req, res, next) => {
  let result = await seeder.UserRole();
  res.send(result);
      return;
  });

  apiRouter.get("/add-user-role/:user_id/:role_id", async (req, res, next) => {
  let result = await seeder.AddUserRole(req.params.user_id,req.params.role_id);
  if(result.status === false){
    res.status(404).json(result);
  } else {
    res.status(200).json({status:"success", messages: "success input user_role"});
  }
      return;
  });

apiRouter.get("/seeder", (req, res) => {
  res.json({ users: ["user1", "user2"] });
});

export default apiRouter;