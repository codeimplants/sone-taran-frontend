export interface customer {
  _id: string;
  customer: CustomerDetails;
  kalam: KalamDetails;
}

export interface CustomerDetails {
  address: Address;
  _id: string;
  customerId: string;
  name: string;
  contact: string[]; // Assuming contact is an array of strings
  __v: number;
}

export interface Address {
  street: string;
  city: string;
  zip: string;
}

export interface KalamDetails {
  details: ItemDetails;
  loanDetails: KalamDetails;
  loanId: string;
}

export interface ItemDetails {
  number: number;
  name: string;
  materialType: string;
  netWeight: number;
  grossWeight: number;
  purity: number;
  goldRateAtLoan: number;
}

export interface KalamDetails {
  totalAmt: number;
  customerAmt: number;
  dukandarAmt: number;
  customerROI: number;
  merchantROI: number;
  loanStartDate: string; // Consider using Date type if you will parse it
  validity: string;
}
