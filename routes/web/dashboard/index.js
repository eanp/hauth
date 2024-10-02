import express from "express";

import { lucia } from "../../../db/auth.js";
import Role from "../../../models/roles.js";
import Users from "../../../models/users.js";
import { Protect } from "../../../utils/auth.js";
import { generatePagination } from "../../../utils/meta.js";
const route = express.Router();

let initial_data = {
  status: "success",
  email: "",
  messageAlert: ""
};


route.get("/", Protect, async (req, res, next) => {
  console.log("cookie", res.locals);
  res.setHeader("Content-Type", "text/html").status(200).render("dashboard/index", { ...initial_data, content: "index pages" });
});

route.get("/role", Protect, async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 2;
  const offset = (page - 1) * limit;

  const roleData = await Role.getRole(limit, offset);

  const { roleDataResult: data, total } = roleData;

  const totalPages = Math.ceil(total / limit);
  const pagination = generatePagination(page, totalPages);

  const meta = {
    currentPage: page,
    itemsPerPage: limit,
    startItems: offset + 1,
    endItems: (total < offset + limit) ? total : offset + limit,
    lengthItems: data.length,
    totalItems: total,
    totalPages: totalPages,
    prevPages: 0,
    nextPages: 0,
    pagination
  };

  if (!roleData) {
    return res.status(404).json({});
  }
  // return res.status(200).json({data,meta});

  res.setHeader("Content-Type", "text/html").status(200).render("dashboard/role", { ...initial_data, content: "index pages", meta, data, path: "role" });
  return;
});

const getUserData = async (req,res) => {
  let searchValue = req.query.search || "";
  searchValue = await searchValue.replace(/[^a-zA-Z0-9]/g, "");
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  console.log(searchValue);
  const userData = await Users.store(limit, offset, searchValue);

  const { userDataResult: data, total } = userData;

  const totalPages = Math.ceil(total / limit);
  const pagination = generatePagination(page, totalPages);

  const meta = {
    currentPage: page,
    itemsPerPage: limit,
    startItems: offset + 1,
    endItems: (total < offset + limit) ? total : offset + limit,
    lengthItems: data.length,
    totalItems: total,
    totalPages: totalPages,
    prevPages: 0,
    nextPages: 0,
    pagination
  };

  if (!userData) {
    return res.status(404).json({});
  }

  const tablehead = [{ name: "id", type: "sortable" }, { name: "name", type: "sortable" }, { name: "email", type: "sortable" }, { name: "created_at", type: "sortable" }, { name: "updated_at", type: "sortable" }, { name: "action", type: "sortable" }];

  res.setHeader("Content-Type", "text/html").status(200).render("dashboard/user", { ...initial_data, content: "index pages", meta, data, path: "user", tablehead });
};

route.get("/user", Protect, async (req, res, next) => {
  await getUserData(req,res);
  return;
});

route.get("/user/detail/:id", Protect, async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  if (!userData) {
    return res.status(404).json({});
  }
  // return res.status(200).json({data,meta});

  res.setHeader("Content-Type", "text/html").status(200).render("dashboard/user", { ...initial_data, content: "index pages", meta, data });
  return;
});

route.get("/user/create", Protect, async (req, res, next) => {
  res.setHeader("Content-Type", "text/html").status(200).render("dashboard/user-create", { ...initial_data, content: "index pages" });
  return;
});

route.post("/user", Protect, async (req, res, next) => {
  let data = req.body;

  let helper = { ...initial_data };
  let createUser = await Users.create(data.name, data.email, data.password);
  let result;

  if (createUser === "Email already used") {
    result = res.render("dashboard/user-create-form", {
      ...helper,
      messages: "Email already used",
      status: "error",
      name: data.name
    });
    result && res.send(result);
    return;
  } else if (createUser) {
    // success
    req.session.message = `${data.name} submitted successfully.`;
    res.header({ "Hx-redirect": "/user", "Hx-Push-Url": "/user", "HX-Target": "content-user"}).send();
    return;
  } else {
    // error
    result = res.render("dashboard/user-create-form", {
      ...helper,
      messages: "Error create user",
      status: "error",
      name: data.name
    });
    result && res.send(result);
    return;
  }
});


export default route;