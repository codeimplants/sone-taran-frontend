import { useContext } from "react";
import { KalamsDataContext } from "../context/KalamsDataContext";

const useKalamsDataContext = () => {
  const context = useContext(KalamsDataContext);

  if (!context) {
    throw new Error(
      "useKalamsDataContext must be used within a KalamsDataProvider"
    );
  }

  return context;
};

export default useKalamsDataContext;
