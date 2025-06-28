import { Slider, Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface PercentageSliderProps {
  value: number;
  onPercentageChange: (value: number) => void;
}

const PercentageSlider: React.FC<PercentageSliderProps> = ({
  value,
  onPercentageChange,
}) => {
  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    console.log(event);
    const newValueNumber = Array.isArray(newValue) ? newValue[0] : newValue;
    onPercentageChange(newValueNumber); // Call the parent function to pass the value
  };

  const { t } = useTranslation();

  return (
    <Box sx={{ width: '100%', margin: 'auto', textAlign: 'center' }}>
      <Typography variant="h6">{t('calculatorPage.goldRateCalculator.percentage')}</Typography>
      <Box
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Slider
          value={value}
          onChange={handleSliderChange}
          aria-labelledby="percentage-slider"
          step={5}
          min={0}
          max={100}
          valueLabelDisplay="off"
          color={value > 60 ? 'error' : 'primary'}
        />
        <Typography variant="h6" sx={{ marginLeft: 2 }}>
          {value}%
        </Typography>
      </Box>
    </Box>
  );
};

export default PercentageSlider;
