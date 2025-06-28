import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  LinearProgress,
} from '@mui/material';
import { useState } from 'react';

interface WastageDetailsCardProps {
  wastageWeight: number;
  goldRate99_5: number;
  itemWeight: number;
}

const WastageDetailsCard: React.FC<WastageDetailsCardProps> = ({
  wastageWeight,
  goldRate99_5,
  itemWeight,
}) => {
  const [cashRate, _setCashRate] = useState<number>(
    Number((wastageWeight * goldRate99_5).toFixed(0))
  );
  return (
    <Card
      sx={{
        overflow: 'hidden',
        boxShadow: 3,
        border: '2px solid',
        borderRadius: '0.5rem',
        borderColor: '#E9D5FF', // Purple-200 equivalent
        transition: 'all 0.3s',
        '&:hover': { boxShadow: 6 },
      }}
    >
      <CardHeader
        sx={{
          background: 'linear-gradient(to right, #A855F7, #8B5CF6)', // Purple-500 to Violet-500 equivalent
          paddingBottom: 2,
          textAlign: 'center',
        }}
        title={
          <Typography variant="h6" color="white">
            Wastage Details
          </Typography>
        }
      />
      <CardContent sx={{ padding: 3, backgroundColor: 'white' }}>
        <Box display="flex" flexDirection="column" gap={3}>
          <Box>
            <Typography fontWeight={500} color="gray.700">
              Gold 99.5 %
            </Typography>
            <Box
              sx={{
                marginTop: 1,
                padding: 2,
                backgroundColor: '#F5F3FF', // Purple-50 equivalent
                borderRadius: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography fontWeight={600} color="#6B21A8">
                {wastageWeight} gms
              </Typography>
              <Box
                sx={{
                  height: 24,
                  width: 24,
                  backgroundColor: '#D8B4FE', // Purple-300 equivalent
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography fontSize={12} fontWeight={700} color="#6B21A8">
                  99.5
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box>
            <Typography fontWeight={500} color="gray.700">
              Percentage
            </Typography>
            <Box mt={1} p={2} bgcolor="#F5F3FF" borderRadius={2}>
              <LinearProgress
                variant="determinate"
                value={8.5}
                sx={{
                  height: 16,
                  borderRadius: '999px',
                  backgroundColor: '#E5E7EB', // Gray-200 equivalent
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#9333EA', // Purple-600 equivalent
                  },
                }}
              />
              <Typography
                textAlign="right"
                mt={1}
                fontSize={14}
                fontWeight={600}
                color="#6B21A8"
              >
                {((wastageWeight / itemWeight) * 100).toFixed(2)}%
              </Typography>
            </Box>
          </Box>

          <Box>
            <Typography fontWeight={500} color="gray.700">
              Cash
            </Typography>
            <Box mt={1} p={2} bgcolor="#F5F3FF" borderRadius={2}>
              <Typography fontWeight={600} color="#6B21A8">
                &#8377;
                {new Intl.NumberFormat('en-IN').format(cashRate)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default WastageDetailsCard;
