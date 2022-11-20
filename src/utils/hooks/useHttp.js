import { API } from "utils/constants";
import { useReducer, useCallback } from "react";

const initialState = {
  loading: false,
  error: null,
  data: null,
  extra: null,
  identifier: null,
};

const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case "SEND":
      return {
        loading: true,
        error: null,
        data: null,
        extra: null,
        identifier: action.identifier,
      };
    case "RESPONSE":
      return {
        ...curHttpState,
        loading: false,
        data: action.responseData,
        extra: action.extra,
      };
    case "ERROR":
      return { loading: false, error: action.errorMessage };
    case "CLEAR":
      return initialState;
    default:
      throw new Error("Should not be reached!");
  }
};

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);

  const clear = useCallback(() => dispatchHttp({ type: "CLEAR" }), []);

  const sendRequest = useCallback(
    async (url, method, body, reqExtra, reqIdentifer) => {
      dispatchHttp({ type: "SEND", identifier: reqIdentifer });
      return fetch(`${API}/${url}`, {
        method: method,
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      }) 
        .then(async (response) => {

          if (!response.ok) {            
            // if ([401, 403, 404, 500].includes(response.status)) {
            // }
            const text = await response.text();
            throw (text);
          }

          // The response is Empty (204 No Content)
          if(response.status === 204){
            return response;
          }
          
          return response.json();
        })
        .then((responseData) => {
          dispatchHttp({
            type: "RESPONSE",
            responseData: responseData,
            extra: reqExtra,
          });
          return responseData;
        })
        .catch((error) => {
          const errorMessage = JSON.parse(error);          
          dispatchHttp({
            type: "ERROR",
            errorMessage: errorMessage,
          });
        });
    },
    []
  );

  return {
    isLoading: httpState.loading,
    data: httpState.data,
    error: httpState.error,
    sendRequest: sendRequest,
    reqExtra: httpState.extra,
    reqIdentifer: httpState.identifier,
    clear: clear,
  };
};

export default useHttp;
