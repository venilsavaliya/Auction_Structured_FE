export interface UserFormInputs {
    id?: number; // present only during Edit
    firstName: string;
    lastName?: string;
    email: string;
    dateOfBirth: string;
    password?: string; // optional during Edit
    image?: File | string; // file during add/edit, string when editing existing
    gender: string;
    mobileNumber: string;
    role: string;
  }
  