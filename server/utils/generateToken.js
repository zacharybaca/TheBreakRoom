import jwt from "jsonwebtoken";

const generateToken = (id, identifier) => {
  // identifier can be username OR email
  return jwt.sign(
    { _id: id, identifier }, 
    process.env.JWT_SECRET, 
    { expiresIn: "30d" }
  );
};

export default generateToken;
