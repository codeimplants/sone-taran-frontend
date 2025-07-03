import { createContext, useState, useCallback, ReactNode } from 'react';
import { Kalam } from '../features/kalams/models/Kalam';

import apiService, {
  GoldRate,
  AddKalam,
  EditLoan,
} from '../services/apiService';

interface KalamsDataContextProps {
  data: Kalam[];
  loading: boolean;
  error: Error | null;
  rateData: GoldRate[];
  fetchData: () => void;
  invalidateCache: () => void;
  addData: (newKalam: AddKalam) => void;
  updateLoan: (_id: string, editLoan: EditLoan) => void;
  deleteLoan: (_id: string) => void;

  fetchGoldRate: () => void;
  invalidateRateCache: () => void;
  addGoldRate: (
    newGoldRate: GoldRate
  ) => Promise<{ success: boolean; message?: string }>;
  updateGoldRate: (_id: string, editRate: GoldRate) => void;
}

const KalamsDataContext = createContext<KalamsDataContextProps | undefined>(
  undefined
);

export const KalamsDataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<Kalam[]>([]);
  const [rateData, setRateData] = useState<GoldRate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await apiService.fetchKalamsData();
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
    fetchData();
  }, [fetchData]);

  const addData = useCallback(
    async (newKalam: AddKalam) => {
      try {
        setLoading(true);
        setError(null);
        await apiService.AddKalamsData(newKalam);
        await fetchData();
      } catch (error) {
        if (error instanceof Error) {
          setError(error);
        } else {
          setError(new Error('An unknown error occurred'));
        }
        setLoading(false);
      }
    },
    [fetchData]
  );

  const updateLoan = useCallback(
    async (_id: string, editLoan: EditLoan) => {
      try {
        setLoading(true);
        setError(null);
        await apiService.updateLoan(_id, editLoan);
        await fetchData();
      } catch (error) {
        if (error instanceof Error) {
          setError(error);
        } else {
          setError(new Error('An unknown error occurred'));
        }
        setLoading(false);
      } finally {
        setLoading(false);
      }
    },
    [fetchData]
  );

  const deleteLoan = useCallback(
    async (_id: string) => {
      try {
        setLoading(true);
        setError(null);
        await apiService.deleteLoan(_id);
        await fetchData();
      } catch (error) {
        if (error instanceof Error) {
          setError(error);
        } else {
          setError(new Error('An unknown error occurred'));
        }
        setLoading(false);
      } finally {
        setLoading(false);
      }
    },
    [fetchData]
  );

  const fetchGoldRate = useCallback(async () => {
    try {
      setLoading(true);
      const result = await apiService.fetchGoldRateData();
      console.log('Gold Rate Result:', result);
      setRateData(result);
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

  const invalidateRateCache = useCallback(() => {
    fetchGoldRate();
  }, [fetchGoldRate]);

  const addGoldRate = useCallback(
    async (
      newGoldRate: GoldRate
    ): Promise<{ success: boolean; message?: string }> => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiService.AddGoldRateData(newGoldRate);
        await fetchGoldRate()
        setLoading(false);
        return response;
      } catch (error) {
        if (error instanceof Error) {
          setError(error);
        } else {
          setError(new Error('An unknown error occurred'));
        }
        setLoading(false);
        return { success: false, message: 'Error saving gold rate' };
      }
    },
    [fetchGoldRate]
  );

  const updateGoldRate = useCallback(
    async (_id: string, editRate: GoldRate) => {
      try {
        setLoading(true);
        setError(null);
        await apiService.updateGoldRate(_id, editRate);
        await fetchGoldRate();
      } catch (error) {
        if (error instanceof Error) {
          setError(error);
        } else {
          setError(new Error('An unknown error occurred'));
        }
        setLoading(false);
      } finally {
        setLoading(false);
      }
    },
    [fetchData]
  );

  
  return (
    <KalamsDataContext.Provider
      value={{
        data,
        loading,
        error,
        rateData,
        fetchData,
        invalidateCache,
        invalidateRateCache,
        addData,
        updateLoan,
        deleteLoan,
        fetchGoldRate,
        addGoldRate,
        updateGoldRate,
      }}
    >
      {children}
    </KalamsDataContext.Provider>
  );
};

export { KalamsDataContext };
