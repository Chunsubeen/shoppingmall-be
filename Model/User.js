const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
require("dotenv").config()
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    level: { type: String, default: "customer" } // 두 가지 유형: customer, admin
}, { timestamps: true });

userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    delete obj.__v;
    delete obj.updatedAt;
    delete obj.createdAt;
    return obj;
};

userSchema.methods.generateToken = async function () {
    const token = await jwt.sign({ _id: this.id }, JWT_SECRET_KEY, { expiresIn: "1d" })
    return token;
}

const User = mongoose.model("User", userSchema);
module.exports = User;
