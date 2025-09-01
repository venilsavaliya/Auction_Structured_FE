import { Skeleton, TableRow, TableCell } from "@mui/material";
import type { ITableSkeletonProps } from "./ITableSkeletonProps";

const TableSkeleton = ({ rows = 5,cols=11 }: ITableSkeletonProps) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {Array.from({ length: cols }).map((_, colIndex) => (
            <TableCell key={colIndex} align="center">
              <Skeleton variant="text" width="80%" height={30} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};

export default TableSkeleton;
