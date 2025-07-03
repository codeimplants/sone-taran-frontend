import { createContext, useState, useCallback, ReactNode } from 'react';
import { customer } from '../features/customers/models/Customers';
import apiService, { Customer, EditCustomer } from '../services/apiService';

interface CustomerDataContextProps {
  data: customer[];
  loading: boolean;
  error: Error | null;
  fetchCustomerData: () => void;
  invalidateCache: () => void;
  addCustomerData: (newCustomer: Customer) => Promise<any>;
  updateCustomer: (_id: string, editCustomer: EditCustomer) => void;
  deleteCustomer: (_id: string) => void;
  searchCustomer: (name: string, contact: string[]) => Promise<any>;
}

const CustomerDataContext = createContext<CustomerDataContextProps | undefined>(
  undefined
);

export const CustomerDataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // For customer
  const fetchCustomerData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await apiService.fetchCustomerData();
      setData(result);
      setLoading(false);
    } catch (error) {
      if (error instanceof Error) {
        setError(error);
      } else {
        setError(new Error('An unknown error occurred'));
      }
      setLoading(false);
    }
  }, []);

  const invalidateCache = useCallback(() => {
    fetchCustomerData();
  }, [fetchCustomerData]);

  const addCustomerData = useCallback(
    async (newCustomer: Customer) => {
      try {
        setLoading(true);
        setError(null);
        const createdCustomer = await apiService.AddCustomerData(newCustomer);
        await fetchCustomerData();
        return createdCustomer; // ✅ Return this!
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to add customer')
        );
        return null; // fallback
      } finally {
        setLoading(false);
      }
    },
    [fetchCustomerData]
  );

  const updateCustomer = useCallback(
    async (_id: string, editCustomer: EditCustomer) => {
      try {
        setLoading(true);
        setError(null);
        await apiService.updateCustomer(_id, editCustomer);
        await fetchCustomerData();
      } catch (err) {
        if (error instanceof Error) {
          setError(error);
        } else {
          setError(new Error('An unknown error occurred'));
        }
      } finally {
        setLoading(false);
      }
    },
    [fetchCustomerData]
  );

  const deleteCustomer = useCallback(
    async (_id: string) => {
      try {
        setLoading(true);
        setError(null);
        await apiService.deleteCustomer(_id);
        await fetchCustomerData();
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to add customer')
        );
      } finally {
        setLoading(false);
      }
    },
    [fetchCustomerData]
  );

  const searchCustomer = useCallback(
    async (name: string, contact: string[]) => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiService.searchCustomer(name, contact);
        return result;
      } catch (error) {
      } finally {
        setLoading(false);
      }
    },
    [fetchCustomerData]
  );

  return (
    <CustomerDataContext.Provider
      value={{
        data,
        loading,
        error,
        fetchCustomerData,
        invalidateCache,
        addCustomerData,
        updateCustomer,
        deleteCustomer,
        searchCustomer,
      }}
    >
      {children}
    </CustomerDataContext.Provider>
  );
};

export { CustomerDataContext };
