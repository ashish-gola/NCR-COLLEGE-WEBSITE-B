import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  srNo: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  fatherName: {
    type: String,
    required: true,
    trim: true,
  },
  motherName: {
    type: String,
    required: true,
    trim: true,
  },
  session: {
    type: String,
    required: true, // e.g., "2024-25"
  },
  class: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    default: "",
  },
  dob: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
  },
  address: {
    type: String,
    required: true,
  },
  transferCertificate: {
    type: String,
    default:null,
  },
  admissionDate: {
    type: Date,
    default: Date.now,
  },
  schoolLeavingDate: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Student = mongoose.model("Student", studentSchema);
