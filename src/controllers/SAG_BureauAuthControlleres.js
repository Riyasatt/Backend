import { eq, inArray } from "drizzle-orm";
import { db } from "../db/index.js";
import bcrypt from "bcryptjs";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken"
import { SAG_Bureau_User, Student_Academic_Data, Student_Application_Reference, Student_Document_Data, Student_Form_Data, Student_User } from "../db/schema.js";


const maxAge =  60 * 60 * 1000;

const createToken = (userId) =>{
  return jwt.sign({ userId},process.env.JWT_KEY,{expiresIn : maxAge})
}

export const AddSAG_User = async (req, res) => {
      const {UserId, EmailID,  Username, Password } = req.body;
    
      try {
        // Check if the email or phone already exists
       
    
    
        // Hash the password and insert the new user
        const hashedPassword = await bcrypt.hash(Password, 10);
        const newUser = await db.insert(SAG_Bureau_User).values({UserId, EmailID,  Username, Password :hashedPassword }).returning()
    
        res.status(200).send('Added SAG Official User');
    
      } catch (error) {
        console.error(error);
        res.status(500).send('Error during Adding  SAG Official User');

      }
    };


export const signInSAG = async (req, res) => {
  const {UserId, EmailID,  Username, Password } = req.body;

  console.log(UserId, EmailID, Username, Password);;

  try {
    const userResult = await db.select().from(SAG_Bureau_User).where(eq(SAG_Bureau_User.UserId, UserId));
    if (userResult.length === 0) return res.status(404).send('User not found');

    const user = userResult[0];
    const passwordValid = await compare(Password, user.Password);
    if (!passwordValid) return res.status(403).send('Invalid password');

    const isDetailsCorrect = (
      user.UserId === UserId &&
      user.EmailID === EmailID &&
      user.Username === Username
    );

    if(!isDetailsCorrect) return res.status(401).send('Invalid Credentials');


    const token = createToken(user.id)

    // Store token in cookies
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: true, // Ensure it's only sent over HTTPS
      sameSite: 'None', // Important for cross-origin cookies
    })

    res.status(200).send('Login successful');

  } catch (error) {
    res.status(500).send('Error during login');
  }
};

export const LogoutSAGUser = async(req, res) => {
  res.clearCookie('jwt');
  res.send('Logged out');
}

export const CheckAuthSAGUser = async(req, res) => {
  res.status(200).send("Logged IN");
}

export const getAllUser = async(req,res) => {


  try {
    const allUsers = await db.select({id: Student_User.id, 
      StudentName : Student_User.StudentName,
      DOB:Student_User.DOB, 
      Gender:Student_User.Gender,
      EmailID:Student_User.EmailID}).from(Student_User).where( inArray(
      Student_User.id, // column from studentUser
      db
        .select({ studentId: Student_Application_Reference.StudentID }) // Subquery to select studentId from student_application_reference
        .from(Student_Application_Reference)
    ));
    if(allUsers.length === 0) return res.status(204).json({message : "No Data Available", userinfo:[]})

      return res.status(200).json({userinfo : allUsers, message:"Data was found successfully"})
  } catch (error) {
    console.error(error);
    res.status(500).send('Unable to fetch Student Data. Internal Server Error');

  }
}

export const getAllUserVerified = async(req,res) => {
  try {
    const allUsers = await db.select({
      id: Student_User.id, 
      StudentName : Student_User.StudentName,
      MobileNumber : Student_User.MobileNumber,
      DOB:Student_User.DOB, 
      Gender:Student_User.Gender,
      EmailID:Student_User.EmailID,
      ApplicationID: Student_Application_Reference.ApplicationID, // Select application number from the reference table
    })
    .from(Student_User)
    .innerJoin(
      Student_Application_Reference,
      eq(Student_User.id, Student_Application_Reference.StudentID) // Join on studentId
    )
    .where(eq(Student_Application_Reference.ApplicationStatus, "Verified"));
    if(allUsers.length === 0) return res.status(204).json({message : "No Data Available"})

      return res.status(200).json({userinfo : allUsers, message:"Data was found successfully"})
  } catch (error) {
    console.error(error);
    res.status(500).send('Unable to fetch Student Data. Internal Server Error');

  }
}

