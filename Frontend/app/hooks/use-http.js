import { useState, useCallback } from "react";

/**
 * Extension of the fetch function to include a timeout in case of
 * no response from the server
 * @param {string} url the API endpoint where the request should be sent
 * @param {object} options the options to be included in the fetch request (body, headers, method etc)
 * @param {number} timeout time in milliseconds waiting for response from the server
 * @returns
 */
const fetchWithTimeout = async (url, options = {}, timeout = 10000) => {
  const controller = new AbortController();
  const { signal } = controller;
  options.signal = signal;

  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, options);
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Request timed out");
    }
    throw error;
  }
};

/**
 * Custom hook in order to make HTTP requests to API
 *
 * @return {Object} { isLoading (boolean): request is in progress,
 * error (string | null): request failed - this holds the error message,
 * sendRequest (Function): used to make http request,
 * resetState (Function): used to reset is loading & error's state }
 */
const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  /**
   * Send http request to an API, as configured on the given parameter <requestConfig>. Accepts two parameters:
   * @param {Object} requestConfig Object that consists of:
   *  { url (string) of the API endpoint where the request should be sent,
   *    method (string) of the request (if none is passed, default method is GET),
   *    params (object with URL Search Parameters),
   *    data(body) of the request (if not passed, default is null) and
   *    headers of the request (if not passed, default is empty object) }
   * @param {Function} applyData Callback function to be executed in case of success
   */
  const sendRequest = useCallback(async (requestConfig, applyData) => {
    setIsLoading(true); // request is in progress
    setError(null); // remove any pre-existing errors

    const { url, method = "GET", params, data, headers = {} } = requestConfig;

    // Construct URL with query parameters if provided
    const queryString = params
      ? "?" + new URLSearchParams(params).toString()
      : "";
    const fullUrl = url + queryString;

    let body = null;
    if (data) {
      if (data instanceof FormData) {
        body = data;
      } else {
        headers["Content-Type"] = "application/json";
        body = JSON.stringify(data);
      }
    }

    // Create fetch options
    const fetchOptions = {
      method,
      headers,
      body,
      credentials: "include", // Include cookies in the request
    };

    try {
      const response = await fetchWithTimeout(fullUrl, fetchOptions);
      const responseData = await response.json();

      if (!response.ok) {
        if (responseData?.message && responseData?.message.trim() !== "")
          throw new Error(responseData.message);
        else throw new Error(`Request failed with status ${response.status}`);
      }

      // in case of success, run the callback function passed in <applyData> parameter (otherwise the catch block will be executed)
      applyData(responseData);
    } catch (error) {
      // an error has occured making the request - set the error state's message depending on type of error
      setError(error.message || "Something went wrong");
    }

    setIsLoading(false); // request finished (with or without error) - reset the <isLoading> flag
  }, []);

  // function to reset the current state of isLoading and error
  const resetState = () => {
    setIsLoading(false);
    setError(null);
  };

  // return the two available states and <sendRequest> method
  return {
    isLoading,
    error,
    sendRequest,
    resetState,
  };
};

export default useHttp;
