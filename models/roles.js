import { generateId } from "lucia";
import { Argon2id } from "oslo/password";

import { db } from "../db/db.js";
import { totalQuery } from "../db/query.js";

const pagination = "LIMIT @limit OFFSET @offset";
const order = "ORDER BY ${order_value}";

const inputRole = "INSERT INTO role (id, name, description) VALUES(?, ?, ?)";
const getRoles = "SELECT id, name, description FROM role";
const getRolesById = "SELECT  FROM role";
const deleteRoles = "SELECT * FROM role";
const updateRoles = "SELECT * FROM role";

const Role = {
    getRole: async (limit,offset) => {
        try{
          const roleDataResult = await db.prepare(`${getRoles} ${pagination}`).all({limit,offset});

          const [{total}] = await db.prepare(`${totalQuery} role`).all();
          const data = {roleDataResult, total};
          return data;
        } catch(err){
            console.log("err: ",err);
            return false;
        }
    },
};
export default Role;