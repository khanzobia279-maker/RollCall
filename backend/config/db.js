const mongoose = require("mongoose");
// mongoose library ko import kiya.

// Database connection function banaya jo async hai. Ye function try-catch block me hai taki agar connection me koi error aaye to usko handle kiya ja sake.
 let cached = global._mongoose || (global._mongoose = { conn: null, promise: null });

const connectDB = async () => {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI);
  }
  cached.conn = await cached.promise;
  console.log("MongoDB Connected Successfully");
  return cached.conn;
};

module.exports = connectDB;