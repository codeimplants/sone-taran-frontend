interface GoldWeight {
  totalWeight: number;
  purity: number;
  goldWeight: number;
}

export interface Customer {
  customerName: string;
  itemName: string;
  mortgageDate: string;
  customerAmt: number;
  agentAmt: number;
  totalMortgageAmt: number;
  kalamNumber: number;
  kalamWeight: GoldWeight[];
}
