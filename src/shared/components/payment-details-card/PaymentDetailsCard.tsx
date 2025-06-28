import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Divider,
} from '@mui/material';

interface PaymentDetailsCardProps {
  netPureGold99_9: number;
  netPureGold99_5: number;
  cashEquivalent99_5: number;
}

const PaymentDetailsCard: React.FC<PaymentDetailsCardProps> = ({
  netPureGold99_9,
  netPureGold99_5,
  cashEquivalent99_5,
}) => {
  return (
    <Card
      sx={{
        overflow: 'hidden',
        boxShadow: 3,
        border: '2px solid',
        borderRadius: '0.5rem',
        borderColor: '#FCD34D', // Amber-200 equivalent
        transition: 'all 0.3s',
        '&:hover': { boxShadow: 6 },
      }}
    >
      <CardHeader
        sx={{
          background: 'linear-gradient(to right, #F59E0B, #FDE047)', // Amber-500 to Yellow-500 equivalent
          paddingBottom: 2,
          textAlign: 'center',
        }}
        title={
          <Typography variant="h6" color="white">
            Payment Details
          </Typography>
        }
      />
      <CardContent sx={{ padding: 3, backgroundColor: 'white' }}>
        <Box display="flex" flexDirection="column" gap={2}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography fontWeight={500} color="gray.700">
              Gold 99.9 %
            </Typography>
            <Box
              sx={{
                backgroundColor: '#FEF3C7', // Amber-100 equivalent
                px: 2,
                py: 0.5,
                borderRadius: '999px',
                color: '#B45309', // Amber-800 equivalent
                fontWeight: 600,
              }}
            >
              {netPureGold99_9} gms
            </Box>
          </Box>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography fontWeight={500} color="gray.700">
              Gold 99.5 %
            </Typography>
            <Box
              sx={{
                backgroundColor: '#FEF3C7', // Amber-100 equivalent
                px: 2,
                py: 0.5,
                borderRadius: '999px',
                color: '#B45309', // Amber-800 equivalent
                fontWeight: 600,
              }}
            >
              {netPureGold99_5} gms
            </Box>
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography fontWeight={500} color="gray.700">
              Cash (99.5 %)
            </Typography>
            <Box
              sx={{
                backgroundColor: '#FEF3C7', // Amber-100 equivalent
                px: 2,
                py: 0.5,
                borderRadius: '999px',
                color: '#B45309', // Amber-800 equivalent
                fontWeight: 600,
              }}
            >
              &#8377;{' '}
              {new Intl.NumberFormat('en-IN').format(cashEquivalent99_5)}
            </Box>
          </Box>
          <Divider orientation="horizontal" flexItem />
          <Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography fontWeight={700} color="gray.800">
                Total
              </Typography>
              <Box
                sx={{
                  backgroundColor: '#F59E0B', // Amber-500 equivalent
                  px: 2,
                  py: 0.5,
                  borderRadius: '999px',
                  color: 'white',
                  fontWeight: 700,
                }}
              >
                {netPureGold99_5} gms | &#8377;{' '}
                {new Intl.NumberFormat('en-IN').format(cashEquivalent99_5)}
              </Box>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PaymentDetailsCard;
