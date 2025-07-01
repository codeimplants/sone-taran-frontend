import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent } from '@mui/material';
import Settings from '../Settings';
import { useAuth } from '../../auth/hooks/useAuth'; // update as per your file structure

const SettingsDialog: React.FC = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const key = `DialogShown`;
    const lastShown = localStorage.getItem(key);
    const now = Date.now();
    const nextDay = 24 * 60 * 60 * 1000;

    if (!lastShown || now - Number(lastShown) > nextDay) {
      setOpen(true);
    }
  }, [user?._id]);

  const handleClose = () => {
    if (user?._id) {
      const key = `DialogShown`;
      localStorage.setItem(key, Date.now().toString());
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent sx={{ boxShadow: 'none' }}>
        <Settings onClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
