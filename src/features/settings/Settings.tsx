import React from 'react';
import { Button, Typography, IconButton } from '@mui/material';

import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <>
      <Button
        sx={{
          border: '1px solid lightgrey',
          display: 'inline-block',
          p: 3,
          ml: 3,
          borderRadius: '10px',
          textAlign: 'center',
          color: 'black',
          ':hover': {
            background: 'none',
            border: '1px solid lightgrey',
          },
          ':focus': {
            outline: 'none',
          },
        }}
        onClick={() => {
          navigate('/settings/goldrate');
        }}
      >
        <IconButton aria-label="Gold Rate">
          <TrendingUpIcon sx={{ fontSize: 'larger' }} />
        </IconButton>
        <Typography>{t('Settings.goldRate')}</Typography>
      </Button>
    </>
  );
};

export default Settings;
