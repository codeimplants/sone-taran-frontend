import {
  Box,
  IconButton,
  InputBase,
  Paper,
  TextField,
  Typography,
  Button,
  Dialog,
  DialogContent,
  Fab,
  Grid,
  BottomNavigation,
  BottomNavigationAction,
} from '@mui/material';
import ExpandableCustomerCard from '../../../shared/components/expandable-card/ExpandableCard-Customer/ExpandableCustomerCard';
import { CustomerProps } from '../models/CustomerProps';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TailSpin } from 'react-loader-spinner';
import useCustomerData from '../../../hooks/useCustomersData';
import AddIcon from '@mui/icons-material/Add';

export default function CustomerCard(props: CustomerProps) {
  const { data } = props;

  // For filter data
  const [filteredData, setFilteredData] = useState(data);

  //  For Seraching Customer based on search Input
  const searchFunction = (value: any) => {
    const lowerSearch = value.toLowerCase();
    const filtered = data.filter(
      (item) =>
        item.customer.name.toLowerCase().includes(lowerSearch) ||
        item.customer.contact[0].toLowerCase().includes(lowerSearch) ||
        item.customer.contact[1].toLowerCase().includes(lowerSearch) ||
        item.customer.customerId.toString().toLowerCase().includes(lowerSearch)
    );
    setFilteredData(filtered);
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

  // For Adding new customer
  const [addModal, setAddModal] = useState(false);

  const [loading, setLoading] = useState<boolean>(false);
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

  const { addCustomerData } = useCustomerData();
  // formik for add form
  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      altPhone: '',
      street: '',
      city: '',
      zip: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      phone: Yup.string()
        .required('Phone number is required')
        .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
      street: Yup.string().required('Street is required'),
      city: Yup.string().required('City is required'),
      zip: Yup.string()
        .required(' Pin code is required')
        .matches(/^\d{6}$/, 'Invalid Pin code'),
    }),
    onSubmit: async (values) => {
      console.log('Submitting:', values);
      try {
        setLoading(true);
        addCustomerData({
          name: values.name,
          contact: [values.phone, values.altPhone],
          address: {
            street: values.street,
            city: values.city,
            zip: Number(values.zip),
          },
        });

        formik.resetForm();
        setAddModal(false);
        setLoading(false);
      } catch (err) {
        console.error('Add customer error:', err);
      }
    },
  });

  // Input box specification
  const formSections = [
    {
      title: 'Customer Information',
      fields: [
        {
          label: 'Customer Name',
          name: 'name',
          value: formik.values.name,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
          error: formik.touched.name && Boolean(formik.errors.name),
          helperText: formik.touched.name && formik.errors.name,
        },
        {
          label: 'Phone',
          name: 'phone',
          value: formik.values.phone,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
          error: formik.touched.phone && Boolean(formik.errors.phone),
          helperText: formik.touched.phone && formik.errors.phone,
        },
        {
          label: 'Alt Phone',
          name: 'altPhone',
          value: formik.values.altPhone,
        },
      ],
    },
    {
      title: 'Address',
      fields: [
        {
          label: 'Street',
          name: 'street',
          value: formik.values.street,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
          error: formik.touched.street && Boolean(formik.errors.street),
          helperText: formik.touched.street && formik.errors.street,
        },
        {
          label: 'City',
          name: 'city',
          value: formik.values.city,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
          error: formik.touched.city && Boolean(formik.errors.city),
          helperText: formik.touched.city && formik.errors.city,
        },
        {
          label: 'Zip Code',
          name: 'zip',
          value: formik.values.zip,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
          error: formik.touched.zip && Boolean(formik.errors.zip),
          helperText: formik.touched.zip && formik.errors.zip,
        },
      ],
    },
  ];

  return (
    <>
      <Box sx={{ p: 1 }}>
        <Box
          sx={{
            width: '60%',
            display: 'flex',
            pr: 2,
            border: '1px solid lightgray',
            borderRadius: '10px',
            mb: 5,
          }}
          component="form"
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
        </Box>

        {filteredData.map((customerItem, index) => (
          <ExpandableCustomerCard key={index} customer={customerItem} />
        ))}
        {/* for the add button at the bottom  */}
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
            '&:focus': {
              outline: 'none',
            },
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

        {/* Modal for the add  */}
        <Dialog
          open={addModal}
          onClose={() => setAddModal(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogContent>
            {/* Customer Information */}
            <Box sx={{ mt: 2 }} component="form" onSubmit={formik.handleSubmit}>
              <Box sx={{ mt: 2 }}>
                {formSections.map((section, index) => (
                  <Box key={index} sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                      {section.title}
                    </Typography>
                    <Grid container spacing={2}>
                      {section.fields.map((field, idx) => (
                        <Grid
                          item
                          xl={6}
                          lg={6}
                          md={6}
                          sm={6}
                          xs={12}
                          key={idx}
                        >
                          <TextField fullWidth {...field} />
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                ))}
              </Box>

              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Button
                  variant="contained"
                  sx={{ width: '60%', mt: 4 }}
                  type="submit"
                >
                  Add Customer
                </Button>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
    </>
  );
}
