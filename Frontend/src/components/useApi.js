
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const useApi = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchData = useCallback(async (url, options = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }
        const errorData = await response.json();
        setError(errorData.message || `Failed: Status ${response.status}`);
        return;
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  return { data, error, loading, fetchData };
};

export default useApi;