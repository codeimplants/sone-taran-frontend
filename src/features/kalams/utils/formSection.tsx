import { useState } from 'react';

// Formik
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Hooks
import useKalamsData from '../../../hooks/useKalamsData';
import useMerchantData from '../../../hooks/useMerchantData';
import useCustomerData from '../../../hooks/useCustomersData';

// Formik
export const useKalamForm = () => {
  // For Loader
  const [loading, setLoading] = useState<boolean>(false);

  const { addData } = useKalamsData();
  const { searchMerchant, AddMerchantData } = useMerchantData();
  const { searchCustomer, addCustomerData } = useCustomerData();

  const formik = useFormik({
    initialValues: {
      // Customer Details
      name: '',
      phone: '',
      altPhone: '',
      street: '',
      city: '',
      zip: '',
      // Item Details
      itemName: '',
      itemQuantity: '',
      itemMaterial: '',
      netWeight: '',
      grossWeight: '',
      purity: '',

      // Mortgage Details
      totalAmount: '',
      customerAmount: '',
      dueAmount: '',
      merchantROI: '',
      customerROI: '',
      loanStartDate: '',

      // Merchant Details
      merchantName: '',
      shopName: '',
      merchantPhone: '',
      merchantStreet: '',
      merchantCity: '',
      merchantZip: '',
      dukandarAmount: '',
    },
    validationSchema: Yup.object({
      // Customer Details
      name: Yup.string().required('Name is required'),
      phone: Yup.string()
        .required('Phone number is required')
        .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits'),
      altPhone: Yup.string().matches(
        /^\d{10}$/,
        'Alternate Phone number should be exactly 10 numbers'
      ),
      street: Yup.string().required('Street is required'),
      city: Yup.string().required('City is required'),
      zip: Yup.string()
        .required('Pin code is required')
        .matches(/^\d{6}$/, 'Invalid Pin code'),

      // Item Details
      itemName: Yup.string().required('Item Name is required'),
      itemQuantity: Yup.number().required('Quantity is required'),
      itemMaterial: Yup.string().required('Item Type is required'),
      netWeight: Yup.number().required('Net Weight is required').positive(),
      grossWeight: Yup.number().required('Gross Weight is required').positive(),
      purity: Yup.number().required('Purity is required').positive(),

      // Mortgage Details
      customerAmount: Yup.number()
        .required('Customer Amount is required')
        .positive(),
      dueAmount: Yup.number().positive(),
      dukandarAmount: Yup.string().required('Dukandar Amount is required'),
      merchantROI: Yup.number().required('Merchant ROI is required').positive(),
      customerROI: Yup.number().required('Customer ROI is required').positive(),
      loanStartDate: Yup.date()
        .required('Loan Start Date is required')
        .nullable(),

      // Merchant Details
      merchantPhone: Yup.string().matches(
        /^\d{10}$/,
        'Phone number must be exactly 10 digits'
      ),
      merchantZip: Yup.string().matches(/^\d{6}$/, 'Invalid Pin code'),
    }),
    onSubmit: async (values) => {
      console.log('Submitting:', values);
      setLoading(true);
      try {
        // for searching and adding new customer data
        const custName = values.name;
        const contact = [values.phone, values.altPhone];
        const { street, city, zip } = values;

        let customerId = '';
        let searchResult;

        try {
          searchResult = await searchCustomer(custName, contact);

          console.log(searchResult.customer);
          if (searchResult.customer) {
            customerId = searchResult.customer.customerId;
          } else {
            throw new Error('Customer not found'); // fallback to creation
          }
        } catch (error) {
          console.warn('Customer not found. Creating new one...', error);

          const newCustomer = await addCustomerData({
            name: custName,
            contact: contact,
            address: {
              street: street,
              city: city,
              zip: Number(zip),
            },
          });

          console.log(newCustomer);

          customerId = newCustomer.customerId;
        }

        // for searching and adding new merchant data
        let merchantId = '';

        // Only run merchant logic if merchant name is filled
        if (values.merchantName.trim() !== '') {
          const {
            merchantName,
            shopName,
            merchantStreet,
            merchantCity,
            merchantZip,
          } = values;

          const contactMerchant = [values.merchantPhone];

          try {
            const searchMerchantResult = await searchMerchant(
              merchantName,
              contactMerchant
            );

            if (searchMerchantResult.merchant) {
              merchantId = searchMerchantResult.merchant.merchantId;
            } else {
              throw new Error('Merchant not found');
            }
          } catch (error) {
            const newMerchant = await AddMerchantData({
              name: merchantName,
              shopName,
              contact: contactMerchant,
              address: {
                street: merchantStreet,
                city: merchantCity,
                zip: Number(merchantZip),
              },
            });

            merchantId = newMerchant.merchantId;
          }
        }

        // for adding the kalam data
        try {
          addData({
            customerId: customerId,
            loans: {
              details: {
                name: values.itemName,
                number: Number(values.itemQuantity),
                materialType: values.itemMaterial,
                netWeight: Number(values.netWeight),
                grossWeight: Number(values.grossWeight),
                purity: Number(values.purity),
              },

              loanDetails: {
                totalAmt:
                  Number(values.customerAmount) + Number(values.dukandarAmount),
                customerAmt: Number(values.customerAmount),
                dukandarAmt: Number(values.dukandarAmount),
                dueAmount: Number(values.dueAmount),
                merchantROI: Number(values.merchantROI),
                customerROI: Number(values.customerROI),
                loanStartDate: values.loanStartDate,
                status: 'Active',
              },
            },
            merchantId: merchantId,
          });
        } catch (error) {
          console.log(error);
        }

        formik.resetForm();
      } catch (err) {
        console.error('Add customer error:', err);
      }
      setLoading(false);
    },
  });

  const formSections = [
    // Customer Information
    {
      title: 'Customer Information',
      fields: [
        {
          type: 'autocomplete',
          label: 'Customer Name',
          name: 'name',
          value: formik.values.name,
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
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
          error: formik.touched.altPhone && Boolean(formik.errors.altPhone),
          helperText: formik.touched.altPhone && formik.errors.altPhone,
        },
      ],
    },
    //Customer Address Information
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
    //   Item Details
    {
      title: 'Item Details',
      fields: [
        {
          label: 'Item Name',
          name: 'itemName',
          value: formik.values.itemName,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
          error: formik.touched.itemName && Boolean(formik.errors.itemName),
          helperText: formik.touched.itemName && formik.errors.itemName,
        },
        {
          label: 'Item Quantity',
          name: 'itemQuantity',
          type: 'number',
          value: formik.values.itemQuantity,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
          error:
            formik.touched.itemQuantity && Boolean(formik.errors.itemQuantity),
          helperText: formik.touched.itemQuantity && formik.errors.itemQuantity,
        },
        {
          label: 'Item Type (Material)',
          name: 'itemMaterial',
          value: formik.values.itemMaterial,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
          error:
            formik.touched.itemMaterial && Boolean(formik.errors.itemMaterial),
          helperText: formik.touched.itemMaterial && formik.errors.itemMaterial,
        },
        {
          label: 'Net Weight (gm)',
          type: 'number',
          name: 'netWeight',
          value: formik.values.netWeight,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
          error: formik.touched.netWeight && Boolean(formik.errors.netWeight),
          helperText: formik.touched.netWeight && formik.errors.netWeight,
        },
        {
          label: 'Gross Weight (gm)',
          type: 'number',
          name: 'grossWeight',
          value: formik.values.grossWeight,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
          error:
            formik.touched.grossWeight && Boolean(formik.errors.grossWeight),
          helperText: formik.touched.grossWeight && formik.errors.grossWeight,
        },
        {
          label: 'Purity (%)',
          type: 'number',
          name: 'purity',
          value: formik.values.purity,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
          error: formik.touched.purity && Boolean(formik.errors.purity),
          helperText: formik.touched.purity && formik.errors.purity,
        },
      ],
    },
    // Mortgage Information
    {
      title: 'Mortgage Information',
      fields: [
        // Mortgage Information
        {
          label: 'Customer Amount',
          type: 'number',
          name: 'customerAmount',
          value: formik.values.customerAmount,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
          error:
            formik.touched.customerAmount &&
            Boolean(formik.errors.customerAmount),
          helperText:
            formik.touched.customerAmount && formik.errors.customerAmount,
        },
        {
          label: 'Dukandar Amount',
          type: 'number',
          name: 'dukandarAmount',
          value: formik.values.dukandarAmount,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
          error:
            formik.touched.dukandarAmount &&
            Boolean(formik.errors.dukandarAmount),
          helperText:
            formik.touched.dukandarAmount && formik.errors.dukandarAmount,
        },
        {
          label: 'Total Amount',
          type: 'number',
          name: 'totalAmount',
          value: `${
            formik.values.customerAmount + formik.values.dukandarAmount
          }`,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
          error:
            formik.touched.totalAmount && Boolean(formik.errors.totalAmount),
          helperText: formik.touched.totalAmount && formik.errors.totalAmount,
          InputProps: {
            readOnly: true,
          },
        },
        {
          label: 'Merchant ROI (pm)',
          type: 'number',
          name: 'merchantROI',
          value: formik.values.merchantROI,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
          error:
            formik.touched.merchantROI && Boolean(formik.errors.merchantROI),
          helperText: formik.touched.merchantROI && formik.errors.merchantROI,
        },
        {
          label: 'Customer ROI (pm)',
          type: 'number',
          name: 'customerROI',
          value: formik.values.customerROI,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
          error:
            formik.touched.customerROI && Boolean(formik.errors.customerROI),
          helperText: formik.touched.customerROI && formik.errors.customerROI,
        },
        {
          type: 'date',
          name: 'loanStartDate',
          value: formik.values.loanStartDate,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
          error:
            formik.touched.loanStartDate &&
            Boolean(formik.errors.loanStartDate),
          helperText:
            formik.touched.loanStartDate && formik.errors.loanStartDate,
        },
      ],
    },
    // Merchant Information
    {
      title: 'Merchant Information',
      fields: [
        // Merchant formik details
        {
          label: 'Merchant Name',
          name: 'merchantName',
          value: formik.values.merchantName,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
          error:
            formik.touched.merchantName && Boolean(formik.errors.merchantName),
          helperText: formik.touched.merchantName && formik.errors.merchantName,
        },
        {
          label: 'Shop Name',
          name: 'shopName',
          value: formik.values.shopName,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
          error: formik.touched.shopName && Boolean(formik.errors.shopName),
          helperText: formik.touched.shopName && formik.errors.shopName,
        },
        {
          label: 'Phone',
          name: 'merchantPhone',
          value: formik.values.merchantPhone,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
          error:
            formik.touched.merchantPhone &&
            Boolean(formik.errors.merchantPhone),
          helperText:
            formik.touched.merchantPhone && formik.errors.merchantPhone,
        },
      ],
    },
    // Merchant Address Information
    {
      title: 'Address',
      fields: [
        {
          label: 'Street',
          name: 'merchantStreet',
          value: formik.values.merchantStreet,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
          error:
            formik.touched.merchantStreet &&
            Boolean(formik.errors.merchantStreet),
          helperText:
            formik.touched.merchantStreet && formik.errors.merchantStreet,
        },
        {
          label: 'City',
          name: 'merchantCity',
          value: formik.values.merchantCity,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
          error:
            formik.touched.merchantCity && Boolean(formik.errors.merchantCity),
          helperText: formik.touched.merchantCity && formik.errors.merchantCity,
        },
        {
          label: 'Zip Code',
          name: 'merchantZip',
          value: formik.values.merchantZip,
          onChange: formik.handleChange,
          onBlur: formik.handleBlur,
          error:
            formik.touched.merchantZip && Boolean(formik.errors.merchantZip),
          helperText: formik.touched.merchantZip && formik.errors.merchantZip,
        },
      ],
    },
  ];

  return { formik, formSections, loading };
};
