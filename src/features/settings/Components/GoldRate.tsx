import { useEffect, useState } from 'react';
import useKalamsData from '../../../hooks/useKalamsData';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
// Loader
import { TailSpin } from 'react-loader-spinner';
import { useTranslation } from 'react-i18next';

interface GoldRateProps {
  onClose?: () => void;
  laterBtn: boolean;
}
const GoldRate: React.FC<GoldRateProps> = ({ onClose, laterBtn }) => {
  // UseState
  const [goldRate, setGoldRate] = useState<string>('');
  const [err, seterr] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean | null>(null);

  // Hooks
  const { addGoldRate, updateGoldRate, fetchRateIfNeeded, rateData } =
    useKalamsData();

  // For Translation
  const { t } = useTranslation();

  // For fetching the data
  useEffect(() => {
    fetchRateIfNeeded();
  }, []);

  // For saving a new gold rate
  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await addGoldRate({ goldRate: Number(goldRate) });

      if (response?.success === false) {
        seterr('You have already set the gold rate.Try updating its');
      } else {
        console.log('Gold rate saved:', goldRate);
      }
      onClose?.();
    } catch (error) {
      console.error('Failed to save gold rate');
      seterr('Failed to save gold rate.');
    } finally {
      setLoading(false);
    }
  };

  // For updating the gold rate
  const handleUpdate = async () => {
    try {
      setLoading(true);
      if (!rateData[0]?._id) {
        seterr('No existing rate found to update.');
        return;
      }
      await updateGoldRate(rateData[0]._id, {
        goldRate: Number(goldRate),
      });

      console.log('Gold rate updated:', goldRate);
      seterr(null);
      onClose?.();
    } catch (error) {
      console.error('Failed to update gold rate');
      seterr('Failed to update gold rate.');
    } finally {
      setLoading(false);
    }
  };

  // for loading
  if (loading) {
    return (
      <Box>
        <Dialog
          open={loading}
          PaperProps={{
            sx: {
              background: 'transparent',
              boxShadow: 'none',
            },
          }}
        >
          <DialogContent
            sx={{
              background: 'transparent !important',
              boxShadow: 'none',
              padding: 0,
            }}
          >
            <Box
              sx={{
                background: 'transparent',
                boxShadow: 'none',
                display: 'flex',
                justifyContent: 'center',
                alignContent: 'center',
              }}
            >
              <TailSpin
                visible={true}
                height="80"
                width="80"
                color="#1976d2"
                ariaLabel="tail-spin-loading"
                radius="1"
                wrapperStyle={{}}
                wrapperClass=""
              />
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          width: 350,
          borderRadius: 4,
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          backgroundColor: '#fefefe',
        }}
      >
        <Typography variant="h5" gutterBottom textAlign="center">
          {t('Settings.goldRate')}
        </Typography>

        {/* Current Gold Rate Display */}
        {rateData.length > 0 && (
          <Box
            sx={{
              mb: 3,
              py: 1.5,
              px: 2,
              borderRadius: 2,
              backgroundColor: '#e8f5e9',
              border: '1px solid #c8e6c9',
            }}
          >
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              {t('Settings.goldRatePage.currentRate')}
            </Typography>

            {/* Current Gold Rate */}
            <Typography variant="h6" color="green">
              ₹{rateData[0].goldRate} / {t('Settings.goldRatePage.gram')}
            </Typography>
          </Box>
        )}

        {/* Input box for adding or updating the gold rate */}
        <TextField
          fullWidth
          label={t('Settings.goldRatePage.newGoldRate')}
          type="number"
          value={goldRate}
          onChange={(e) => setGoldRate(e.target.value)}
          sx={{ mb: 3 }}
        />

        {/* Save Button */}
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={rateData.length > 0}
        >
          {t('Settings.goldRatePage.save')}
        </Button>

        {/* Update Button */}
        <Button
          fullWidth
          variant="contained"
          color="success"
          onClick={handleUpdate}
          disabled={!rateData.length}
          sx={{ mt: 2 }}
        >
          {t('Settings.goldRatePage.update')}
        </Button>

        {err && (
          <Typography sx={{ color: 'red', textAlign: 'center', mt: 3 }}>
            {err}
          </Typography>
        )}

        {/* remind me later button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            size="small"
            onClick={() => onClose?.()}
            sx={{
              display: laterBtn ? 'block' : 'none',
              textTransform: 'none',
              '&:focus': { outline: 'none' },
            }}
          >
            Remind me later
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};
export default GoldRate;
