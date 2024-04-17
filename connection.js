const mongoose = require("mongoose");

async function connectionMongoDb(url) {
    return mongoose.connect(url)
    
}

module.exports = {
    connectionMongoDb,
}