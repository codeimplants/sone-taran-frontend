import axios from "axios";

// Create a reusable axios instance with a base URL
const apiClient = axios.create({
  baseURL: "https://sone-taran-backend.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Added request interceptor to attach token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle unauthorized responses globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized. Please log in again.");
      // Optionally: redirect or logout
    }
    return Promise.reject(error);
  }
);

// Interface

// kalam interface
export interface AddKalam {
  customerId: string,
  loans: {
    details: {
      number: number,
      name: string,
      materialType: string,
      netWeight: number,
      grossWeight: number,
      purity: number,
    }
    loanDetails: {
      totalAmt: number,
      customerAmt: number,
      dukandarAmt: number,
      dueAmount: number,
      customerROI: number,
      merchantROI: number,
      loanStartDate: string,
      validity: string,
    },
  }
  merchantId: string,
}

// Customer Interface
export interface Customer {
  name: string;
  contact: string[];
  address: {
    street: string;
    city: string;
    zip: number;
  };
}

// Edit Customer Interface
export interface EditCustomer {
  name: string;
  contact: string[];
  address: {
    street: string;
    city: string;
    zip: number;
  };
}

// Edit Loan interface
export interface EditLoan {
  loans: {
    details: {
      number: number,
      name: string,
      materialType: string,
      netWeight: number,
      grossWeight: number,
      purity: number,
      goldRateAtLoan: number,
    }
    loanDetails: {
      totalAmt: number,
      customerAmt: number,
      dukandarAmt: number,
      dueAmount: number,
      customerROI: number,
      merchantROI: number,
      loanStartDate: string,
      validity: string,
    },
  }
}

// Add Merchnat Interface
export interface AddMerchant {
  name: string;
  shopName: string;
  contact: string[];
  address: {
    street: string | undefined;
    city: string | undefined;
    zip: number;
  };
}

// Edit Merchant interface
export interface EditMerchant {
  name: string,
  shopName: string,
  address: {
    street: string,
    city: string,
    zip: number
  },
  contact: string[]
}

// Gold Rate Interface
export interface GoldRate {
  _id?: string;
  userId?: string;
  goldRate: number;
  createdAt?: string;
}


// API methods

// Kalam
const fetchKalamsData = async () => {
  try {
    const response = await apiClient.get("/loan/getLoans");
    return response.data;
  } catch (error) {
    console.error("Error fetching Kalams data:", error);
    throw error;
  }
};

const AddKalamsData = async (KalamData: AddKalam) => {

  try {
    const response = await apiClient.post("/loan/addLoan",
      KalamData
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Kalams data:", error);
    throw error;
  }

};

const updateLoan = async (_id: string, editLoan: EditLoan) => {
  try {
    const response = await apiClient.patch(`/loan/updateLoan/${_id}`, editLoan)
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) return null;
    throw error;
  }
}

const deleteLoan = async (_id: string) => {
  try {
    const response = await apiClient.delete(`/loan/deleteLoan/${_id}`)
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) return null;
    throw error;
  }
}


//Customer 
const fetchCustomerData = async () => {
  try {
    const response = await apiClient.get("/customer/getCustomers");
    return response.data;
  } catch (error) {
    console.error("Error fetching Kalams data:", error);
    throw error;
  }
};


const AddCustomerData = async (CustomerData: Customer) => {

  try {
    const response = await apiClient.post("/customer/addCustomer",
      CustomerData
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching Kalams data:", error);
    throw error;
  }
};

const searchCustomer = async (name: string, contact: string[]) => {
  try {
    const response = await apiClient.post("/customer/search", { name, contact });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) return null;
    throw error;
  }
};

const updateCustomer = async (_id: string, updateCustomer: EditCustomer) => {
  try {
    const response = await apiClient.patch(`/customer/updateCustomer/${_id}`, updateCustomer)
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) return null;
    throw error;
  }
}

const deleteCustomer = async (_id: string) => {
  try {
    const response = await apiClient.delete(`/customer/deleteCustomer/${_id}`)
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) return null;
    throw error;
  }
}

// Merchant
const AddMerchantData = async (MerchantData: AddMerchant) => {

  try {
    const response = await apiClient.post("/merchant/addMerchant",
      MerchantData
    );
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching Kalams data:", error);
    throw error;
  }
};

const searchMerchant = async (name: string, contact: string[]) => {
  try {
    const response = await apiClient.post("/merchant/searchMerchant", { name, contact });
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) return null;
    throw error;
  }
};

const updateMerchant = async (_id: string, editMerchant: EditMerchant) => {
  try {
    const response = await apiClient.patch(`/merchant/updateMerchant/${_id}`, editMerchant)
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) return null;
    throw error;
  }
}

// Gold rate 

const fetchGoldRateData = async () => {
  try {
    const response = await apiClient.get(`/rate/getRate`);
    return response.data;
  } catch (error) {
    console.error("Error fetching gold rate:", error);
    throw error;
  }
};

const AddGoldRateData = async (goldRate: GoldRate): Promise<{ success: boolean; message?: string }> => {
  const response = await apiClient.post(`/rate/addRate`, goldRate);
  return response.data;
};

const updateGoldRate = async (_id: string, editRate: GoldRate) => {
  try {
    const response = await apiClient.patch(`rate/updateRate/${_id}`, editRate)
    return response.data;
  } catch (error: any) {
    if (error.response?.status === 404) return null;
    throw error;
  }
}

// Export the API methods
export default {
  // Kalam API
  fetchKalamsData,
  AddKalamsData,
  updateLoan,
  deleteLoan,
  // Customer API
  fetchCustomerData,
  AddCustomerData,
  updateCustomer,
  deleteCustomer,
  searchCustomer,
  // Merchant API
  searchMerchant,
  AddMerchantData,
  updateMerchant,
  // Gold Rate
  fetchGoldRateData,
  AddGoldRateData,
  updateGoldRate
};

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized. You may need to log in again.");
      // Optionally redirect or handle
    } else if (!error.response) {
      console.error("Network or CORS error:", error.message || error);
    }

    return Promise.reject(error);
  }
);
