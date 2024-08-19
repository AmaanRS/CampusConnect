/* eslint-disable no-unused-vars */
// Year Enum
const Year = {
  "1ST": 1,
  "2ND": 2,
  "3RD": 3,
  "4TH": 4,
};

// Department Enum
const Department = {
  IT: "IT",
  COMS: "COMS",
  AIDS: "AIDS",
};

// AccountType Enum
const AccountType = {
  Admin: "ADMIN",
  NonTeachingStaff: "NON_TEACHING_STAFF",
  Student: "STUDENT",
  Teacher: "TEACHER",
};

// StudentPosition Enum
const StudentPosition = {
  Student: "STUDENT",
  StudentIncharge: "STUDENT_INCHARGE",
  CommitteeMember: "COMMITTEE_MEMBER",
};

// TeacherPosition Enum
const TeacherPosition = {
  Teacher: "TEACHER",
  HOD: "HOD",
  FacultyIncharge: "FACULTY_INCHARGE",
  FacultyTeam: "FACULTY_TEAM",
};

// AdminPosition Enum
const AdminPosition = {
  Admin: "ADMIN",
};

// NonTeachingStaffPosition Enum
const NonTeachingStaffPosition = {
  NonTeachingStaff: "NON_TEACHING_STAFF",
};

// Example usage
console.log(Year["1ST"]); // 1
console.log(Department.IT); // "IT"
console.log(AccountType.Student); // "STUDENT"
