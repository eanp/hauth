import { generateId } from "lucia";
import { Argon2id } from "oslo/password";

import { db } from "../db/db.js";
import { achiveChecker, getUser, getUserByEmail, inputUser, paginationQuery, totalQuery } from "../db/query.js";
import { searchUser } from "../db/query.js";

const Users = {
  login: async (email, password) => {
    try {
      const existingUser = db.prepare(getUserByEmail).get(email);
      if (!existingUser) {
        return "Email not found";
      }
      const validPassword = await new Argon2id().verify(
        existingUser.password,
        password
      );
      if (!validPassword) {
        return "Incorrect password";
      }
      return existingUser.id;
    } catch (err) {
      console.log("err: ", err);
      return false;
    }
  },
  register: async (name, email, password) => {
    try {
      const existingUser = await db.prepare(getUserByEmail).get(email);
      if (existingUser) {
        return "Email already register, please login";
      }
      const hashedPassword = await new Argon2id().hash(password);
      const userId = generateId(15);
      db.prepare(inputUser).run({ id: userId, email, password: hashedPassword, name: name || "guest" });
      return userId;
    }
    catch (err) {
      console.log("err: ", err);
      return false;
    }
  },
  create: async (name, email, password) => {
    try {
      const existingUser = await db.prepare(getUserByEmail).get(email);
      if (existingUser) {
        return "Email already used";
      }
      const hashedPassword = await new Argon2id().hash(password);
      const userId = generateId(15);
      db.prepare(inputUser).run({ id: userId, email, password: hashedPassword, name: name || "guest" });
      return userId;
    }
    catch (err) {
      console.log("err: ", err);
      return false;
    }
  },
  store: async (limit, offset, searchValue) => {
    try {
      searchValue = `%${searchValue}%`;
      const userDataResult = searchValue ? db.prepare(`${getUser} ${searchUser} ${paginationQuery}`).all({ limit, offset, searchValue }) : db.prepare(`${getUser} ${paginationQuery} ${achiveChecker}`).all({ limit, offset });
      const [{ total }] = db.prepare(`${totalQuery} user ${searchUser}`).all({searchValue});
      const data = { userDataResult, total };
      return data;
    } catch (err) {
      console.log("err: ", err);
      return false;
    }
  },
  update: async (name, email, password) => {
    try {
      const existingUser = await db.prepare(getUserByEmail).get(email);
      if (existingUser) {
        return "Email already used";
      }
      const hashedPassword = await new Argon2id().hash(password);
      const userId = generateId(15);
      db.prepare(inputUser).run({ id: userId, email, password: hashedPassword, name: name || "guest" });
      return userId;
    }
    catch (err) {
      console.log("err: ", err);
      return false;
    }
  },
};
export default Users;