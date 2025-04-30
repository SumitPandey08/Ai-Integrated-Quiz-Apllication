// useApi.js
import { useState, useCallback } from 'react';

const useApi = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(async (url, options = {}) => {
        setLoading(true);
        setError(null);
        console.log('useApi: Fetching URL:', url, 'with options:', options);

        try {
            const response = await fetch(url, options);
            console.log('useApi: Response received:', response);

            if (!response.ok) {
                let errorObj = {
                    status: response.status,
                    message: `API request failed with status: ${response.status}`,
                    data: null,
                };

                try {
                    const errorData = await response.json();
                    console.error('useApi: API error response (JSON):', errorData);
                    errorObj.data = errorData;
                    if (errorData && errorData.message) {
                        errorObj.message = errorData.message;
                    } else if (errorData) {
                        errorObj.message = JSON.stringify(errorData);
                    }
                } catch (jsonError) {
                    try {
                        const errorText = await response.text();
                        console.error('useApi: API error response (Text):', errorText);
                        errorObj.message = `API request failed with status ${response.status}: ${errorText}`;
                    } catch (textError) {
                        console.error('useApi: Error parsing error response:', textError, response);
                        errorObj.message = `API request failed with status ${response.status}: Could not parse error response.`;
                    }
                }

                console.error('useApi: API request failed:', errorObj);
                setError(errorObj);
                return;
            }

            const result = await response.json();
            console.log('useApi: API request successful, data:', result);
            setData(result);
        } catch (err) {
            setError({ message: 'An unexpected error occurred during the fetch.', error: err });
            console.error('useApi: Fetch error:', err);
        } finally {
            setLoading(false);
            console.log('useApi: Fetch completed. Loading:', loading);
        }
    }, []);

    return { data, error, loading, fetchData };
};

export default useApi;