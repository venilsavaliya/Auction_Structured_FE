import type { IBaseResponse } from "./IBaseResponse";

export default interface ImportPlayersCsvResponseModel extends IBaseResponse {
  Errors: string[];
  TotalRows: number;
  SuccessfulInserts: number;
}
