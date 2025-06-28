import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Button,
  Grid,
  Typography,
  TextField,
  Paper,
  Container,
  Box,
} from '@mui/material';
import PaymentDetailsCard from '../../../shared/components/payment-details-card/PaymentDetailsCard';
import WastageDetailsCard from '../../../shared/components/wastage-details-card/WastageDetailsCard';
import ItemDetailsCard from '../../../shared/components/item-details-card/ItemDetailsCard';
import { useTranslation } from 'react-i18next';

interface CalculatedValues {
  itemWeight: number;
  wastageWeight: number;
  netPureGold99_9: number;
  netPureGold99_5: number;
  cashEquivalent99_5: number;
  goldRate99_5: number;
  purity: number;
}

const WholesaleValueCalculator: React.FC = () => {
  // for translation
  const { t } = useTranslation();

  const [calculatedValues, setCalculatedValues] =
    useState<CalculatedValues | null>(null);
  const [calculated, setCalculated] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      weight: '',
      purity: '',
      wastage: '',
      goldRate99_5: '',
    },
    validationSchema: Yup.object({
      weight: Yup.number()
        .required(
          t('calculatorPage.wholesaleValueCalculator.error.weightError')
        )
        .positive(
          t('calculatorPage.wholesaleValueCalculator.error.weightPositiveError')
        ),
      purity: Yup.number()
        .required(
          t('calculatorPage.wholesaleValueCalculator.error.purityError')
        )
        .min(0)
        .max(100),
      wastage: Yup.number()
        .required(
          t('calculatorPage.wholesaleValueCalculator.error.wastageError')
        )
        .min(0)
        .max(100),
      goldRate99_5: Yup.number()
        .required(
          t('calculatorPage.wholesaleValueCalculator.error.goldRateError')
        )
        .positive(),
    }),
    onSubmit: (values) => {
      const weight = Number(values.weight);
      const totalPurity = Number(values.purity);
      const purity = totalPurity - 0.4;
      const wastage = Number(values.wastage);
      const goldRate99_5 = Number(values.goldRate99_5);

      const netPureGold = (weight * totalPurity) / 100;
      const netPureGold99_9 = netPureGold + (weight * wastage) / 100;
      const diffBtwn22K = (netPureGold99_9 * 0.5) / 100;
      const netPureGold99_5 = netPureGold99_9 + diffBtwn22K;
      const wastageWeight = weight - netPureGold99_5;
      const cashEquivalent99_5 = netPureGold99_5 * goldRate99_5;

      setCalculatedValues({
        itemWeight: weight,
        wastageWeight: parseFloat(wastageWeight.toFixed(3)),
        netPureGold99_9: parseFloat(netPureGold99_9.toFixed(3)),
        netPureGold99_5: parseFloat(netPureGold99_5.toFixed(3)),
        cashEquivalent99_5: parseFloat(cashEquivalent99_5.toFixed(2)),
        goldRate99_5,
        purity,
      });

      setCalculated(true);
    },
  });

  const handleReset = () => {
    formik.resetForm();
    setCalculated(false);
    setCalculatedValues(null);
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, mt: 3 }}>
        <Typography variant="h4" align="center" sx={{ mb: 4 }}>
          {t('calculatorPage.wholesaleValueCalculator.wholesaleValue')}
        </Typography>

        <Box component="form" onSubmit={formik.handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label={t('calculatorPage.wholesaleValueCalculator.weight')}
                id="weight"
                name="weight"
                value={formik.values.weight}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.weight && Boolean(formik.errors.weight)}
                helperText={formik.touched.weight && formik.errors.weight}
                InputProps={{
                  sx: {
                    paddingY: { xs: 1.5 },
                    paddingX: { xs: 2 },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label={t('calculatorPage.wholesaleValueCalculator.purity')}
                id="purity"
                name="purity"
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
              {formik.values.purity && (
                <Typography
                  variant="body2"
                  sx={{ mt: 1 }}
                  color="text.secondary"
                >
                  {`${(parseFloat(formik.values.purity) - 0.4).toFixed(
                    1
                  )}% + 0.4% = ${formik.values.purity}%`}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label={t('calculatorPage.wholesaleValueCalculator.wastage')}
                id="wastage"
                name="wastage"
                value={formik.values.wastage}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.wastage && Boolean(formik.errors.wastage)}
                helperText={formik.touched.wastage && formik.errors.wastage}
                InputProps={{
                  sx: {
                    paddingY: { xs: 1.5 },
                    paddingX: { xs: 2 },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label={t('calculatorPage.wholesaleValueCalculator.goldRate')}
                id="goldRate99_5"
                name="goldRate99_5"
                value={formik.values.goldRate99_5}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.goldRate99_5 &&
                  Boolean(formik.errors.goldRate99_5)
                }
                helperText={
                  formik.touched.goldRate99_5 && formik.errors.goldRate99_5
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
                variant="outlined"
                color="secondary"
                onClick={handleReset}
              >
                {t('calculatorPage.button.reset')}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Result Section */}
      {calculated && calculatedValues && (
        <Box sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <PaymentDetailsCard
                netPureGold99_9={calculatedValues.netPureGold99_9}
                netPureGold99_5={calculatedValues.netPureGold99_5}
                cashEquivalent99_5={Number(
                  calculatedValues.cashEquivalent99_5.toFixed(0)
                )}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <WastageDetailsCard
                wastageWeight={calculatedValues.wastageWeight}
                goldRate99_5={calculatedValues.goldRate99_5}
                itemWeight={calculatedValues.itemWeight}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <ItemDetailsCard
                itemWeight={calculatedValues.itemWeight}
                purity={calculatedValues.purity}
                netPureGold99_5={calculatedValues.netPureGold99_5}
                cashEquivalent99_5={Number(
                  calculatedValues.cashEquivalent99_5.toFixed(0)
                )}
              />
            </Grid>
          </Grid>
        </Box>
      )}
    </Container>
  );
};

export default WholesaleValueCalculator;
