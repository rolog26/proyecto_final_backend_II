import { generateToken } from "../utils/jwt.js";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ status: "error", message: "Credenciales inválidas" });
    }

    const user = {
      id: req.user._id,
      first_name: req.user.first_name,
      rol: req.user.rol || req.user.role || "Usuario",
    };

    const token = jwt.sign({ user }, process.env.SECRET_JWT, {
      expiresIn: "24h",
    });

    res.cookie("sessionCookie", token, {
      maxAge: 86400000,
      httpOnly: true,
    });

    return res.status(200).json({
      status: "success",
      message: "Login exitoso",
      user: user,
    });
  } catch (error) {
    console.error("Error en login:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Error interno del servidor" });
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

export const githubLogin = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: "error",
        message: "Error en la autenticación con GitHub",
      });
    }

    const user = {
      id: req.user._id,
      first_name: req.user.first_name,
      rol: req.user.rol || req.user.role || "Usuario",
    };

    const token = jwt.sign({ user }, process.env.SECRET_JWT, {
      expiresIn: "24h",
    });

    res.cookie("sessionCookie", token, {
      maxAge: 86400000,
      httpOnly: true,
    });

    return res.redirect("/products");
  } catch (error) {
    console.error("Error en githubLogin:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Error interno del servidor" });
  }
};
