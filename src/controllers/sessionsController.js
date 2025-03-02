import { generateToken } from "../utils/jwt.js";

export const login = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).send("Usuario o contraseña incorrecta");
    }

    const token = generateToken(req.user);
    req.session.user = {
      email: req.user.email,
      first_name: req.user.first_name,
    };
    res.status(200).cookie("sessionCookie", token, {
      httpOnly: true,
      secure: false,
      maxAge: 3600000,
    }).send({ message: "Usuario logueado correctamente" });
  } catch (error) {
    res.status(500).send({ message: "Error al loguear usuario" });
  }
};

export const register = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).send("Usuario ya registrado");
    }
    res.status(201).send({ message: "Usuario registrado correctamente" });
  } catch (error) {
    res.status(500).send({ message: "Error al registrar usuario" });
  }
};

export const viewRegister = (req, res) => {
  res.status(200).render("templates/register", {
    title: "Registrarse",
    url_js: "/js/register.js",
  });
};

export const viewLogin = (req, res) => {
  res.status(200).render("templates/login", {
    title: "Iniciar sesión",
    url_js: "/js/login.js"
  });
};

export const githubLogin = (req, res) => {
  try {
    req.session.user = {
      email: req.user.email,
      first_name: req.user.first_name,
    };
    const token = generateToken(req.user);
    res.satus(200).cookie("sessionCookie", token, {
      httpOnly: true,
      secure: false,
      maxAge: 3600000,
    }).redirect('/home');
  } catch (error) {
    res.status(500).send("Error al loguear usuario", error);
  }
};
