import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import bcrypt from "bcryptjs";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken"
import { Student_Academic_Data, Student_Application_Reference, Student_Document_Data, Student_Form_Data, Student_User } from "../db/schema.js";

const maxAge =  15 * 60 * 1000;

const createToken = (userId) =>{
  return jwt.sign({ userId},process.env.JWT_KEY,{expiresIn : maxAge})
}


export const signUpStudent = async (req, res) => {
  const { name, gender, dob, pin, email, mobile } = req.body;

  try {
    // Check if the email or phone already exists
    const emailExists = await db.select().from(Student_User).where(eq(Student_User.EmailID, email));
    const phoneExists = await db.select().from(Student_User).where(eq(Student_User.MobileNumber, mobile));

    if (emailExists.length > 0) {
      return res.status(400).send('Email already exists. Please sign in.');
    }

    if (phoneExists.length > 0) {
      return res.status(400).send('Phone number already exists. Please sign in.');
    }


    // Hash the password and insert the new user
    const hashedPassword = await bcrypt.hash(pin, 10);
    const newUser = await db.insert(Student_User).values({StudentName:name, Gender: gender, DOB: dob,Pin: pin, EmailID: email, MobileNumber: mobile,Pin: hashedPassword}).returning()
      
    


    // Sign a JWT token for the newly registered user
    const user = newUser[0]
    const token = createToken(user.id)

    // Store token in cookies
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: true, // Ensure it's only sent over HTTPS
      sameSite: 'None', // Important for cross-origin cookies
    })

    res.status(200).send('Signup successful and user logged in');

  } catch (error) {
    console.error(error);
    res.status(500).send('Error during signup');
  }
};

export const signInStudent = async (req, res) => {
  const { username, password } = req.body;
  try {
    const userResult = await db.select().from(Student_User).where(eq(Student_User.MobileNumber, username));
    if (userResult.length === 0) return res.status(404).send('User not found');

    const user = userResult[0];
    const passwordValid = await compare(password, user.Pin);
    if (!passwordValid) return res.status(403).send('Invalid password');

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

export const LogoutStudent = async(req, res) => {
  res.clearCookie('jwt');
  res.send('Logged out');
}

export const CheckAuth = async(req, res) => {
  res.status(200).send("Logged IN"); 
}

export const handleSubmitForm = async (req, res) => {
  try {
    //get userid
    const {userId} = req.user;

    // Extract text fields
    const { name, fatherName, motherName, dob, gender, category, email, familyIncome, collegeName, collegeAddress, collegeEmail, enrollmentNumber, institutionCode, courseDuration, courseName, feesPerYear, totalFees, address, city, state, pincode } = req.body;



    // Extract academic records
    const academicRecords = JSON.parse(req.body.academicRecords);

    // Extract files
    const files = req.files;

    
    const isApplicationAlreadySubmitted = await db.select().from(Student_Application_Reference).where(eq(Student_Application_Reference.StudentID, userId))

    if(isApplicationAlreadySubmitted.length > 0) {
      return res.status(409).send("You have already submitted your application")
    }

    // add data to application reference table
    const refRes = await db.insert(Student_Application_Reference).values({StudentID : userId}).returning()

    const newApplicationId = refRes[0].ApplicationID

    const formData = {ApplicationID: newApplicationId, Name: name, FatherName: fatherName, MotherName: motherName,DOB: dob,Gender:  gender,Category: category,EmailID: email, FamilyIncome: familyIncome,CollegeName: collegeName, CollegeAddress: collegeAddress, CollegeEmailID : collegeEmail,EnrollmentNumber: enrollmentNumber,InstitutionCode: institutionCode,CourseDuration: courseDuration,CourseName: courseName,FeesPerSem: feesPerYear, TotalFees: totalFees,Address: address,City: city,State: state,PinCode: pincode } 


    const formResult = await db.insert(Student_Form_Data).values(formData).returning();

    const academicData = academicRecords.map(record => ({
      ...record,
      ApplicationID: newApplicationId,
    })); 

    const academicResult = await db.insert(Student_Academic_Data).values(academicData)


    const documentData = Object.keys(files).reduce((acc, key) => {
      acc[key] = files[key][0].path;
      return acc;
    }, {});

    documentData.ApplicationID = newApplicationId

    const documentResult = await db.insert(Student_Document_Data).values(documentData).returning();

    const updateStudent = await db.update(Student_User).set({Applied : true}).where(eq(Student_User.id, userId))



    res.status(200).json({ message: 'Form data received successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
 
}





