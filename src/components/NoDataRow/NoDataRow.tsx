import { TableCell, TableRow } from "@mui/material";

const NoDataRow = ({ colSpan }: { colSpan: number }) => (
    <TableRow sx={{padding:3}}>
      <TableCell colSpan={colSpan} align="center">
        No Record Found
      </TableCell>
    </TableRow>
  );
  
export default NoDataRow;