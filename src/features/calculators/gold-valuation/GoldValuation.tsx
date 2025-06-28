import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Button,
  Box,
  Typography,
  TextField,
  Paper,
  Container,
  Grid,
} from '@mui/material';
import { calculateMaxLoanTenure2 } from '../../../utils/MaxLoanTenureUtil';
import PercentageSlider from '../../../shared/components/percentage-slider/PercentageSlider';
import { useTranslation } from 'react-i18next';

const GoldValuation = () => {
  const { t } = useTranslation();

  const [metalValue, setMetalValue] = useState<number | null>(null);
  const [maxLoanTenure, setMaxLoanTenure] = useState<number>(0);
  const [calculated, setCalculated] = useState<boolean>(false);

  const handlePercentageChange = (newPercentage: number) => {
    formik.setFieldValue('loanPercentage', newPercentage);

    const { netWeight, purity, metalRate, roi } = formik.values;
    const pureGoldWeight = (Number(netWeight) * Number(purity)) / 100;
    const metalValue = pureGoldWeight * Number(metalRate);

    const calculatedMaxLoanTenure = calculateMaxLoanTenure2(
      Math.floor((metalValue * newPercentage) / 100),
      metalValue,
      Number(roi) * 12
    );

    setMaxLoanTenure(calculatedMaxLoanTenure);
    setMetalValue(metalValue);
  };

  const formik = useFormik({
    initialValues: {
      grossWeight: '',
      netWeight: '',
      purity: '',
      metalRate: '',
      roi: '',
      loanAmount: '',
      loanDuration: '',
      loanPercentage: 60,
    },
    validationSchema: Yup.object({
      grossWeight: Yup.number()
        .required(t('calculatorPage.goldRateCalculator.error.grossWeightError'))
        .positive(
          t('calculatorPage.goldRateCalculator.error.grossWeightError')
        ),
      netWeight: Yup.number()
        .required(t('calculatorPage.goldRateCalculator.error.netWeightError'))
        .positive(t('calculatorPage.goldRateCalculator.error.netWeightError'))

        .test('is-less-than-gross', 'Must be ≤ Gross Weight', function (value) {
          const { grossWeight } = this.parent;
          return value <= grossWeight;
        }),
      purity: Yup.number()
        .required(t('calculatorPage.goldRateCalculator.error.purityError'))
        .min(0)
        .max(100),
      metalRate: Yup.number()
        .required(t('calculatorPage.goldRateCalculator.error.metalRateError'))
        .positive(),
      roi: Yup.number()
        .required(t('calculatorPage.goldRateCalculator.error.ROIError'))
        .positive(),
    }),
    onSubmit: (values) => {
      const {
        netWeight,
        purity,
        metalRate,
        roi,
        // loanAmount,
        // loanDuration,
        loanPercentage,
      } = values;

      const pureGoldWeight = (Number(netWeight) * Number(purity)) / 100;
      const metalValue = pureGoldWeight * Number(metalRate);

      const maxLoanTenure = calculateMaxLoanTenure2(
        Math.floor((metalValue * loanPercentage) / 100),
        metalValue,
        Number(roi) * 12
      );

      setMetalValue(metalValue);
      setMaxLoanTenure(maxLoanTenure);
      setCalculated(true);
    },
  });

  const handleReset = () => {
    formik.resetForm();
    setMetalValue(null);
    setMaxLoanTenure(0);
    setCalculated(false);
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, mt: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>
          {t('calculatorPage.goldRateCalculator.goldValuation')}
        </Typography>
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                id="grossWeight"
                name="grossWeight"
                label={t('calculatorPage.goldRateCalculator.grossWeight')}
                value={formik.values.grossWeight}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.grossWeight &&
                  Boolean(formik.errors.grossWeight)
                }
                helperText={
                  formik.touched.grossWeight && formik.errors.grossWeight
                }
                InputProps={{
                  sx: {
                    paddingY: { xs: 1.5 },
                    paddingX: { xs: 2 },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                id="netWeight"
                name="netWeight"
                label={t('calculatorPage.goldRateCalculator.netWeight')}
                value={formik.values.netWeight}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.netWeight && Boolean(formik.errors.netWeight)
                }
                helperText={formik.touched.netWeight && formik.errors.netWeight}
                InputProps={{
                  sx: {
                    paddingY: { xs: 1.5 },
                    paddingX: { xs: 2 },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                id="purity"
                name="purity"
                label={t('calculatorPage.goldRateCalculator.purity')}
                value={formik.values.purity}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.purity && Boolean(formik.errors.purity)}
                helperText={formik.touched.purity && formik.errors.purity}
                InputProps={{
                  sx: {
                    paddingY: { xs: 1.5 },
                    paddingX: { xs: 2 },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                id="metalRate"
                name="metalRate"
                label={t('calculatorPage.goldRateCalculator.metalRate')}
                value={formik.values.metalRate}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.metalRate && Boolean(formik.errors.metalRate)
                }
                helperText={formik.touched.metalRate && formik.errors.metalRate}
                InputProps={{
                  sx: {
                    paddingY: { xs: 1.5 },
                    paddingX: { xs: 2 },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                id="roi"
                name="roi"
                label={t('calculatorPage.goldRateCalculator.ROI')}
                value={formik.values.roi}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.roi && Boolean(formik.errors.roi)}
                helperText={formik.touched.roi && formik.errors.roi}
                InputProps={{
                  sx: {
                    paddingY: { xs: 1.5 },
                    paddingX: { xs: 2 },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                id="loanAmount"
                name="loanAmount"
                label={t('calculatorPage.goldRateCalculator.loanAmt')}
                value={formik.values.loanAmount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.loanAmount && Boolean(formik.errors.loanAmount)
                }
                helperText={
                  formik.touched.loanAmount && formik.errors.loanAmount
                }
                InputProps={{
                  sx: {
                    paddingY: { xs: 1.5 },
                    paddingX: { xs: 2 },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                id="loanDuration"
                name="loanDuration"
                label={t('calculatorPage.goldRateCalculator.loanDuration')}
                value={formik.values.loanDuration}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.loanDuration &&
                  Boolean(formik.errors.loanDuration)
                }
                helperText={
                  formik.touched.loanDuration && formik.errors.loanDuration
                }
                InputProps={{
                  sx: {
                    paddingY: { xs: 1.5 },
                    paddingX: { xs: 2 },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <PercentageSlider
                value={formik.values.loanPercentage}
                onPercentageChange={handlePercentageChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
              >
                {t('calculatorPage.button.calculate')}
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                fullWidth
                type="button"
                variant="outlined"
                onClick={handleReset}
              >
                {t('calculatorPage.button.reset')}
              </Button>
            </Grid>
          </Grid>
        </Box>

        {calculated && metalValue != null && (
          <Box sx={{ mt: 4 }}>
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6">Loan Eligibility</Typography>
              <Typography>Item Value: ₹{metalValue.toFixed(2)}</Typography>
              <Typography>
                Loan Amount ({formik.values.loanPercentage}%): ₹
                {Math.floor((metalValue * formik.values.loanPercentage) / 100)}
              </Typography>
              <Typography>Loan Duration: {maxLoanTenure} months</Typography>
            </Paper>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="h6">Customer Requirement</Typography>
              <Typography>Loan Amount: ₹{formik.values.loanAmount}</Typography>
              <Typography>
                Amount in Percentage:{' '}
                {(
                  (Number(formik.values.loanAmount) / metalValue) *
                  100
                ).toFixed(2)}
                %
              </Typography>
              <Typography>
                Loan Duration: {formik.values.loanDuration} months
              </Typography>
            </Paper>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default GoldValuation;
