import express from "express";

import { lucia } from "../../db/auth.js";
import Users from "../../models/users.js";
import { Origin } from "../../utils/auth.js";
const route = express.Router();

let initial_data = {
  layout: false,
  notheme: false,
  status: "success",
  title: "Coffees",
  email: ""
};

route.post("/partials/login", Origin, async (req, res, next) => {
  let data = req.body;
  let helper = { ...initial_data, title: "Coffees Login", content: "Login pages" };
  let login = await Users.login(data.email, data.password);
  let result;

  if (login === "Email not found") {
    result = res.render("auth/login-form", {
      ...helper,
      status: "error",
      messages: login,
    });
    result && res.send(result);
    return;
  } else if (login === "Incorrect password") {
    result = res.render("auth/login-form", {
      ...helper,
      status: "error",
      messages: login,
      email: data.email
    });
    result && res.send(result);
    return;
  } else if (!login) {
    result = res.render("auth/login-form", {
      ...helper,
      status: "error",
      messages: "Login Error",
      email: data.email
    });
    result && res.send(result);
    return;
  } else {
    delete data.password;
    data.userId = login;
    const session = await lucia.createSession(login, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    res.header("Set-Cookie", sessionCookie.serialize());
    res.cookie(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    res.header({ "Hx-redirect": "/" }).send("login successful!");
    return;
  }

});

route.post("/partials/register", Origin, async (req, res, next) => {
  let data = req.body;

  let helper = { ...initial_data, title: "Coffees Register", content: "Register pages" };
  let register = await Users.register(data.name, data.email, data.password);
  let result;

  if (register === "Email already register, please login") {
    result = res.render("auth/register-form", {
      ...helper,
      status: "error",
      messages: register,
    });
    result && res.send(result);
    return;
  } else if (register) {
    delete data.password;
    data.userId = register;
    const session = await lucia.createSession(register, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    res.header("Set-Cookie", sessionCookie.serialize());
    res.cookie(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    res.header({ "Hx-redirect": "/" }).send("register successful!");
    return;
  } else {
    result = res.render("auth/register-form", {
      ...helper,
      messages: "register failed",
      status: "error",
      email: data.email
    });
    result && res.send(result);
    return;
  }
});


route.get("/logout", async (req, res, next) => {
  if (!res.locals.session) {
    return res.redirect("/login");
  }

  await lucia.invalidateSession(res.locals.session.id);

  const sessionCookie = lucia.createBlankSessionCookie();
  res.header("Set-Cookie", sessionCookie.serialize());
  res.cookie(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  res.redirect("/login");
  return;
});



export default route;