export interface Kalam {
  _id: string;
  kalam: KalamDetails;
  customerDetails: CustomerDetails;
  merchantDetails: MerchantDetails;
  goldRate: GoldRate[];
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
  dueAmount: number;
  customerROI: number;
  merchantROI: number;
  loanStartDate: string;
  status: string;
}

export interface CustomerDetails {
  address: Address;
  _id: string;
  customerId: string;
  name: string;
  contact: string[]; // Assuming contact is an array of strings
  __v: number;
}

export interface MerchantDetails {
  address: Address;
  _id: string;
  merchantId: string;
  name: string;
  shopName: string;
  contact: string[]; // Assuming contact is an array of strings
  __v: number;
}

export interface Address {
  street: string;
  city: string;
  zip: string;
}

export interface GoldRate {
  createdAt: string;
  goldRate: number;
  updatedAt: number;
  _id: string;
  __v: 0;
}
