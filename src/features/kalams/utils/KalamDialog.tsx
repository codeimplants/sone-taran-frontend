import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  List,
  ListItem,
  ListItemText,
  Slider,
  Typography,
} from '@mui/material';
import { CustomerDetails, KalamDetails } from '../models/Kalam';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { FormikProps } from 'formik';

interface KalamDialogsProps {
  selectedCustomer: CustomerDetails | null;
  setSelectedCustomer: (customer: CustomerDetails | null) => void;
  selectedKalam: KalamDetails | null;
  setSelectedKalam: (kalam: KalamDetails | null) => void;
  sortModal: boolean;
  setSortModal: (sort: boolean) => void;
  sortformik: FormikProps<{
    from: Date | null;
    to: Date | null;
  }>;
  amountRange: number[];
  handleSliderChange: (event: Event, newValue: number | number[]) => void;
  valuetext: (value: number) => string;
}
const KalamDialogs: React.FC<KalamDialogsProps> = ({
  selectedCustomer,
  setSelectedCustomer,
  selectedKalam,
  setSelectedKalam,
  sortModal,
  setSortModal,
  sortformik,
  amountRange,
  handleSliderChange,
  valuetext,
}) => {
  return (
    <>
      {/* Customer Info Dialog */}
      <Dialog
        open={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
      >
        <DialogTitle>Customer Info</DialogTitle>
        <DialogContent>
          {selectedCustomer && (
            <List>
              <ListItem>
                <ListItemText
                  primary="Address"
                  secondary={`${selectedCustomer.address.street}, ${selectedCustomer.address.city} - ${selectedCustomer.address.zip}`}
                />
              </ListItem>
              {selectedCustomer.contact.map((phone, index) => (
                <ListItem key={index} component="a" href={`tel:${phone}`}>
                  <ListItemText primary="Phone" secondary={phone} />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>
      {/* Kalam Info Dialog */}
      <Dialog open={!!selectedKalam} onClose={() => setSelectedKalam(null)}>
        <DialogTitle>Kalam Details</DialogTitle>
        <DialogContent>
          {selectedKalam && (
            <List>
              <ListItem>
                <ListItemText
                  primary="Type"
                  secondary={selectedKalam.details.materialType}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Net Weight"
                  secondary={`${selectedKalam.details.netWeight}g`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Gross Weight"
                  secondary={`${selectedKalam.details.grossWeight}g`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Purity"
                  secondary={`${selectedKalam.details.purity}%`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Gold Rate at Loan"
                  secondary={`₹${selectedKalam.details.goldRateAtLoan}`}
                />
              </ListItem>
            </List>
          )}
        </DialogContent>
      </Dialog>
      {/* for adding sort modal */}
      <Dialog
        open={sortModal}
        onClose={() => setSortModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Sort Kalam</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={sortformik.handleSubmit}>
            {/* Customer Information */}
            <Box sx={{ mt: 2 }}>
              <Box sx={{ mb: 4 }}>
                <Grid container spacing={{ xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}>
                  <Grid item xl={6} lg={6} md={6} sm={6} xs={12} p={4}>
                    <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                      Sort by Date
                    </Typography>

                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        label="from"
                        value={sortformik.values.from}
                        onChange={(newValue) =>
                          sortformik.setFieldValue('from', newValue)
                        }
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: Boolean(
                              sortformik.touched.from && sortformik.errors.from
                            ),
                            helperText:
                              sortformik.touched.from && sortformik.errors.from,
                          },
                        }}
                      />
                      <DatePicker
                        label="To"
                        value={sortformik.values.to}
                        onChange={(newValue) =>
                          sortformik.setFieldValue('to', newValue)
                        }
                        sx={{ mt: 3 }}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            error: Boolean(
                              sortformik.touched.to && sortformik.errors.to
                            ),
                            helperText:
                              sortformik.touched.to && sortformik.errors.to,
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </Grid>

                  <Grid item xl={6} lg={6} md={6} sm={6} xs={12} p={4}>
                    <Typography variant="h6" gutterBottom sx={{ mb: 2, mt: 5 }}>
                      Sort by Amount
                    </Typography>
                    <Slider
                      getAriaLabel={() => 'Amount range'}
                      value={amountRange}
                      onChange={handleSliderChange}
                      getAriaValueText={valuetext}
                      valueLabelDisplay="auto"
                      min={10}
                      max={100000}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Box>
            <Box
              sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}
            >
              <Button
                variant="contained"
                sx={{ width: '60%', mt: 4 }}
                type="submit"
              >
                Save
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default KalamDialogs;
