import useCustomersDataContext from "./useCustomerDataContext";

const useCustomerData = () => {
  const { data, loading, error, fetchCustomerData, invalidateCache, addCustomerData, searchCustomer, updateCustomer, deleteCustomer } =
    useCustomersDataContext();

  const fetchIfNeeded = () => {
    if (data.length === 0 && !loading) {
      fetchCustomerData();
    }
    return data;
  };

  return { data, loading, error, fetchIfNeeded, invalidateCache, addCustomerData, searchCustomer, updateCustomer, deleteCustomer };
};

export default useCustomerData;
