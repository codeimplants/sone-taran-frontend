import React, { useState } from 'react';
import { Box, Button, Menu, MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';
import PublicIcon from '@mui/icons-material/Public';

const languages = [
  { code: 'en', lang: 'English' },
  { code: 'mr', lang: 'Marathi' },
];

interface colorChange {
  colorChange: boolean;
}

const CustomerDetails: React.FC<colorChange> = (props) => {
  const { i18n } = useTranslation();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (code: string) => {
    i18n.changeLanguage(code);
    setAnchorEl(null);
  };

  return (
    <Box>
      <Button
        sx={{
          color: props.colorChange == true ? 'white' : 'black',
          '&:focus': { outline: 'none' },
        }}
        onClick={handleClick}
      >
        <PublicIcon sx={{ fontSize: 'x-large' }} />
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
        {languages.map(({ code, lang }) => (
          <MenuItem key={code} onClick={() => handleClose(code)}>
            {lang}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default CustomerDetails;
