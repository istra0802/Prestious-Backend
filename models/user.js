const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    number: {
        type:Number,
        required:true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    subject: {
        type: String,
    },
    message: {
        type: String,
    },
},
{ timestamps: true }
)

const User = mongoose.model('user', userSchema)

module.exports = User ;