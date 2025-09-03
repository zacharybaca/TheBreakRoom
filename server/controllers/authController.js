import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const login = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const userExists = await User.findOne({ $or: [{ username }, { email }] });

        if (!userExists) return res.status(404).json({ message: "Username or E-mail is invalid" });

        if (!userExists.comparePassword(password)) return res.status(403).json({ message: "Wrong Username and/or Password" });

        const token = generateToken(userExists._id, userExists.username);

        return res.status(201).send({
            user: { _id: userExists._id, username: userExists.username },
            token,
        });
    } catch (err) {
        res.status(500).json({ message: "Error logging in", error: err.message });
    }
};
