import useKalamsDataContext from "./useKalamsDataContext";

const useKalamsData = () => {
  const { data, loading, error, rateData, fetchData, invalidateCache, addData, updateLoan, deleteLoan, fetchGoldRate, addGoldRate, updateGoldRate, invalidateRateCache } =
    useKalamsDataContext();

  const fetchIfNeeded = () => {
    if (data.length === 0 && !loading) {
      fetchData();
    }
  };

  const fetchRateIfNeeded = () => {
    if (rateData.length === 0 && !loading) {
      fetchGoldRate();
    }
  };
  return { data, loading, error, rateData, fetchIfNeeded, invalidateCache, addData, updateLoan, deleteLoan, addGoldRate, updateGoldRate, invalidateRateCache, fetchRateIfNeeded };
};

export default useKalamsData;
