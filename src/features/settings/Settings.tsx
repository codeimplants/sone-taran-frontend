import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  DialogContent,
  Dialog,
} from '@mui/material';
import useKalamsData from '../../hooks/useKalamsData';

// Loader
import { TailSpin } from 'react-loader-spinner';

interface SettingsProps {
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onClose }) => {
  const [goldRate, setGoldRate] = useState<string>('');
  const { addGoldRate, updateGoldRate, fetchRateIfNeeded, rateData } =
    useKalamsData();

  useEffect(() => {
    fetchRateIfNeeded();
  }, []);

  const [err, seterr] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean | null>(null);

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await addGoldRate({ goldRate: Number(goldRate) });

      if (response?.success === false) {
        seterr('You have already set the gold rate.Try updating its');
      } else {
        console.log('Gold rate saved:', goldRate);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save gold rate');
      seterr('Failed to save gold rate.');
    } finally {
      setLoading(false);
    }
  };
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
      onClose();
    } catch (error) {
      console.error('Failed to update gold rate');
      seterr('Failed to update gold rate.');
    } finally {
      setLoading(false);
    }
  };

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
        sx={{ backgroundColor: 'none', padding: 4, width: 300 }}
      >
        <Typography variant="h6" gutterBottom>
          Settings
        </Typography>

        <TextField
          fullWidth
          label="Set Gold Rate (₹ per gram)"
          type="number"
          value={goldRate}
          onChange={(e) => setGoldRate(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleSave}
          disabled={rateData.length > 0}
        >
          Save
        </Button>
        <Button
          fullWidth
          variant="contained"
          color="success"
          onClick={handleUpdate}
          disabled={!rateData.length}
          sx={{ mt: 2 }}
        >
          Update
        </Button>
        <Typography sx={{ color: 'red', textAlign: 'center', mt: 3 }}>
          {err}
        </Typography>
      </Paper>
    </Box>
  );
};

export default Settings;