export const getAllUserPending = async(req,res) => {
  try {
    const allUsers = await db.select({
      id: Student_User.id, 
      StudentName : Student_User.StudentName,
      MobileNumber : Student_User.MobileNumber,
      DOB:Student_User.DOB, 
      Gender:Student_User.Gender,
      EmailID:Student_User.EmailID,
      ApplicationID: Student_Application_Reference.ApplicationID, // Select application number from the reference table
    })
    .from(Student_User)
    .innerJoin(
      Student_Application_Reference,
      eq(Student_User.id, Student_Application_Reference.StudentID) // Join on studentId
    )
    .where(eq(Student_Application_Reference.ApplicationStatus, "Pending"));
    if(allUsers.length === 0) return res.status(204).json({message : "No Data Available"})
      
      return res.status(200).json({userinfo : allUsers, message:"Data was found successfully"})
  } catch (error) {
    console.error(error);
    res.status(500).send('Unable to fetch Student Data. Internal Server Error');

  }
}
export const getAllUserUnverified = async(req,res) => {
  try {
    const allUsers = await db.select({
      id: Student_User.id, 
      StudentName : Student_User.StudentName,
      MobileNumber : Student_User.MobileNumber,
      DOB:Student_User.DOB, 
      Gender:Student_User.Gender,
      EmailID:Student_User.EmailID,
      ApplicationID: Student_Application_Reference.ApplicationID, // Select application number from the reference table
    })
    .from(Student_User)
    .innerJoin(
      Student_Application_Reference,
      eq(Student_User.id, Student_Application_Reference.StudentID) 
    )
    .where(eq(Student_Application_Reference.ApplicationStatus, "UnVerified"));
    if(allUsers.length === 0) return res.status(204).json({message : "No Data Available"})

      return res.status(200).json({userinfo : allUsers, message:"Data was found successfully"})
  } catch (error) {
    console.error(error);
    res.status(500).send('Unable to fetch Student Data. Internal Server Error');

  }
}

