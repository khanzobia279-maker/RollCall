const Student = require("../models/Student");

const createStudent = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;

    const student = await Student.create({
      firstName,
      lastName,
      email,
      user: req.user.id          // logged-in user ka id
    });

    res.status(201).json({
      message: "Student Added Successfully",
      student: student
    });

  } catch (error) {

    res.status(400).json({
      message: error.code === 11000
        ? "You already have a student with this email"
        : error.message
    });

  }
};

const getStudents = async (req, res) => {
  try {

    // Sirf isi user ke students
    const students = await Student.find({ user: req.user.id });

    res.status(200).json({
      message: "All Students",
      students: students
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

const getStudentById = async (req, res) => {
  try {

    const student = await Student.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!student) {
      return res.status(404).json({
        message: "Student Not Found"
      });
    }

    res.status(200).json(student);

  } catch (error) {

    res.status(400).json({
      message: error.message
    });

  }
};

const updateStudent = async (req, res) => {
  try {

    const { firstName, lastName, email } = req.body; // user field change nahi hone denge

    const student = await Student.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { firstName, lastName, email },
      {
        new: true,
        runValidators: true
      }
    );

    if (!student) {
      return res.status(404).json({
        message: "Student Not Found"
      });
    }

    res.status(200).json({
      message: "Student Updated Successfully",
      student: student
    });

  } catch (error) {

    res.status(400).json({
      message: error.code === 11000
        ? "You already have a student with this email"
        : error.message
    });
  }
};

const deleteStudent = async (req, res) => {
  try {

    const student = await Student.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!student) {
      return res.status(404).json({
        message: "Student Not Found"
      });
    }

    res.status(200).json({
      message: "Student Deleted Successfully"
    });

  } catch (error) {

    res.status(400).json({
      message: error.message
    });

  }
};

module.exports = {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent
};