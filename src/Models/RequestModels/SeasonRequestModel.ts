export default interface SeasonRequestModel {
    name: string;
}

export interface SeasonUpdateRequestModel extends SeasonRequestModel{
    id: number;
}
