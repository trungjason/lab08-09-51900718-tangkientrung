const mongoose = require("mongoose");
const createError = require("http-errors");
const options = {
    autoIndex: false, // Don't build indexes
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4, // Use IPv4, skip trying IPv6
};

const connection = mongoose.connect(process.env.DB_CONNECTION_URL, options);

mongoose.connection.on("connected", function() {
    console.info("Connect to cloud database successfully !!!");
});

mongoose.connection.on("disconnected", function() {});

mongoose.connection.on("error", function(error) {
    console.error("Can't connect to cloud database !!! ", error.message);
    createError.RequestTimeout(error.message);
});

module.exports = connection;