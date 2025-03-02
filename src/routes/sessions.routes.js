import { Router } from "express";
import passport from "passport";
import { githubLogin, login, register, viewLogin, viewRegister } from "../controllers/sessionsController.js";

const sessionRouter = Router();

sessionRouter.get("/viewLogin", viewLogin);
sessionRouter.get("/viewRegister", viewRegister);
sessionRouter.post("/login", passport.authenticate("login", { failureRedirect: "/error" } ), login);
sessionRouter.post("/register", passport.authenticate("register", { failureRedirect: "/error" }), register);
sessionRouter.get("/github", passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => {});
sessionRouter.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), githubLogin);
sessionRouter.get("/current", passport.authenticate("jwt"), async (req, res) => res.status(200).json(req.user));

export default sessionRouter;
