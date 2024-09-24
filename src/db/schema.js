import {
  boolean,
  date,
  integer,
  pgTable,
  serial,
  varchar,
} from "drizzle-orm/pg-core";

export const Student_User = pgTable("Student_Users", {
  id: serial("id").primaryKey(),
  StudentName: varchar("StudentName", { length: 255 }).notNull(),
  MobileNumber: varchar("MobileNumber").notNull().unique(),
  DOB: date("DOB").notNull(), // Date of Birth
  Gender: varchar("Gender", { length: 10 }).notNull(),
  EmailID: varchar("EmailID", { length: 255 }).notNull().unique(),
  Pin: varchar("Pin").notNull(), // 6-digit pin as varchar to preserve leading zeros
  Applied:boolean("Applied").default(false)
});

export const Student_Application_Reference = pgTable("Student_Application_References",{
  ApplicationID: serial("ApplicationID").primaryKey(),
  StudentID: integer("StudentID").references(()=> Student_User.id),
  ApplicationStatus : varchar("ApplicationStatus").default("Pending"),
  updateAccess : boolean("UpdateAccess").default(false)
})

export const Student_Form_Data = pgTable("Student_Form_Data", {
  id: serial("id").primaryKey(),
  ApplicationID: integer("ApplicationID").references(()=> Student_Application_Reference.ApplicationID),
  Name: varchar("Name", { length: 255 }).notNull(),
  FatherName: varchar("FatherName", { length: 255 }).notNull(),
  MotherName: varchar("MotherName", { length: 255 }).notNull(),
  DOB: date("DOB").notNull(), // Date of Birth
  Gender: varchar("Gender", { length: 10 }).notNull(),
  Category : varchar("Category").notNull(),
  EmailID: varchar("EmailID", { length: 255 }).notNull(),
  FamilyIncome: varchar("FamilyIncome").notNull(),
  CollegeName: varchar("CollegeName", { length: 255 }).notNull(),
  CollegeAddress: varchar("CollegeAddress").notNull(),
  CollegeEmailID: varchar("CollegeEmailID").notNull(),
  InstitutionCode: varchar("InstitutionCode").notNull(),
  EnrollmentNumber: varchar("EnrollmentNumber", { length: 255 }).notNull(),
  CourseDuration: varchar("CourseDuration").notNull(),
  CourseName: varchar("CourseName").notNull(),
  FeesPerSem: varchar("FeesPerSem").notNull(),
  TotalFees: varchar("TotalFees").notNull(),
  Address: varchar("Address", { length: 255 }).notNull(),
  City: varchar("City").notNull(),
  State: varchar("State").notNull(),
  PinCode: varchar("PinCode").notNull(),
})


export const Student_Academic_Data = pgTable("Student_Academic_Data",{
  id: serial("id").primaryKey(),
  ApplicationID: integer("ApplicationID").references(()=> Student_Application_Reference.ApplicationID),
  exam: varchar("exam", { length: 255 }).notNull(),
  board: varchar("board").notNull(),
  yearOfPass: varchar("yearOfPass").notNull(),
  totalMarks: varchar("totalMarks").notNull(),
  marksObtained: varchar("marksObtained").notNull()
})



export const Student_Document_Data = pgTable("Student_Document_Data",{
  id: serial("id").primaryKey(),
  ApplicationID: integer("ApplicationID").references(()=> Student_Application_Reference.ApplicationID),
  photograph: varchar("photograph"),
  signature: varchar("signature"),
  aadharCard: varchar("aadharCard"),
  tenthCertificate: varchar("tenthCertificate"),
  twelfthCertificate: varchar("twelfthCertificate"),
  casteCertificate: varchar("casteCertificate"),
  incomeCertificate: varchar("incomeCertificate"),
  domicileCertificate: varchar("domicileCertificate"),
  disabilityCertificate: varchar("disabilityCertificate"),

})


export const SAG_Bureau_User = pgTable("SAG_Bureau_User", {
  id: serial("id").primaryKey(),
  UserId: varchar("UserId").notNull(),
  Username: varchar("Username", { length: 255 }).notNull(),
  EmailID: varchar("EmailID", { length: 255 }).notNull().unique(),
  Password: varchar("Password").notNull(), 
});






