const mongoose = require("mongoose");


// mongoose.Schema - Database ka structure define krta he.
const studentSchema = new mongoose.Schema({

  // Ye student kis user ka he
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  firstName: {
    type: String,
    required: true
  },

  lastName: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
    // unique: true  <-- hata diya (neeche compound index laga diya)
  },

});

// Same user ke andar email unique hoga, alag users same email use kar sakte hain
studentSchema.index({ user: 1, email: 1 }, { unique: true });

// mongoose.model - "Student" model create krta he.
const Student = mongoose.model("Student", studentSchema);

module.exports = Student;