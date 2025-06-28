import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  styled,
} from '@mui/material';
import { formatCurrency } from '../../../utils/CurrencyUtil';

interface TableRow {
  duration: number;
  interest: number;
  principal: number;
  principleAndInterest: number;
  total: number;
  unit: string;
  roi: number;
  rate: number;
}

interface CompoundInterestTableProps {
  data: TableRow[];
}

// Styled components for custom table cells
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  '&.MuiTableCell-head': {
    backgroundColor: theme.palette.grey[100],
    fontWeight: 600,
    fontSize: 14,
  },
  '&.MuiTableCell-body': {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const CompoundInterestTable: React.FC<CompoundInterestTableProps> = ({
  data,
}) => {
  const formatRoi = (roi: number) => {
    return `${roi}%`;
  };

  return (
    <TableContainer component={Paper} sx={{ boxShadow: 2, borderRadius: 1 }}>
      <Table sx={{ minWidth: 650 }} aria-label="compound interest table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Duration</StyledTableCell>
            <StyledTableCell>Principal Amount</StyledTableCell>
            <StyledTableCell>ROI</StyledTableCell>
            <StyledTableCell>Interest</StyledTableCell>
            <StyledTableCell>Compound Amount</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <StyledTableRow key={index}>
              <StyledTableCell>
                {row.duration} {row.unit}
              </StyledTableCell>
              <StyledTableCell>{formatCurrency(row.principal)}</StyledTableCell>
              <StyledTableCell>{formatRoi(row.roi)}</StyledTableCell>
              <StyledTableCell>
                <div style={{ color: 'rgba(0, 0, 0, 0.6)' }}>
                  {formatCurrency(row.principal)} × {formatRoi(row.rate)}
                </div>
                <div style={{ fontWeight: 500, marginTop: 4 }}>
                  = {formatCurrency(row.interest)}
                </div>
              </StyledTableCell>
              <StyledTableCell>
                <div style={{ color: 'rgba(0, 0, 0, 0.6)' }}>
                  {formatCurrency(row.principleAndInterest || row.principal)} +{' '}
                  {formatCurrency(row.interest)}
                </div>
                <div style={{ fontWeight: 500, marginTop: 4 }}>
                  = {formatCurrency(row.total)}
                </div>
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CompoundInterestTable;
