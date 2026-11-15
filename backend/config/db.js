const mongoose = require("mongoose");
// mongoose library ko import kiya.

// Database connection function banaya jo async hai. Ye function try-catch block me hai taki agar connection me koi error aaye to usko handle kiya ja sake.
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.log("Database Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;