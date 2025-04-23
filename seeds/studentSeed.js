import mongoose from "mongoose";
import { Student } from "../models/student.model.js"; // adjust path if needed

const classes = ["Nursery", "KG", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
const sections = ["A", "B", "C", "D"];
const session = "2024-25";

// Function to generate a roll number
const generateRollNo = (className, section, index) => {
  return `${className}-${section}-${index + 1}`;
};

// Generate data for 1000 students
const generateStudent = (index) => {
  const classIndex = Math.floor(Math.random() * classes.length);
  const section = sections[Math.floor(Math.random() * sections.length)];

  return {
    studentId: `NCR-${(index + 1000).toString()}`, // Unique student ID (NCR-1001, NCR-1002, etc.)
    name: `Student ${index + 1}`,
    fatherName: `Father ${index + 1}`,
    motherName: `Mother ${index + 1}`,
    srNo: generateRollNo(classes[classIndex], section, index),
    session: session,
    class: classes[classIndex],
    section: section,
    dob: new Date(2005, 5, 15), // Fixed date of birth (You can modify)
    gender: index % 2 === 0 ? "Male" : "Female", // Alternate gender
    address: `Address ${index + 1}`,
    mobileNo: `98${(Math.random() * 100000000).toFixed(0)}`, // Random mobile number
    photo: "", // Will be uploaded later
    transferCertificate: "", // Empty for now
    admissionDate: new Date(), // Current date for admission
  };
};

const seed = async () => {
  // await mongoose.connect("mongodb+srv://arpdevproductions:RsL263pntwVPsjnk@ncrc-website.mxex5wq.mongodb.net/NCRC-WEBSITE");
  await mongoose.connect("mongodb://localhost:27017/ncrc");

  await Student.deleteMany({}); // optional: clear previous data
  const students = Array.from({ length: 1000 }, (_, i) => generateStudent(i));
  await Student.insertMany(students);

  console.log("✅ 1000 Students Seeded");
  mongoose.disconnect();
};

seed();
