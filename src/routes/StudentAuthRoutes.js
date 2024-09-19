import { Router } from "express";
import {  CheckAuth, handleSubmitForm, LogoutStudent, signInStudent, signUpStudent } from "../controllers/StudentAuthControllers.js";
import { upload, verifyToken } from "../middlewares/AuthMiddleware.js";


const StudentAuthRoutes = Router()


StudentAuthRoutes.post('/signup', signUpStudent)
StudentAuthRoutes.post('/signin', signInStudent)
StudentAuthRoutes.post('/logout', LogoutStudent)
StudentAuthRoutes.get('/check-auth',verifyToken, CheckAuth)
StudentAuthRoutes.post('/submit-form',verifyToken, upload.fields([
      { name: 'photograph', maxCount: 1 },
      { name: 'signature', maxCount: 1 },
      { name: 'aadharCard', maxCount: 1 },
      { name: 'tenthCertificate', maxCount: 1 },
      { name: 'twelfthCertificate', maxCount: 1 },
      { name: 'casteCertificate', maxCount: 1 },
      { name: 'incomeCertificate', maxCount: 1 },
      { name: 'domicileCertificate', maxCount: 1 },
      { name: 'disabilityCertificate', maxCount: 1 }
    ]) ,handleSubmitForm)

export default StudentAuthRoutes