export const getStudentData = async(req,res) => {
  const { studentId } = req.params;


  try {
    
    const studentData = await db
    .select({
      // Student User Info
      studentId: Student_User.id,
      
      // Application Reference Info
      applicationId: Student_Application_Reference.ApplicationID,
      applicationStatus: Student_Application_Reference.ApplicationStatus,
      updateAccess: Student_Application_Reference.updateAccess,
      
      // Form Data
      name: Student_Form_Data.Name,
      fatherName: Student_Form_Data.FatherName,
      motherName: Student_Form_Data.MotherName,
      dob: Student_Form_Data.DOB,
      gender: Student_Form_Data.Gender,
      category: Student_Form_Data.Category,
      emailId : Student_Form_Data.EmailID,
      familyIncome: Student_Form_Data.FamilyIncome,
      collegeName: Student_Form_Data.CollegeName,
      collegeAddress: Student_Form_Data.CollegeAddress,
      collegeEmailID: Student_Form_Data.CollegeEmailID,
      institutionCode: Student_Form_Data.InstitutionCode,
      enrollmentNumber: Student_Form_Data.EnrollmentNumber,
      courseDuration: Student_Form_Data.CourseDuration,
      courseName: Student_Form_Data.CourseName,
      feesPerSem: Student_Form_Data.FeesPerSem,
      totalFees: Student_Form_Data.TotalFees,
      address: Student_Form_Data.Address,
      city: Student_Form_Data.City,
      state: Student_Form_Data.State,
      pinCode: Student_Form_Data.PinCode,
      
      
      // Document Data
      photograph: Student_Document_Data.photograph,
      signature: Student_Document_Data.signature,
      aadharCard: Student_Document_Data.aadharCard,
      tenthCertificate: Student_Document_Data.tenthCertificate,
      twelfthCertificate: Student_Document_Data.twelfthCertificate,
      casteCertificate: Student_Document_Data.casteCertificate,
      incomeCertificate: Student_Document_Data.incomeCertificate,
      domicileCertificate: Student_Document_Data.domicileCertificate,
      disabilityCertificate: Student_Document_Data.disabilityCertificate,
    })
    .from(Student_User)
    .leftJoin(Student_Application_Reference, eq(Student_User.id, Student_Application_Reference.StudentID))
    .leftJoin(Student_Form_Data, eq(Student_Application_Reference.ApplicationID, Student_Form_Data.ApplicationID))
    .leftJoin(Student_Academic_Data, eq(Student_Application_Reference.ApplicationID, Student_Academic_Data.ApplicationID))
    .leftJoin(Student_Document_Data, eq(Student_Application_Reference.ApplicationID, Student_Document_Data.ApplicationID))
    .where(eq(Student_Application_Reference.StudentID, studentId));

    if(studentData.length === 0) return res.status(404).send("Student not found")

      const applicationId = studentData[0].applicationId


      const academicRecords = await db
      .select({
        exam: Student_Academic_Data.exam,
        board: Student_Academic_Data.board,
        yearOfPass: Student_Academic_Data.yearOfPass,
        totalMarks: Student_Academic_Data.totalMarks,
        marksObtained: Student_Academic_Data.marksObtained,
      })
      .from(Student_Academic_Data)
      .where(eq(Student_Academic_Data.ApplicationID, applicationId));

      const combinedStudentDetails = {
        ...studentData[0],
        academicRecords, // Attach academic data as an array
      };

      return res.status(200).json({message : "Successfully fetched student", userinfo : combinedStudentDetails})

  } catch (error) {

    console.error(error);
    res.status(500).send('Unable to fetch Student Data. Internal Server Error');

  }
}


export const changeApplicationStatusToVerified = async(req,res) => {
  const {applicationId} = req.body;

  try {
    const userResult = await db.select().from(Student_Application_Reference).where(eq(Student_Application_Reference.ApplicationID, applicationId));

    if (userResult.length === 0) return res.status(404).send('User not found');

    
    const updateResult = await db.update(Student_Application_Reference).set({ApplicationStatus : "Verified"}).where(eq(Student_Application_Reference, applicationId))

    res.status(200).send('Changed the Student Status to Verified');

  } catch (error) {
    res.status(500).send('Error during changing status');
  }

}

export const changeApplicationStatusToUnVerified = async(req,res) => {
  const {applicationId} = req.body;

  try {
    const userResult = await db.select().from(Student_Application_Reference).where(eq(Student_Application_Reference.ApplicationID, applicationId));

    if (userResult.length === 0) return res.status(404).send('User not found');

    
    const updateResult = await db.update(Student_Application_Reference).set({ApplicationStatus : "UnVerified"}).where(eq(Student_Application_Reference, applicationId))

    res.status(200).send('Changed the Student Status to Unverified');

  } catch (error) {
    res.status(500).send('Error during changing status');
  }

}

export const changeApplicationStatusToPending = async(req,res) => {
  const {applicationId} = req.body;

  try {
    const userResult = await db.select().from(Student_Application_Reference).where(eq(Student_Application_Reference.ApplicationID, applicationId));

    if (userResult.length === 0) return res.status(404).send('User not found');

    
    const updateResult = await db.update(Student_Application_Reference).set({ApplicationStatus : "Pending"}).where(eq(Student_Application_Reference, applicationId))

    res.status(200).send('Changed the Student Status to Pending');

  } catch (error) {
    res.status(500).send('Error during changing status');
  }

}