const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Message = new Schema(
    {
        author: {
            type: String,
            required: true,
        },
        conversationId:  { 
            type: Schema.Types.ObjectId,
            ref: "Conversation",
            required: true
        },
        body: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model("Message", Message);
