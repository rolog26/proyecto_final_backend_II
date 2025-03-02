import passport from "passport";
import local from "passport-local";
import GitHubStrategy from "passport-github2";
import jwt from "passport-jwt";
import { createHash, validatePassword } from "../utils/bcrypt.js";
import userModel from "../models/users.model.js";
import dotenv from "dotenv";

const localStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

dotenv.config();
const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    // Prueba con ambos nombres de cookie
    token = req.cookies["sessionCookie"];
    console.log("Cookie recibida:", req.cookies);
    console.log("Token extraído:", token);
  }
  return token;
};

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res
          .status(401)
          .send({ error: info.messages?info.messages : info.toString() });
      }
      req.user = user;

      next();
    })(req, res, next);
  };
};

const initializePassport = () => {
  passport.use(
    "register",
    new localStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, username, password, done) => {
        try {
          const { first_name, last_name, email, password, age } = req.body;

          const findUser = await userModel.findOne({ email: email });
          if (!findUser) {
            const user = await userModel.create({
              first_name: first_name,
              last_name: last_name,
              email: email,
              age: age,
              password: createHash(password),
            });
            return done(null, user);
          } else {
            return done(null, false);
          }
        } catch (error) {
          console.log(error);
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new localStrategy(
      { usernameField: "email" },
      async (username, password, done) => {
        try {
          const user = await userModel.findOne({ email: username });

          if (user && validatePassword(password, user.password)) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await userModel.findOne({ email: profile._json.email });
          if (!user) {
            let user = await userModel.create({
              first_name: profile._json.name,
              last_name: " ",
              email: profile._json.email,
              age: 18,
              password: "1234",
            });
            done(null, user);
          } else {
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.SECRET_JWT,
      },
      async (jwt_payload, done) => {
        console.log("Token JWT recibido:", jwt_payload);
        if (!jwt_payload || !jwt_payload.user) {
          console.log("No se encontró la propiedad 'user' en el payload.");
          return done(null, false);
        }
        console.log("Usuario extraído del token:", jwt_payload.user);
        return done(null, jwt_payload.user);
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id);
    done(null, user);
  });
};

export default initializePassport;
