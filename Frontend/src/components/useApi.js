import { useState, useCallback } from 'react';

const useApi = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async (url, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, options);

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
            console.error('Error parsing error response as Text:', textError, response);
          }
        }

        setError(errorObj);
        console.error('API request failed:', errorObj); // Log failure
        return;
      }

      const result = await response.json();
      setData(result);
      console.log('API request successful:', result); // Log success
    } catch (err) {
      setError({ message: 'An unexpected error occurred.', error: err });
      console.error('API request error:', err); // Log catch failure
    } finally {
      setLoading(false);
    }
  }, []); // Removed navigate dependency

  return { data, error, loading, fetchData };
};

export default useApi;