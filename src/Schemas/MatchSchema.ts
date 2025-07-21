import type { MatchFormInputs } from "../Models/FormInterfaces/MatchFormInputs";
import * as yup from "yup";

const matchSchema: yup.ObjectSchema<MatchFormInputs> = yup.object().shape({
  teamAId: yup.number().required("Team A is required"),
  teamBId: yup
    .number()
    .required("Team B is required")
    .notOneOf([yup.ref("teamAId")], "Team A and Team B must be different"),
  startDate: yup
    .string()
    .required("Start Date is required")
    .test("valid-date", "Date must be in the Future", function (value) {
      const parsedDate = new Date(value || "");
      return parsedDate > new Date();
    }),
});

export default matchSchema;