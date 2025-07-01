import { Typography } from '@mui/material';
import SettingsDialog from '../settings/utils/SettingsModel';

const Dashboard: React.FC = () => {
  return (
    <>
      <SettingsDialog />
      <Typography>Dashboard</Typography>
    </>
  );
};
export default Dashboard;
