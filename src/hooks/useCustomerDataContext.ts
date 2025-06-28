import { useContext } from "react";
import { CustomerDataContext } from "../context/CustomersDataContext";

const useCustomerDataContext = () => {
  const context = useContext(CustomerDataContext);

  if (!context) {
    throw new Error(
      "useCustomerDataContext must be used within a CustomerDataProvider"
    );
  }

  return context;
};

export default useCustomerDataContext;
