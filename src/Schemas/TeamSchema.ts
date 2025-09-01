import * as yup from "yup";
import type { TeamFormInput } from "../Models/FormInterfaces/TeamFormInput";
export const TeamSchema:yup.ObjectSchema<TeamFormInput> = yup.object().shape({
    id:yup.number().optional(),
  name: yup.string().required("Team name is required"),
  image: yup
  .mixed<File>()
  .nullable()
  .test("fileType", "Invalid file", (value) => {
    return value === null || value instanceof File;
  }),
 
});
