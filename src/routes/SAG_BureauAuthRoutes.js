import { Router } from "express";
import { AddSAG_User, changeApplicationStatusToPending, changeApplicationStatusToUnVerified, changeApplicationStatusToVerified, CheckAuthSAGUser, getAllUser, getAllUserPending, getAllUserUnverified, getAllUserVerified, getStudentData, LogoutSAGUser, signInSAG } from "../controllers/SAG_BureauAuthControlleres.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";


const SAG_BureauAuthRoutes = Router()

SAG_BureauAuthRoutes.post('/addSagUser', AddSAG_User)
SAG_BureauAuthRoutes.post('/signin', signInSAG)
SAG_BureauAuthRoutes.post('/logout',verifyToken, LogoutSAGUser)
SAG_BureauAuthRoutes.get('/check-auth',verifyToken, CheckAuthSAGUser)
SAG_BureauAuthRoutes.get('/getAllUser',verifyToken ,getAllUser)
SAG_BureauAuthRoutes.get('/getVerifiedUser',verifyToken ,getAllUserVerified)
SAG_BureauAuthRoutes.get('/getUnVerifiedUser',verifyToken ,getAllUserUnverified)
SAG_BureauAuthRoutes.get('/getPendingUser',verifyToken ,getAllUserPending)
SAG_BureauAuthRoutes.get('/student/:studentId',verifyToken ,getStudentData)
SAG_BureauAuthRoutes.post('/verifyStudent',verifyToken ,changeApplicationStatusToVerified)
SAG_BureauAuthRoutes.post('/unVerifyStudent',verifyToken ,changeApplicationStatusToUnVerified)
SAG_BureauAuthRoutes.post('/pendingStudent',verifyToken ,changeApplicationStatusToPending)


export default SAG_BureauAuthRoutes