import jwt from "jsonwebtoken";

const generateToken = (id, username) => {
  return jwt.sign({ _id: id, username: username }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

export default generateToken;
