import { useState, useCallback } from 'react';

const useApi = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async (url, options = {}) => {
    setLoading(true);
    setError(null);
    console.log('useApi: Fetching URL:', url, 'with options:', options); // Log before fetch

    try {
      const response = await fetch(url, options);
      console.log('useApi: Response received:', response); // Log the raw response

      if (!response.ok) {
        let errorObj = {
          status: response.status,
          message: `API request failed with status: ${response.status}`,
          data: null,
        };

        try {
          errorObj.data = await response.json();
          if (errorObj.data && errorObj.data.message) {
            errorObj.message = errorObj.data.message;
          } else if (errorObj.data) {
            errorObj.message = JSON.stringify(errorObj.data);
          }
        } catch (jsonError) {
          try {
            errorObj.message = await response.text();
          } catch (textError) {
            console.error('useApi: Error parsing error response as text:', textError, response);
          }
        }

        console.error('useApi: API request failed:', errorObj);
        setError(errorObj);
        return;
      }

      const result = await response.json();
      console.log('useApi: API request successful, data:', result); // Log successful data
      setData(result);
    } catch (err) {
      setError({ message: 'An unexpected error occurred.', error: err });
      console.error('useApi: Fetch error:', err); // Log fetch errors
    } finally {
      setLoading(false);
      console.log('useApi: Fetch completed. Loading:', loading); // Log after completion
    }
  }, []);

  return { data, error, loading, fetchData };
};

export default useApi;