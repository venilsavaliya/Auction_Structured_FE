export default interface PlayerFormInputs {
  id?: number ;
  name: string;
  dateOfBirth: string;
  country: string;
  isActive: boolean;
  skill: string;
  teamId: number | string;
  basePrice: number | string;
  image?: File | string;
}
