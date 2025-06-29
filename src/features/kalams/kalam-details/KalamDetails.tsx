import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Typography,
  Box,
  Paper,
  Grid,
  Stack,
  Divider,
  Button,
  Dialog,
  DialogContent,
  TextField,
} from '@mui/material';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import useKalamsData from '../../../hooks/useKalamsData';
import useMerchantData from '../../../hooks/useMerchantData';
import useCustomerData from '../../../hooks/useCustomersData';
import { useTranslation } from 'react-i18next';
import { useKalamForm } from '../utils/formSection';
import EditIcon from '@mui/icons-material/Edit';

const KalamDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // data for the specification kalam
  const { state: data } = useLocation() as { state: any };

  // For edit Modal
  const [editModal, setEditModal] = useState(false);

  // Custom hooks
  const { deleteLoan, updateLoan } = useKalamsData();
  const { updateMerchant } = useMerchantData();
  const { updateCustomer } = useCustomerData();

  if (!data) return <Typography>Loading…</Typography>;

  //  Helper to render a label–value row
  const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <Grid container spacing={1}>
      <Grid item xs={5} sm={4} md={3}>
        <Typography fontWeight={600}>{label}</Typography>
      </Grid>
      <Grid item xs={7} sm={8} md={9}>
        <Typography>{value}</Typography>
      </Grid>
    </Grid>
  );

  /** Section wrapper */
  const Section = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <Box mb={4}>
      <Typography variant="h5" mb={2}>
        {title}
      </Typography>
      <Stack spacing={1}>{children}</Stack>
    </Box>
  );

  const navigate = useNavigate();

  // Formik for edit form
  const editFormik = useFormik({
    initialValues: {
      name: '',
      itemQuantity: '',
      phone: '',
      altPhone: '',
      street: '',
      city: '',
      zip: '',
      itemName: '',
      itemMaterial: '',
      netWeight: '',
      grossWeight: '',
      purity: '',
      goldRate: '',
      totalAmount: '',
      customerAmount: '',
      merchantROI: '',
      customerROI: '',
      loanStartDate: '',
      merchantName: '',
      shopName: '',
      merchantPhone: '',
      merchantStreet: '',
      merchantCity: '',
      merchantZip: '',
      dukandarAmount: '',
      dueAmount: '',
    },
    enableReinitialize: true, // Important to allow patching
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      itemQuantity: Yup.string().required('Quantity is required'),
      phone: Yup.string()
        .required('Phone number is required')
        .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
      street: Yup.string().required('Street is required'),
      city: Yup.string().required('City is required'),
      zip: Yup.string()
        .required('Pin code is required')
        .matches(/^\d{6}$/, 'Invalid Pin code'),
      itemName: Yup.string().required('Item Name is required'),
      itemMaterial: Yup.string().required('Item Type is required'),
      netWeight: Yup.number().required('Net Weight is required').positive(),
      grossWeight: Yup.number().required('Gross Weight is required').positive(),
      purity: Yup.number().required('Purity is required').positive(),
      goldRate: Yup.number().required('Gold Rate is required').positive(),
      totalAmount: Yup.number().required('Total Amount is required').positive(),
      customerAmount: Yup.number()
        .required('Customer Amount is required')
        .positive(),
      merchantROI: Yup.number().required('Merchant ROI is required').positive(),
      customerROI: Yup.number().required('Customer ROI is required').positive(),
      loanStartDate: Yup.date()
        .required('Loan Start Date is required')
        .nullable(),
      merchantName: Yup.string().required('Merchant Name is required'),
      shopName: Yup.string().required('Shop Name is required'),
      merchantPhone: Yup.string()
        .required('Merchant Phone is required')
        .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
      merchantStreet: Yup.string().required('Merchant Address is required'),
      merchantCity: Yup.string().required('Merchant Address is required'),
      merchantZip: Yup.string().required('Merchant Address is required'),
      dukandarAmount: Yup.string().required('Dukandar Amount is required'),
    }),
    onSubmit: async (values) => {
      console.log('Submitting:', values);
      try {
        // Customer
        const custName = values.name;
        const contact = [values.phone, values.altPhone];
        const { street, city, zip } = values;

        if (
          editFormik.touched.name ||
          editFormik.touched.phone ||
          editFormik.touched.altPhone ||
          editFormik.touched.street ||
          editFormik.touched.city ||
          editFormik.touched.zip
        ) {
          // updating the customer
          updateCustomer(data.customerDetails._id, {
            name: custName,
            contact: contact,
            address: {
              street: street,
              city: city,
              zip: Number(zip),
            },
          });
        }

        //Merchant
        const {
          merchantName,
          shopName,
          merchantStreet,
          merchantCity,
          merchantZip,
        } = values;
        const contactMerchant = [values.merchantPhone];

        if (
          editFormik.touched.merchantName ||
          editFormik.touched.shopName ||
          editFormik.touched.merchantCity ||
          editFormik.touched.merchantPhone ||
          editFormik.touched.merchantStreet ||
          editFormik.touched.merchantZip
        ) {
          // for updating merchant
          updateMerchant(data.merchantDetails._id, {
            name: merchantName,
            shopName: shopName,
            contact: contactMerchant,
            address: {
              street: merchantStreet,
              city: merchantCity,
              zip: Number(merchantZip),
            },
          });
        }

        // For updating the kalam
        updateLoan(data._id, {
          loans: {
            details: {
              name: values.itemName,
              number: Number(values.itemQuantity),
              materialType: values.itemMaterial,
              netWeight: Number(values.netWeight),
              grossWeight: Number(values.grossWeight),
              purity: Number(values.purity),
              goldRateAtLoan: Number(values.goldRate),
            },

            loanDetails: {
              totalAmt: Number(values.totalAmount),
              customerAmt: Number(values.customerAmount),
              dukandarAmt: Number(values.dukandarAmount),
              merchantROI: Number(values.merchantROI),
              customerROI: Number(values.customerROI),
              loanStartDate: values.loanStartDate,
              dueAmount: Number(values.dueAmount),
              validity: 'valid',
            },
          },
        });
        navigate('/kalams');
        editFormik.resetForm();
        setEditModal(false);
      } catch (err) {
        console.error('Add customer error:', err);
      }
    },
  });

  const { formSections } = useKalamForm();

  // for deleting the kalam
  const deleteloan = async () => {
    try {
      deleteLoan(data._id);
      navigate('/kalams');
    } catch (error) {
      console.log(error);
    }
  };

  const { t } = useTranslation();

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: { xs: 2, md: 3 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
        <Typography variant="h4" mb={4}>
          {t('kalamDetailsPage.kalam')}&nbsp;ID:&nbsp;
          {id === undefined ? '-' : id}
        </Typography>

        {/* Kalam details */}
        <Section title={t('kalamDetailsPage.kalamDetail')}>
          <Row
            label={t('kalamDetailsPage.kalams.itemName')}
            value={data.kalam.details.name}
          />
          <Row
            label={t('kalamDetailsPage.kalams.materialType')}
            value={data.kalam.details.materialType}
          />
          <Row
            label={t('kalamDetailsPage.kalams.goldRate')}
            value={data.kalam.details.goldRateAtLoan}
          />
          <Row
            label={t('kalamDetailsPage.kalams.grossWeight')}
            value={data.kalam.details.grossWeight}
          />
          <Row
            label={t('kalamDetailsPage.kalams.netWeight')}
            value={data.kalam.details.netWeight}
          />
          <Row
            label={t('kalamDetailsPage.kalams.purity')}
            value={data.kalam.details.purity}
          />
          <Row
            label={t('kalamDetailsPage.kalams.quantity')}
            value={data.kalam.details.number}
          />
        </Section>

        <Divider sx={{ my: 3 }} />

        {/* Loan details */}
        <Section title={t('kalamDetailsPage.loanDetails')}>
          <Row
            label={t('kalamDetailsPage.Loan.loanStartDate')}
            value={data.kalam.loanDetails.loanStartDate}
          />
          <Row
            label={t('kalamDetailsPage.Loan.customerAmt')}
            value={data.kalam.loanDetails.customerAmt}
          />
          <Row
            label={t('kalamDetailsPage.Loan.customerROI')}
            value={data.kalam.loanDetails.customerROI}
          />
          <Row
            label={t('kalamDetailsPage.Loan.dukandarAmt')}
            value={data.kalam.loanDetails.dukandarAmt}
          />
          <Row
            label={t('kalamDetailsPage.Loan.dukandarROI')}
            value={data.kalam.loanDetails.merchantROI}
          />
          <Row
            label={t('kalamDetailsPage.Loan.totalAmt')}
            value={data.kalam.loanDetails.totalAmt}
          />
          <Row
            label={t('kalamDetailsPage.Loan.validity')}
            value={data.kalam.loanDetails.validity}
          />
        </Section>

        <Divider sx={{ my: 3 }} />

        {/* Customer details */}
        <Section title={t('kalamDetailsPage.customerDetails')}>
          <Row
            label={t('kalamDetailsPage.customerMerchantFields.name')}
            value={data.customerDetails.name}
          />
          <Row
            label={t('kalamDetailsPage.customerMerchantFields.contact')}
            value={data.customerDetails.contact?.[0] ?? '—'}
          />
          <Row
            label={t('kalamDetailsPage.customerMerchantFields.address')}
            value={
              <>
                {data.customerDetails.address.street},
                {data.customerDetails.address.city},
                {data.customerDetails.address.zip}
              </>
            }
          />
        </Section>

        <Divider sx={{ my: 3 }} />

        {/* Merchant details */}
        <EditIcon />
        <Section title={t('kalamDetailsPage.merchantDetails')}>
          <Row
            label={t('kalamDetailsPage.customerMerchantFields.name')}
            value={data.merchantDetails?.name || '-'}
          />
          <Row
            label={t('kalamDetailsPage.customerMerchantFields.contact')}
            value={data.merchantDetails?.contact?.[0] ?? '—'}
          />
          <Row
            label={t('kalamDetailsPage.customerMerchantFields.address')}
            value={
              <>
                {data.merchantDetails?.address.street || '-'},&nbsp;
                {data.merchantDetails?.address.city || '-'},&nbsp;
                {data.merchantDetails?.address.zip || '-'}
              </>
            }
          />
        </Section>

        {/* for edit an delete button  */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="error"
            sx={{ marginLeft: '8px', width: '30%' }}
            onClick={() => {
              deleteloan();
            }}
          >
            {t('kalamDetailsPage.delete')}
          </Button>
        </Box>
      </Paper>

      {/* For edit kalam */}
      <Dialog
        open={editModal}
        onClose={() => setEditModal(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
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
    </Box>
  );
};

export default KalamDetails;
