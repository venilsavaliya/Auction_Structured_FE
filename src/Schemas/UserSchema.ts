import * as yup from "yup";
import type { UserFormInputs } from "../Models/FormInterfaces/UserFormInput";

export const UserSchema: yup.ObjectSchema<UserFormInputs> = yup.object().shape({
  id: yup.number().optional(),
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().optional(), // optional
  email: yup.string().email("Invalid email").required("Email is required"),
  role: yup.string().required("Role is required"),
  dateOfBirth: yup.string().required("Date of birth is required"),
  gender: yup.string().required("Gender is required"),
  password: yup.string().when("id", {
    is: (val: any) => !val,
    then: (schema) => schema.required("Password is required"),
    otherwise: (schema) => schema.optional(),
  }),
  mobileNumber: yup
    .string()
    .matches(/^[0-9]{10}$/, "Mobile number must be 10 digits")
    .required("Mobile number is required"),
  image: yup.mixed(), // optional, no validation
});
