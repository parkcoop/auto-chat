const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const defaultValues = {
    avatar: "default",
};

const User = new Schema(
    {
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            required: false,
            default: defaultValues.avatar,
        },
        email: {
            type: String,
            required: false,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model("User", User);
