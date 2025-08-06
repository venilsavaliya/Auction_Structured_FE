import * as yup from "yup";

export const scoreSchema = yup.object().shape({
  Run: yup.number().required().min(0),
  Four: yup.number().required().min(0),
  Six: yup.number().required().min(0),
  Wicket: yup.number().required().min(0),
  MaidenOver: yup.number().required().min(0),
  Stumping : yup.number().required().min(0),
  Catch: yup.number().required().min(0),
  RunOut: yup.number().required().min(0),
});
