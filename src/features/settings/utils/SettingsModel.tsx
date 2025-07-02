import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogContent } from '@mui/material';
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
    <Dialog
      open={open}
      onClose={handleClose}
      BackdropProps={{
        sx: {
          backdropFilter: 'blur(5px)', // <- blur effect
          backgroundColor: 'rgba(0, 0, 0, 0.2)', // optional: slightly dimmed
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: 'none',
          background: 'none',
        },
      }}
    >
      <DialogContent sx={{ boxShadow: 'none', position: 'relative', p: 0 }}>
        <Settings
          onClose={handleClose}
          laterBtn={open === true ? true : false}
        />
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
