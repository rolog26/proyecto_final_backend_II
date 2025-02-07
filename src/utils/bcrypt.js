import { hashSync, compareSync, genSaltSync } from 'bcrypt';

export const createHash = (password) =>  hashSync(password, genSaltSync(15))

export const validatePassword = (pass, dbPass) => compareSync(pass, dbPass)