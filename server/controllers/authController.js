import bcrypt from 'bcrypt';
import { User, Freelancer } from '../models/Schema.js';

export const registerUser = async (req, res) => {
    try {
        const { username, email, password, usertype } = req.body;
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({ username, email, password: passwordHash, usertype });
        const user = await newUser.save();

        if (usertype === 'freelancer') {
            await new Freelancer({ userId: user._id }).save();
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "User does not exist" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
