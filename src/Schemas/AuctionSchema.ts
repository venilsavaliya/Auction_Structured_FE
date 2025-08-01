import * as yup from "yup";
import type { AuctionFormInputs } from "../Models/FormInterfaces/AuctionFormInputs";

// Define the schema first
export const auctionSchema:yup.ObjectSchema<AuctionFormInputs>= yup.object({
  id: yup.number().optional(),
  seasonId: yup.number().required("Season is required"),
  title: yup.string().required("Title is required"),
  minimumBidIncreament: yup
    .number()
    .typeError("Minimum bid must be a number")
    .min(0, "Minimum bid cannot be negative")
    .required("Minimum bid is required"),
  maximumPurseSize: yup
    .number()
    .typeError("Max purse size must be a number")
    .min(0, "Max purse size cannot be negative")
    .required("Max purse size is required")
    .test(
      "min-gap",
      "Max purse size must be at least 40x minimum bid",
      function (value) {
        const { minimumBidIncreament } = this.parent;
        return value !== undefined && minimumBidIncreament !== undefined
          ? value >= minimumBidIncreament * 40
          : false;
      }
    ),
  startDate: yup
    .string()
    .required("Start date is required")
    .test("valid-date", "Date must be in the future", function (value) {
      const parsedDate = new Date(value || "");
      return parsedDate > new Date();
    }),
  maximumTeamsCanJoin: yup
    .number()
    .typeError("maximumTeamJoin must be a number")
    .max(30, "Maximum 30 Teams Can Join").required(),

  auctionMode: yup.boolean().required(),

 
});

export const editAuctionSchema = auctionSchema.shape({
    id: yup.number().required("Auction ID is required")
})

// Create the TypeScript type inferred from the schema
export type AuctionFormValues = yup.InferType<typeof auctionSchema>;
