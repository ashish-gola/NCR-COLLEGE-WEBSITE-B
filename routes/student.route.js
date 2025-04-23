import express from 'express';
import { createStudent,getStudentById,updateStudent,deleteStudent,getStudents,getAllStudents } from '../controllers/student.controller.js';

const router = express.Router();

router.post('/', createStudent);

// Get all students by session, class, section or rollNo
router.get('/', getAllStudents); 

router.get('/filter', getStudents); // Get all students by session, class, section or rollNo
// router.get('/filter', filterStudents); 
// 🔍 filter route // 🔍 filter route


router.get('/:id', getStudentById);

router.put('/:id', updateStudent);

router.delete('/:id', deleteStudent);


export default router;
