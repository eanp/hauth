import { generateId } from "lucia";
import { Argon2id } from "oslo/password";

import { db } from "../db/db.js";

const getUserByEmail = "SELECT * FROM user WHERE email = ?";

const inputUser = "INSERT INTO user (id, email, password, name, created_at,updated_at) VALUES(?, ?, ?, ?, datetime('now'), datetime('now'))";

const inputRole = "INSERT INTO role (id, name, description) VALUES(?, ?, ?)";

const inputUserRole = "INSERT INTO user_role VALUES(@id, @user_id, @role_id)";

const getUsers = "SELECT * FROM user";
const getRoles = "SELECT * FROM role";

const initial_users = [
  { email: "admin@gmail.com", password: "admin", name: "admin" },
  { email: "merchant@gmail.com", password: "merchant", name: "merchant" },
  { email: "customer@gmail.com", password: "customer", name: "customer" },
  { email: "guest@gmail.com", password: "guest", name: "guest" },
];

const initial_roles = [
  {name: "admin", description: "Administrator" },
  {name: "merchant", description: "Merchant" },
  {name: "customer", description: "Customer" },
];

const Seeder = {
  Users: async () => {
    try {
      const existingUser = await db.prepare(getUserByEmail).get(initial_users[0].email);
      if (existingUser) {
        return "Users already seed";
      }

      const insertMany = db.transaction(async (users) => {
        for (const user of users) {
          const hashedPassword = await new Argon2id().hash(user.password);
          const userId = generateId(15);
          db.prepare(inputUser).run(userId, user.email, hashedPassword, user.name);
        }
      });
      await insertMany(initial_users);
      return "Users seeded successfully";
    }
    catch (err) {
      if (!db.inTransaction) throw err;
      console.log("err: ", err);
      return false;
    }
  },
  Roles: async () => {
    try {
      const insertMany = db.transaction(async (roles) => {
        for (const role of roles) {
          const roleId = generateId(15);
          db.prepare(inputRole).run(roleId, role.name, role.description);
        }
      });
      await insertMany(initial_roles);
      return "Roles seeded successfully";

    } catch (err) {
      if (!db.inTransaction) throw err;
      console.log("err: ", err);
      return false;
    }
  },
  UserRole: async () => {
    try{
      let users = db.prepare(getUsers).all();
      let roles = db.prepare(getRoles).all();
      return {users,roles};
    }
    catch (err) {
      console.log("err: ", err);
      return false;
    }
  },
  AddUserRole: async (user_id,role_id) => {
    try{
      const id = generateId(15);
      let res = db.prepare(inputUserRole).run({id,user_id,role_id});
      return res;
    }
    catch (err) {
      if(err?.code === "SQLITE_CONSTRAINT_FOREIGNKEY"){
        return {status:false, messages: "Wrong id key"};
      } else {
        console.log("err: ", err?.code ?? err);
        return {status:false, messages: err};
      }
    }
  }
};
export default Seeder;