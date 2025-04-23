import { Student } from "../models/student.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { APIError } from "../utils/APIError.js";

// Helper function to parse DD-MM-YYYY to a valid Date object
const parseDate = (dateString) => {
  const [day, month, year] = dateString.split("-");
  const parsedDate = new Date(Date.UTC(year, month - 1, day)); // Use UTC to avoid time zone issues
  if (isNaN(parsedDate)) {
    throw new APIError(400, "Invalid date format. Use DD-MM-YYYY.");
  }
  return parsedDate;
};

// Create a new student
export const createStudent = asyncHandler(async (req, res) => {
  console.log("Request body:", req.body); // Log the request body for debugging
  const {
    name,
    srNo,
    fatherName,
    motherName,
    session,
    class: studentClass,
    section,
    dob,
    gender,
    address,
    mobileNo,
    transferCertificate,
  } = req.body;

  // Basic validation
  if (!name || !srNo || !session || !studentClass || !section || !address ) {
    throw new APIError(400, "Name, Sr No, Session, and Class are required.");
  }

  // Parse the date of birth if provided
  let parsedDob = null;
  if (dob) {
    parsedDob = parseDate(dob);
  }

  // Check for duplicate student by srNo, class, section, and session
  const existingStudent = await Student.findOne({
    srNo,
    class: studentClass,
    section,
    session,
  });

  if (existingStudent) {
    throw new APIError(409, "Student with the same Sr No already exists.");
  }

  const newStudent = new Student({
    name,
    fatherName,
    motherName,
    srNo,
    session,
    class: studentClass,
    section,
    dob: parsedDob,
    gender,
    address,
    mobileNo,
    transferCertificate,
  });

  await newStudent.save();

  res.status(201).json({
    status: 201,
    message: "Student created successfully",
    student: newStudent,
  });
});

// Get student by ID
export const getStudentById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) throw new APIError(400, "Student ID is required");

  const student = await Student.findById(id);
  if (!student) throw new APIError(404, "Student not found");

  res.status(200).json({
    status: 200,
    student,
  });
});

// Update student
export const updateStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  if (!id) throw new APIError(400, "Student ID is required");

  // Parse the date of birth if provided
  if (updatedData.dob) {
    updatedData.dob = parseDate(updatedData.dob);
  }

  const updatedStudent = await Student.findByIdAndUpdate(id, updatedData, {
    new: true,
    runValidators: true,
  });

  if (!updatedStudent) {
    throw new APIError(404, "Student not found");
  }

  res.status(200).json({
    status: 200,
    message: "Student updated successfully",
    student: updatedStudent,
  });
});

// Delete student
export const deleteStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) throw new APIError(400, "Student ID is required");

  const deletedStudent = await Student.findByIdAndDelete(id);

  if (!deletedStudent) {
    throw new APIError(404, "Student not found");
  }

  res.status(200).json({
    status: 200,
    message: "Student deleted successfully",
  });
});

// Get students by filters
export const getStudents = asyncHandler(async (req, res) => {
  const { name, session, class: studentClass, section, srNo } = req.query;

  const filter = {};
  if (name) filter.name = { $regex: name, $options: "i" }; // Case-insensitive search
  if (session) filter.session = session;
  if (studentClass) filter.class = studentClass;
  if (section) filter.section = section;
  if (srNo) filter.srNo = srNo;

  if (Object.keys(filter).length === 0) {
    throw new APIError(400, "At least one filter (session, class, section, or srNo) is required.");
  }

  const students = await Student.find(filter);

  if (!students || students.length === 0) {
    throw new APIError(404, "No students found for the given criteria");
  }

  res.status(200).json({
    status: 200,
    message: "Students fetched successfully",
    students,
  });
});

// Get all students
export const getAllStudents = asyncHandler(async (req, res) => {
  const students = await Student.find();

  if (!students || students.length === 0) {
    throw new APIError(404, "No students found in the database");
  }

  res.status(200).json({
    status: 200,
    message: "All students fetched successfully",
    students,
  });
});


export const uploadTCHandler = async (req, res) => {
  try {
    const studentId = req.params.id;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Save TC filename to DB
    student.transferCertificate = req.file.filename;
    await student.save();

    res.status(200).json({
      message: "Transfer Certificate uploaded and updated.",
      file: req.file,
      student,
    });

  } catch (error) {
    console.error("Upload TC Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
