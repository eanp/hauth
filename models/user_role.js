import { generateId } from "lucia";
import { Argon2id } from "oslo/password";

import { db } from "../db/db.js";

const inputRole = "INSERT INTO role (id, name, description) VALUES(?, ?, ?)";


const UserRole = {
    login: async (email,password) => {
        try{

        } catch(err){
            console.log("err: ",err);
            return false;
        }
    },
};
export default UserRole;