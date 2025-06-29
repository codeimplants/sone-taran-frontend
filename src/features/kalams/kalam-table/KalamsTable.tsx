import React, { useState } from 'react';

// Mui
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  BottomNavigation,
  BottomNavigationAction,
  Typography,
  Grid,
  TextField,
  Box,
  Button,
  Fab,
  InputBase,
  Slider,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// for form
import { useKalamForm } from '../utils/formSection';

// Mui Icons
import InfoIcon from '@mui/icons-material/Info';
import { Visibility } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';

import { useNavigate } from 'react-router-dom';

// Loader
import { TailSpin } from 'react-loader-spinner';

// Models
import { KalamProps } from '../models/KalamProps';
import { CustomerDetails, KalamDetails } from '../models/Kalam';

// Utils
import { calculateMonthsAndDays } from '../../../utils/CountDaysUtil';
import { calculateAnnualCompoundInterest } from '../../../utils/InterestCalculatorUtil';

// Formik
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Translation
import { useTranslation } from 'react-i18next';

function parseDDMMYYYY(dateStr: string): Date {
  const [day, month, year] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day); // month is 0-based
}

const KalamsTable: React.FC<KalamProps> = (props) => {
  const { data } = props;
  const { formik, formSections, loading } = useKalamForm();

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

  const { t } = useTranslation();

  // For geeting the data of customer and merchant
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerDetails | null>(null);
  const [selectedKalam, setSelectedKalam] = useState<KalamDetails | null>(null);

  const navigate = useNavigate();

  // For Opening the Model
  const [sortModal, setSortModal] = useState<boolean>(false);
  const [addModal, setAddModal] = useState(false);

  const calculateTodaysValue = () => '-';

  // For filter data
  const [filteredData, setFilteredData] = useState(data);

  // for sort
  const [amountRange, setAmountRange] = useState<number[]>([0, 100000]);

  const sortformik = useFormik({
    initialValues: {
      from: null as Date | null,
      to: null as Date | null,
    },
    validationSchema: Yup.object({
      from: Yup.date().required('Date is required').nullable(),
      to: Yup.date().required('Date is required').nullable(),
    }),
    onSubmit: async (values) => {
      const from = values.from;
      const to = values.to;
      const [minAmount, maxAmount] = amountRange;

      const filtered = data.filter((item) => {
        const rawDateStr = item?.kalam?.loanDetails.loanStartDate;
        console.log(rawDateStr);

        if (!rawDateStr || typeof rawDateStr !== 'string') return false;

        const date = parseDDMMYYYY(rawDateStr); // safe now
        const amount = item.kalam.loanDetails?.totalAmt ?? 0;

        const dateValid = from && to ? date >= from && date <= to : true;
        const amountValid = amount >= minAmount && amount <= maxAmount;

        return dateValid && amountValid;
      });

      setFilteredData(filtered);
      console.log(filtered);
      setSortModal(false);
      sortformik.resetForm();
    },
  });

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      setAmountRange(newValue);
    }
  };
  const valuetext = (value: number) => `${value}`;

  //  For Seraching kalam base don search Input
  const searchFunction = (value: any) => {
    const lowerSearch = value.toLowerCase();
    const filtered = data.filter(
      (item) =>
        item.customerDetails.name.toLowerCase().includes(lowerSearch) ||
        item.kalam.details.name.toLowerCase().includes(lowerSearch) ||
        item.kalam.loanId.toString().toLowerCase().includes(lowerSearch)
    );
    setFilteredData(filtered);
    console.log(filtered);
  };

  // Searching Using Debouncing
  const debouncingSearch = (func: Function, delay: number) => {
    let timer: any;
    return function (...args: any) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const handleSearch = (value: string) => {
    searchFunction(value);
  };

  const debouncedSearchHandler = debouncingSearch(handleSearch, 1000);

  return (
    <>
      {/* Search Bar  */}
      <Box sx={{ display: 'flex' }}>
        <Box>
          <Paper
            component="form"
            sx={{
              ml: 2,
              p: '2px 4px',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              width: 400,
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search Kalam"
              inputProps={{ 'aria-label': 'Search' }}
              onChange={(e) => {
                debouncedSearchHandler(e.target.value);
              }}
            />
            <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
        </Box>

        <Button
          sx={{
            ':focus': { outline: 'none' },
            color: 'white',
            textTransform: 'none',
            marginLeft: 'auto',
            mr: 4,
          }}
          variant="contained"
          onClick={() => {
            setSortModal(true);
          }}
        >
          Sort
          <TuneIcon sx={{ ml: 1 }} />
        </Button>
      </Box>

      {/* Table for Showing Kalam and customer Details  */}
      <TableContainer component={Paper} sx={{ width: '100%', mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('kalamPage.kalamId')}</TableCell>
              <TableCell>{t('kalamPage.customer')}</TableCell>
              <TableCell>{t('kalamPage.item')}</TableCell>
              <TableCell>{t('kalamPage.startDate')}</TableCell>
              <TableCell>{t('kalamPage.duration')}</TableCell>
              <TableCell>{t('kalamPage.customerLoanAmt')}</TableCell>
              <TableCell>{t('kalamPage.dukandarLoanAmt')}</TableCell>
              <TableCell>{t('kalamPage.totalLoan')}</TableCell>
              <TableCell>{t('kalamPage.customerDue')}</TableCell>
              <TableCell>{t('kalamPage.dukandarDue')}</TableCell>
              <TableCell>{t('kalamPage.vyapariDue')}</TableCell>
              <TableCell>{t('kalamPage.dukandarProfit')}</TableCell>
              <TableCell>{t('kalamPage.customerROI')}</TableCell>
              <TableCell>{t('kalamPage.vyapariROI')}</TableCell>
              <TableCell>{t('kalamPage.vyapariName')}</TableCell>
              <TableCell>{t('kalamPage.todayValue')}</TableCell>
              <TableCell>{t('kalamPage.balanceValue')}</TableCell>
              <TableCell>{t('kalamPage.validity')}</TableCell>
              <TableCell>{t('kalamPage.viewProfile')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((kalam) => {
              const loanStartDate = new Date(
                kalam.kalam.loanDetails.loanStartDate
              );
              const { totalMonths, days } =
                calculateMonthsAndDays(loanStartDate);
              const customerDue = calculateAnnualCompoundInterest(
                kalam.kalam.loanDetails.customerAmt,
                kalam.kalam.loanDetails.customerROI,
                totalMonths,
                days
              );
              const dukandarDue = calculateAnnualCompoundInterest(
                kalam.kalam.loanDetails.dukandarAmt,
                kalam.kalam.loanDetails.merchantROI,
                totalMonths,
                days
              );
              const vyapariDue = calculateAnnualCompoundInterest(
                kalam.kalam.loanDetails.totalAmt,
                kalam.kalam.loanDetails.merchantROI,
                totalMonths,
                days
              );
              const dukandarProfitLoss =
                customerDue + kalam.kalam.loanDetails.dukandarAmt - vyapariDue;
              return (
                <TableRow key={kalam._id}>
                  {/* Kalam ID  */}
                  <TableCell>{kalam.kalam.loanId}</TableCell>

                  {/* Customer Name + Info Icon */}
                  <TableCell>
                    {kalam.customerDetails.name}
                    <IconButton
                      disableRipple
                      onClick={() => setSelectedCustomer(kalam.customerDetails)}
                      sx={{
                        outline: 'none',
                        '&:focus': {
                          outline: 'none',
                        },
                      }}
                    >
                      <InfoIcon fontSize="small" color="primary" />
                    </IconButton>
                  </TableCell>

                  {/* Kalam Name + Info Icon */}
                  <TableCell>
                    {kalam.kalam.details.name}
                    <IconButton
                      onClick={() => setSelectedKalam(kalam.kalam)}
                      sx={{
                        outline: 'none',
                        '&:focus': {
                          outline: 'none',
                        },
                      }}
                    >
                      <InfoIcon fontSize="small" color="primary" />
                    </IconButton>
                  </TableCell>

                  <TableCell>{kalam.kalam.loanDetails.loanStartDate}</TableCell>
                  <TableCell>{0}</TableCell>
                  <TableCell>₹{kalam.kalam.loanDetails.customerAmt}</TableCell>
                  <TableCell>₹{kalam.kalam.loanDetails.dukandarAmt}</TableCell>
                  <TableCell>₹{kalam.kalam.loanDetails.totalAmt}</TableCell>

                  <TableCell>₹{customerDue}</TableCell>
                  <TableCell>₹{dukandarDue}</TableCell>
                  <TableCell>₹{vyapariDue}</TableCell>
                  <TableCell>{dukandarProfitLoss}</TableCell>
                  <TableCell>{kalam.kalam.loanDetails.customerROI}%</TableCell>
                  <TableCell>{kalam.kalam.loanDetails.merchantROI}%</TableCell>
                  <TableCell>{kalam.merchantDetails?.name || '-'}</TableCell>
                  <TableCell>{calculateTodaysValue()}</TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>-</TableCell>

                  {/* more info button  */}
                  <TableCell>
                    <IconButton
                      sx={{
                        outline: 'none',
                        '&:focus': {
                          outline: 'none',
                        },
                      }}
                      onClick={() =>
                        navigate(`/kalams/${kalam.kalam.loanId}`, {
                          state: kalam,
                        })
                      }
                    >
                      <Visibility fontSize="small" color="primary" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

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

export default KalamsTable;
