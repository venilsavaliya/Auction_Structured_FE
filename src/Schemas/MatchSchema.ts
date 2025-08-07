import type { MatchFormInputs } from "../Models/FormInterfaces/MatchFormInputs";
import * as yup from "yup";

const matchSchema: yup.ObjectSchema<MatchFormInputs> = yup.object().shape({
  teamAId: yup
    .number()
    .required("Team A is required")
    .test("teamA-not-zero", "Team A is required", (value) => value !== 0),
  teamBId: yup
    .number()
    .required("Team B is required")
    .test("teamB-not-zero", "Team B is required", (value) => value !== 0)
    .test("teams-not-same", "Team A and Team B must be different", function (value) {
      const { teamAId } = this.parent;
      if (teamAId && value && teamAId !== 0 && value !== 0) {
        return teamAId !== value;
      }
      return true; // Skip if teamA or teamB is 0
    }),
  startDate: yup.string().required("Start Date is required"),
  seasonId: yup.number().required("Season is required") .test("Season-not-zero", "Season is required", (value) => value !== 0),
});

export default matchSchema;
