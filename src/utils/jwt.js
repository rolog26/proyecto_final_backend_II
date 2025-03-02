import "dotenv/config";
import jwt from "jsonwebtoken";

const secretKey = process.env.SECRET_SESSION;

export const generateToken = (user) => {
  const payload = {
    user: {
      id: user._id,
      first_name: user.first_name,
      rol: user.rol,
    },
  };
  const token = jwt.sign(payload, secretKey, { expiresIn: "24h" });
  return token;
};
