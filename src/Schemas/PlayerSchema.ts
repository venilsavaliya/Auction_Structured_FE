import * as yup from "yup";
import type PlayerFormInputs from "../Models/FormInterfaces/PlayerFormInputs";

// Extend FileList type checking for type safety (optional)
const SUPPORTED_FORMATS = [
  "image/jpeg",
  "image/png",
  "image/jfif",
  "image/jpg",
  "image/avif",
  "image/webp",
];

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

const PlayerSchema: yup.ObjectSchema<PlayerFormInputs> = yup.object({
  id: yup.number().optional(),
  name: yup.string().required("Player name is required"),

  dateOfBirth: yup
    .string()
    .required("Date Of Birth is required")
    .test("valid-date", "Date must be in the Past", function (value) {
      const parsedDate = new Date(value || "");
      return parsedDate < new Date();
    }),

  country: yup.string().required("Country is required!"),

  isActive: yup.boolean().optional().default(true),

  skill: yup.string().required("Skill is required"),

  teamId: yup
    .string()
    .required("Team is required")
    .test("is-valid-id", "Team is required", (value) => !!value),

  basePrice: yup
    .number()
    .typeError("Base price must be a number")
    .positive("Base price must be greater than zero")
    .required("Base price is required"),

  image: yup
    .mixed<File>()
    .test("fileSize", "Image must be less than 2MB", (value) => {
      if (value instanceof File) return value.size <= MAX_FILE_SIZE;
      return true; // Allow existing URL when editing
    })
    .test(
      "fileType",
      "Only JPG/PNG/JFIF/JPEG/AVIF/WEBP images are allowed",
      (value) => {
        if (value instanceof File)
          return SUPPORTED_FORMATS.includes(value.type);
        return true; // Allow existing URL when editing
      }
    ),
});

export default PlayerSchema;
