import React, { useState } from 'react';

// Mui
import {
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  BottomNavigation,
  BottomNavigationAction,
  Typography,
  Grid,
  TextField,
  Box,
  Button,
  Fab,
} from '@mui/material';

// for form
import { useKalamForm } from '../utils/formSection';

import KalamTableUtil from '../utils/KalamTableUtil';

// Mui Icons
import AddIcon from '@mui/icons-material/Add';

// Loader
import { TailSpin } from 'react-loader-spinner';

// Models
import { KalamProps } from '../models/KalamProps';

const KalamsTable: React.FC<KalamProps> = (props) => {
  const { data } = props;
  const { formik, formSections, loading } = useKalamForm();

  const [addModal, setAddModal] = useState(false);
  return (
    <>
      {/* Show loader as an overlay */}
      <Dialog
        open={loading}
        PaperProps={{
          sx: {
            background: 'transparent',
            boxShadow: 'none',
          },
        }}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.3)', // optional blur effect
            backdropFilter: 'blur(2px)',
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
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100px',
            }}
          >
            <TailSpin
              visible={true}
              height="80"
              width="80"
              color="#1976d2"
              ariaLabel="tail-spin-loading"
              radius="1"
            />
          </Box>
        </DialogContent>
      </Dialog>

      {/* Kalam Tabel */}
      <KalamTableUtil data={data} />

      {/* for a add kalam button at the bottom */}
      <Paper
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'none',
          boxShadow: 'none',
          display: 'flex',
          justifyContent: 'flex-end',
          pr: { xl: 4, xs: 0 },
          mb: 2,
          width: '5%',
          marginLeft: 'auto',
        }}
        elevation={3}
      >
        <BottomNavigation
          sx={{
            height: '0',
            background: 'none',
            boxShadow: 'none',
          }}
        >
          <BottomNavigationAction
            label="Add"
            sx={{ boxShadow: 'none' }}
            icon={
              <Fab
                color="primary"
                aria-label="add"
                onClick={() => {
                  setAddModal(true);
                }}
              >
                <AddIcon />
              </Fab>
            }
          />
        </BottomNavigation>
      </Paper>

      {/* for adding the  Kalam  */}
      <Dialog
        open={addModal}
        onClose={() => setAddModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add Kalam</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={formik.handleSubmit}>
            {/* Customer Information */}
            <Box sx={{ mt: 2 }}>
              {formSections.map((section: any, index: number) => (
                <Box key={index} sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                    {section.title}
                  </Typography>
                  <Grid
                    container
                    spacing={{ xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
                  >
                    {section.fields.map((field: any, idx: number) => (
                      <Grid item xl={6} lg={6} md={6} sm={6} xs={12} key={idx}>
                        <TextField fullWidth {...field} />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ))}
            </Box>
            <Box
              sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}
            >
              <Button
                variant="contained"
                sx={{ width: '60%', mt: 4 }}
                type="submit"
              >
                Add Kalam
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default KalamsTable;
