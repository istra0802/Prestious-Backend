const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
    },
    number: {
        type:Number,
        required:false,
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
    newsletterSent: {
        type: Boolean,
        default:false,
    }
},
{ timestamps: true }
)

const User = mongoose.model('user', userSchema)

module.exports = User ;