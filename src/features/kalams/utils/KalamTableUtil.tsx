import {
  Box,
  Button,
  IconButton,
  InputBase,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CustomerDetails, Kalam, KalamDetails } from '../models/Kalam';
import React, { useEffect, useState } from 'react';

// Mui Icons
import InfoIcon from '@mui/icons-material/Info';
import { Visibility } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';

// Formik
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Utils
import {
  calculateMonthsAndDays,
  convertToYearsMonthsDays,
} from '../../../utils/CountDaysUtil';
import { calculateAnnualCompoundInterest } from '../../../utils/InterestCalculatorUtil';
import { useNavigate } from 'react-router-dom';

// Component Imports
import KalamDialogs from './KalamDialog';
import { format } from 'date-fns';
import { calculateTodaysValue, formatLoanDuration } from './kalamTableHelper';
import useKalamsData from '../../../hooks/useKalamsData';
import { calculateMaxLoanTenure2 } from '../../../utils/MaxLoanTenureUtil';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

interface kalamTabelProps {
  data: Kalam[];
}
const useKalamtable: React.FC<kalamTabelProps> = (props) => {
  const { data } = props;

  // For translation
  const { t } = useTranslation();

  // For stroing the filtered data
  const [filteredData, setFilteredData] = useState(data);

  // For Opening the Model
  const [sortModal, setSortModal] = useState<boolean>(false);

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
  const [selectedCustomer, setSelectedCustomer] =
    useState<CustomerDetails | null>(null);
  const [selectedKalam, setSelectedKalam] = useState<KalamDetails | null>(null);

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

  const navigate = useNavigate();

  // for sort

  const [amountRange, setAmountRange] = useState<number[]>([0, 100000]);

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      setAmountRange(newValue);
    }
  };
  const valuetext = (value: number) => `${value}`;

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

      const stripTime = (d: Date): Date => {
        return new Date(d.getFullYear(), d.getMonth(), d.getDate());
      };

      const filtered = data.filter((item) => {
        const rawDateStr = item?.kalam?.loanDetails?.loanStartDate;
        const amount = item?.kalam?.loanDetails?.totalAmt ?? 0;

        if (!rawDateStr || typeof rawDateStr !== 'string') return false;

        const parsed = new Date(rawDateStr);
        if (!parsed) return false;

        const kalamDate = stripTime(parsed);
        const fromDate = from ? stripTime(from) : null;
        const toDate = to ? stripTime(to) : null;

        const dateValid =
          fromDate && toDate
            ? kalamDate >= fromDate && kalamDate <= toDate
            : true;

        const amountValid = amount >= minAmount && amount <= maxAmount;

        return dateValid && amountValid;
      });

      setFilteredData(filtered);
      setSortModal(false);
      sortformik.resetForm();

      console.log('Filtered result:', filtered);
    },
  });

  // For tabs
  const [value, setValue] = React.useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const [tabletab, setTableTab] = useState<{
    active: Kalam[];
    inactive: Kalam[];
  }>({ active: [], inactive: [] });

  useEffect(() => {
    if (!filteredData || filteredData.length === 0) {
      setTableTab({ active: [], inactive: [] });
      return;
    }

    const active = filteredData.filter(
      (kalam) => kalam?.kalam?.loanDetails?.status === 'Active'
    );
    const inactive = filteredData.filter(
      (kalam) => kalam?.kalam?.loanDetails?.status !== 'Active'
    );

    setTableTab({ active, inactive });
  }, [filteredData]);

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
      <Box sx={{ width: '100%', mt: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Active" {...a11yProps(0)} />
            <Tab label="In-active" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <TableContainer component={Paper} sx={{ width: '100%', p: 0 }}>
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
                {tabletab.active.map((kalam) => {
                  const loanStartDate = new Date(
                    kalam.kalam.loanDetails.loanStartDate
                  );
                  const { totalMonths, days } =
                    calculateMonthsAndDays(loanStartDate);
                  const loanDuration = convertToYearsMonthsDays(
                    totalMonths,
                    days
                  );
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
                    customerDue +
                    kalam.kalam.loanDetails.dukandarAmt -
                    vyapariDue;

                  const valueToday = calculateTodaysValue(
                    kalam.kalam.details.netWeight,
                    kalam.kalam.details.purity,
                    kalam.goldRate[0].goldRate
                  );

                  const maxLoanTenure = calculateMaxLoanTenure2(
                    valueToday,
                    valueToday,
                    kalam.kalam.loanDetails.customerROI
                  );

                  return (
                    <TableRow key={kalam._id}>
                      {/* Kalam ID  */}
                      <TableCell>{kalam.kalam.loanId}</TableCell>

                      {/* Customer Name + Info Icon */}
                      <TableCell>
                        {kalam.customerDetails.name}
                        <IconButton
                          disableRipple
                          onClick={() =>
                            setSelectedCustomer(kalam.customerDetails)
                          }
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

                      <TableCell>
                        {format(
                          new Date(kalam.kalam.loanDetails.loanStartDate),
                          'dd-MMM-yy'
                        )}
                      </TableCell>
                      <TableCell>{formatLoanDuration(loanDuration)}</TableCell>
                      <TableCell>
                        ₹{kalam.kalam.loanDetails.customerAmt}
                      </TableCell>
                      <TableCell>
                        ₹{kalam.kalam.loanDetails.dukandarAmt}
                      </TableCell>
                      <TableCell>₹{kalam.kalam.loanDetails.totalAmt}</TableCell>

                      <TableCell>₹{customerDue}</TableCell>
                      <TableCell>₹{dukandarDue}</TableCell>
                      <TableCell>₹{vyapariDue}</TableCell>
                      <TableCell
                        sx={{
                          backgroundColor:
                            dukandarProfitLoss < 0
                              ? 'rgba(255, 0, 0, 0.1)' // soft red
                              : dukandarProfitLoss > 0
                              ? 'rgba(0, 128, 0, 0.1)' // soft green
                              : 'transparent',
                          color:
                            dukandarProfitLoss < 0
                              ? '#d32f2f' // strong red
                              : dukandarProfitLoss > 0
                              ? '#2e7d32' // strong green
                              : 'inherit',
                          fontWeight:
                            dukandarProfitLoss !== 0 ? 'bold' : 'normal',
                        }}
                      >
                        {dukandarProfitLoss}
                      </TableCell>
                      <TableCell>
                        {kalam.kalam.loanDetails.customerROI}%
                      </TableCell>
                      <TableCell>
                        {kalam.kalam.loanDetails.merchantROI}%
                      </TableCell>
                      <TableCell>
                        {kalam.merchantDetails?.name || '-'}
                      </TableCell>
                      <TableCell>{valueToday}</TableCell>
                      <TableCell
                        sx={{
                          backgroundColor:
                            valueToday - vyapariDue < 0
                              ? 'rgba(255, 0, 0, 0.1)' // soft red
                              : valueToday - vyapariDue > 0
                              ? 'rgba(0, 128, 0, 0.1)' // soft green
                              : 'transparent',
                          color:
                            valueToday - vyapariDue < 0
                              ? '#d32f2f' // strong red
                              : valueToday - vyapariDue > 0
                              ? '#2e7d32' // strong green
                              : 'inherit',
                          fontWeight:
                            valueToday - vyapariDue !== 0 ? 'bold' : 'normal',
                        }}
                      >
                        {valueToday - vyapariDue}
                      </TableCell>
                      <TableCell>{maxLoanTenure}</TableCell>

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
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <TableContainer component={Paper} sx={{ width: '100%', p: 0 }}>
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
                {tabletab.inactive.map((kalam) => {
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
                    customerDue +
                    kalam.kalam.loanDetails.dukandarAmt -
                    vyapariDue;
                  return (
                    <TableRow key={kalam._id}>
                      {/* Kalam ID  */}
                      <TableCell>{kalam.kalam.loanId}</TableCell>

                      {/* Customer Name + Info Icon */}
                      <TableCell>
                        {kalam.customerDetails.name}
                        <IconButton
                          disableRipple
                          onClick={() =>
                            setSelectedCustomer(kalam.customerDetails)
                          }
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

                      <TableCell>
                        {kalam.kalam.loanDetails.loanStartDate}
                      </TableCell>
                      <TableCell>{0}</TableCell>
                      <TableCell>
                        ₹{kalam.kalam.loanDetails.customerAmt}
                      </TableCell>
                      <TableCell>
                        ₹{kalam.kalam.loanDetails.dukandarAmt}
                      </TableCell>
                      <TableCell>₹{kalam.kalam.loanDetails.totalAmt}</TableCell>

                      <TableCell>₹{customerDue}</TableCell>
                      <TableCell>₹{dukandarDue}</TableCell>
                      <TableCell>₹{vyapariDue}</TableCell>
                      <TableCell>{dukandarProfitLoss}</TableCell>
                      <TableCell>
                        {kalam.kalam.loanDetails.customerROI}%
                      </TableCell>
                      <TableCell>
                        {kalam.kalam.loanDetails.merchantROI}%
                      </TableCell>
                      <TableCell>
                        {kalam.merchantDetails?.name || '-'}
                      </TableCell>
                      <TableCell>{0}</TableCell>
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
        </CustomTabPanel>
      </Box>
      {/* Table for Showing Kalam and customer Details  */}

      <KalamDialogs
        selectedCustomer={selectedCustomer}
        setSelectedCustomer={setSelectedCustomer}
        selectedKalam={selectedKalam}
        setSelectedKalam={setSelectedKalam}
        sortModal={sortModal}
        setSortModal={setSortModal}
        sortformik={sortformik}
        amountRange={amountRange}
        handleSliderChange={handleSliderChange}
        valuetext={valuetext}
      />
    </>
  );
};

export default useKalamtable;
