import express from "express";

import { Protect } from "../../utils/auth.js";
import authApi from "./auth_partial.js";
import dashboardApi from "./dashboard/index.js";
const route = express.Router();

let initial_data = {
  status: "success",
  email: ""
};

route.use(authApi);
route.use(dashboardApi);

route.get("/login", async (req, res, next) => {
  res.setHeader("Content-Type", "text/html").status(200).render("auth/login", { ...initial_data, content: "Login pages" });
});
route.get("/register", async (req, res, next) => {
  res.setHeader("Content-Type", "text/html").status(200).render("auth/register", { ...initial_data, content: "Register pages" });
});
route.get("/helloworld", async (req, res, next) => {
  res.setHeader("Content-Type", "text/html").status(200).render("helloworld", { ...initial_data, title: "hello world", content: "hello world", });
});
route.get("/protect", Protect, async (req, res, next) => {
  res.setHeader("Content-Type", "text/html").status(200).render("helloworld", { ...initial_data, title: "hello world", content: "hello world", });
});

export default route;