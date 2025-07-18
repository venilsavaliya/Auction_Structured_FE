// Define type for each user option

export interface IMultipleSearchSelectProps {
  onChange: (selectedIds: number[]) => void;
  optionList: any[];
  selectedIds: number[];
}
