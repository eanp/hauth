import express from "express";
import session from "express-session";

import { lucia } from "../../db/auth.js";
import route from "./auth.js";

const webRouter = express.Router();

webRouter.use(session({
  secret: `${process.env.SESSION_KEY}`,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

webRouter.use((req, res, next) => {
  res.locals.message = req.session.message || "";
  delete req.session.message;
  next();
});

webRouter.use(async (req, res, next) => {
  const sessionId = lucia.readSessionCookie(req.headers.cookie ?? "");
  if (!sessionId) {
    res.locals.user = null;
    res.locals.session = null;
    return next();
  }

  const { session, user } = await lucia.validateSession(sessionId);
  if (session && session.fresh) {
    res.appendHeader("Set-Cookie", lucia.createSessionCookie(session.id).serialize());
  }
  if (!session) {
    res.appendHeader("Set-Cookie", lucia.createBlankSessionCookie().serialize());
  }
  res.locals.session = session;
  res.locals.user = user;
  res.locals.query = req.query;
  res.locals.url = req.originalUrl;
  return next();
});

webRouter.use(route);


export default webRouter;