import { hashSync, compareSync, genSaltSync } from 'bcrypt';
import "dotenv/config"

export const createHash = (password) =>  hashSync(password, genSaltSync(parseInt(process.env.SALT)))

export const validatePassword = (pass, dbPass) => compareSync(pass, dbPass)