import GoldValuation from '../features/calculators/gold-valuation/GoldValuation';
import InterestCalculator from '../features/calculators/interest-calculator/InterestCalculator';
import LoanDurationCalculator from '../features/calculators/loan-duration-calculator/LoanDurationCalculator';
import WholesaleValueCalculator from '../features/calculators/wholesale-value-calculator/WholesaleValueCalculator';

export const calculatorTabs = [
  { tabName: 'calculatorPage.wholePage', component: WholesaleValueCalculator },
  { tabName: 'calculatorPage.loanpage', component: LoanDurationCalculator },
  { tabName: 'calculatorPage.goldPage', component: GoldValuation },
  { tabName: 'calculatorPage.interestPage', component: InterestCalculator },
];
