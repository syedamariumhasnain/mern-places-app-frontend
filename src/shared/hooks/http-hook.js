import { useState, useEffect, useCallback, useRef } from "react";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  // Data initialized using useRef will not re-initialize when the function runs again
  // useState is also used to survive data from re-render cycles, but here we don't 
  // want to re-render UI when updating the useState data.
  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);

      // AbortController -- is the API supported in modern browsers 
      // AbortController is used to cancel/abort a promise while leaving a component
      // this will prevent error cause by switching page while request is on its way 
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);

      try {
        const response = await fetch(url, {
          method,
          body,
          headers,
          // we can assign an abort controller to request, by adding signal property
          // to the configuration object and point at the created abort controller
          // This links the AbortController to this request and we can use it to
          // cancel that connect request
          signal: httpAbortCtrl.signal,
        });

        const responseData = await response.json();

        activeHttpRequests.current = activeHttpRequests.current.filter(
          reqCtrl => reqCtrl !== httpAbortCtrl
        )

        if (!response.ok) {
          throw new Error(responseData.message);
        }
        return responseData;
      } catch (err) {
        setError(err.message);
      }
      setIsLoading(false);
    },
    []
  ); 

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    // clean-up function (return function inside useEffect), runs when component  
    // is unmound. here, we can use it to abort the abortControllers that are  
    // registered upto this point 
    return () => {
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
