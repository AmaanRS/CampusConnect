// This is bcrypt specific regex for hash
export const hashStringRegex =
	/^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{22}[./A-Za-z0-9]{31}$/;

export const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const userEmailRegex =
	/^(hod_[a-zA-Z]+|[a-z]+\.[a-z]+|[a-z]+\.[0-9]{9})@vcet\.edu\.in$/;

export const studentEmailRegex: RegExp = /^([a-z]+\.[0-9]{9})@vcet\.edu\.in$/;

export const teacherEmailRegex: RegExp =
	/^(hod_[a-zA-Z]+|[a-z]+\.[a-z]+)@vcet\.edu\.in$/;

export const onlyTeacherEmailRegex: RegExp =
	/^([a-z]+\.[a-z]+)@vcet\.edu\.in$/;

export const onlyHodEmailRegex: RegExp =
	/^(hod_[a-zA-Z]+)@vcet\.edu\.in$/;

// At least one lowercase letter
// At least one uppercase letter
// At least one digit
// At least one special character
// Total length between 8 and 10 characters
export const passwordRegex: RegExp =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/;
