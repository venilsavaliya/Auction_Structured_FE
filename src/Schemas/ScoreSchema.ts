import * as yup from "yup";

export const scoreSchema = yup.object().shape({
  Run: yup.number().required().min(0),
  Four: yup.number().required().min(0),
  Six: yup.number().required().min(0),
  HalfCentury: yup.number().required().min(0),
  Century: yup.number().required().min(0),
  Duck: yup.number().required().max(0),

  Wicket: yup.number().required().min(0),
  ThreeWicketHaul: yup.number().required().min(0),
  FourWicketHaul: yup.number().required().min(0),
  FiveWicketHaul: yup.number().required().min(0),
  MaidenOver: yup.number().required().min(0),

  Catch: yup.number().required().min(0),
  ThreeCatchHaul: yup.number().required().min(0),
  Stumping: yup.number().required().min(0),
  DirectRunOut: yup.number().required().min(0),
  AssistedRunOut: yup.number().required().min(0),
});
