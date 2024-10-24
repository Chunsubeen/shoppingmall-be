const User = require('../Model/User');
const bcrypt = require('bcryptjs');

const userController = {};

// Create new user
userController.createUser = async (req, res) => {
    try {
        const { email, password, name, level } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('User already exists');
        }

        // Generate hashed password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            email,
            password: hashedPassword,
            name,
            level: level ? level : 'customer',
        });

        await newUser.save();

        return res.status(200).json({ status: 'success' });
    } catch (error) {
        return res.status(400).json({ status: 'fail', message: error.message });
    }
};
userController.getUser = async (req, res) => {
    try {
        const { userId } = req;
        const user = await User.findById(userId)
        if (user) {
            return res.status(200).json({ status: "success", user })
        }
        throw new Error("Invalid token")
    } catch (error) {
        return res.status(400).json({ status: "error", error: error.message })
    }

}
module.exports = userController;
