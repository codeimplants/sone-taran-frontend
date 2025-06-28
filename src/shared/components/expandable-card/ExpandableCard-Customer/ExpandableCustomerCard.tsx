import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Collapse,
  Avatar,
  Box,
  Dialog,
  DialogContent,
  Grid,
  TextField,
} from '@mui/material';
import { purple } from '@mui/material/colors';
import StatusChip from '../../status-chip/StatusChip';
import Divider from '@mui/material/Divider';
import { customer } from '../../../../features/customers/models/Customers';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { TailSpin } from 'react-loader-spinner';
import useCustomerData from '../../../../hooks/useCustomersData';
import { useTranslation } from 'react-i18next';

interface ExpandableCardProps {
  customer: customer;
}

const ExpandableCard: React.FC<ExpandableCardProps> = ({ customer }) => {
  // for translation
  const { t } = useTranslation();

  // for expanding the card
  const [expanded, setExpanded] = useState(false);

  // Opening the modal

  const [editModal, setEditModal] = useState(false);

  // Custom hooks
  const { updateCustomer, deleteCustomer } = useCustomerData();

  const navigate = useNavigate();

  // Toggle the expanded state when the card is clicked
  const handleCardClick = () => {
    setExpanded(!expanded);
  };

  // For Loader
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

  // formik for edit form
  const editFormik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      altPhone: '',
      street: '',
      city: '',
      zip: '',
    },
    enableReinitialize: true, // Important to allow patching
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
      console.log('Updating:', values);
      try {
        setLoading(true);
        updateCustomer(customer._id, {
          name: values.name,
          contact: [values.phone],
          address: {
            street: values.street,
            city: values.city,
            zip: Number(values.zip),
          },
        });
        setLoading(false);
        setEditModal(false);
        editFormik.resetForm();
      } catch (err) {
        console.error('Edit customer error:', err);
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
          value: editFormik.values.name,
          onChange: editFormik.handleChange,
          onBlur: editFormik.handleBlur,
          error: editFormik.touched.name && Boolean(editFormik.errors.name),
          helperText: editFormik.touched.name && editFormik.errors.name,
        },
        {
          label: 'Phone',
          name: 'phone',
          value: editFormik.values.phone,
          onChange: editFormik.handleChange,
          onBlur: editFormik.handleBlur,
          error: editFormik.touched.phone && Boolean(editFormik.errors.phone),
          helperText: editFormik.touched.phone && editFormik.errors.phone,
        },
        {
          label: 'Alt Phone',
          name: 'altPhone',
          value: editFormik.values.altPhone,
        },
      ],
    },
    {
      title: 'Address',
      fields: [
        {
          label: 'Street',
          name: 'street',
          value: editFormik.values.street,
          onChange: editFormik.handleChange,
          onBlur: editFormik.handleBlur,
          error: editFormik.touched.street && Boolean(editFormik.errors.street),
          helperText: editFormik.touched.street && editFormik.errors.street,
        },
        {
          label: 'City',
          name: 'city',
          value: editFormik.values.city,
          onChange: editFormik.handleChange,
          onBlur: editFormik.handleBlur,
          error: editFormik.touched.city && Boolean(editFormik.errors.city),
          helperText: editFormik.touched.city && editFormik.errors.city,
        },
        {
          label: 'Zip Code',
          name: 'zip',
          value: editFormik.values.zip,
          onChange: editFormik.handleChange,
          onBlur: editFormik.handleBlur,
          error: editFormik.touched.zip && Boolean(editFormik.errors.zip),
          helperText: editFormik.touched.zip && editFormik.errors.zip,
        },
      ],
    },
  ];

  // for deleting the customer
  const deleteCust = async () => {
    try {
      deleteCustomer(customer._id);
    } catch (error) {
      console.error('error:', error);
    }
  };

  return (
    <>
      {/* For card  */}
      <Card sx={{ cursor: 'pointer', mt: 2 }}>
        <Box onClick={handleCardClick}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              marginBottom: '2px',
            }}
          >
            <Avatar
              sx={{
                bgcolor: purple[500],
                height: 33,
                fontSize: '13px',
                fontWeight: 800,
              }}
              variant="square"
            >
              {customer.customer.customerId}
            </Avatar>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography sx={{ fontSize: '12px', fontWeight: '700' }}>
                  {customer.customer.name}
                </Typography>
              </Box>
            </Box>
            <StatusChip status="active" />
          </Box>
          <Divider />
          <Box sx={{ display: 'flex', gap: 1, padding: '0.5rem' }}>
            <Box>
              <Typography
                sx={{ fontSize: '12px' }}
                variant="body1"
                gutterBottom
              >
                <Typography
                  sx={{ fontSize: '12px' }}
                  component="span"
                  fontWeight="bold"
                >
                  {t('customerCard.contact')}
                </Typography>
                {customer.customer.contact[0] === undefined
                  ? '-'
                  : customer.customer.contact[1] === undefined
                  ? customer.customer.contact[0]
                  : `${customer.customer.contact[0]} / ${customer.customer.contact[1]}`}
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box>
              <Typography
                sx={{ fontSize: '12px' }}
                variant="body1"
                gutterBottom
              >
                <Typography
                  component="span"
                  fontWeight="bold"
                  sx={{ fontSize: '12px' }}
                >
                  {t('customerCard.address')}
                </Typography>
                {customer.customer.address.street},
                {customer.customer.address.city},{customer.customer.address.zip}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider />
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                navigate(`/customers/${customer.customer.customerId}`, {
                  state: customer,
                })
              }
            >
              {t('customerCard.view')}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              sx={{ marginLeft: '8px' }}
              onClick={() => {
                editFormik.setValues({
                  name: customer.customer.name || '',
                  phone: customer.customer.contact[0] || '',
                  altPhone: customer.customer.contact[1] || '',
                  street: customer.customer.address.street || '',
                  city: customer.customer.address.city || '',
                  zip: String(customer.customer.address.zip) || '',
                });
                setEditModal(true);
              }}
            >
              {t('customerCard.edit')}
            </Button>

            <Button
              variant="contained"
              color="error"
              sx={{ marginLeft: '8px' }}
              onClick={() => {
                deleteCust();
              }}
            >
              {t('customerCard.delete')}
            </Button>
          </CardContent>
        </Collapse>
      </Card>

      

      {/* Modal For edit Customer */}
      <Dialog
        open={editModal}
        onClose={() => setEditModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          {/* Customer Information */}
          <Box
            sx={{ mt: 2 }}
            component="form"
            onSubmit={editFormik.handleSubmit}
          >
            <Box sx={{ mt: 2 }}>
              {formSections.map((section, index) => (
                <Box key={index} sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                    {section.title}
                  </Typography>
                  <Grid container spacing={2}>
                    {section.fields.map((field, idx) => {
                      const formikObj = {
                        ...field,
                        value:
                          editFormik.values[
                            field.name as keyof typeof editFormik.values
                          ],
                        onChange: editFormik.handleChange,
                        onBlur: editFormik.handleBlur,
                        error:
                          editFormik.touched[
                            field.name as keyof typeof editFormik.touched
                          ] &&
                          Boolean(
                            editFormik.errors[
                              field.name as keyof typeof editFormik.errors
                            ]
                          ),
                        helperText:
                          editFormik.touched[
                            field.name as keyof typeof editFormik.touched
                          ] &&
                          editFormik.errors[
                            field.name as keyof typeof editFormik.errors
                          ],
                      };
                      return (
                        <Grid
                          item
                          xl={6}
                          lg={6}
                          md={6}
                          sm={6}
                          xs={12}
                          key={idx}
                        >
                          <TextField fullWidth {...formikObj} />
                        </Grid>
                      );
                    })}
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
                Save Changes
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ExpandableCard;
