// credits https://github.com/SimpleJWT/drf-SimpleJWT-React/blob/master/jwt-react/src/api/auth.js
import Axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { configure } from "axios-hooks";
import {
  BASE_URL,
  getAccessToken,
  getRefreshToken,
  refreshToken,
  removeTokens,
} from "./auth";

const REQUEST_TIMEOUT_IN_MS = 15000;
const AXIOS_DEFAULT_HEADERS = {
  Accept: "application/json",
};

let isRefreshing: boolean = false;
const refreshSubscribers: (() => void)[] = [];

const subscribeTokenRefresh = (callback: () => void) => {
  refreshSubscribers.push(callback);
};

const onRefreshed = () => {
  isRefreshing = false;
  refreshSubscribers.map((callback) => callback());
};

const configureAxios = async () => {
  const axios = Axios.create({
    baseURL: BASE_URL,
    timeout: REQUEST_TIMEOUT_IN_MS,
    headers: AXIOS_DEFAULT_HEADERS,
  });

  axios.interceptors.request.use(
    async (config) => {
      const token = getAccessToken();
      config.headers.set("Authorization", `Bearer ${token}`);
      return config;
    },
    (error: Error) => Promise.reject(error)
  );

  axios.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: {
      config: AxiosRequestConfig;
      response: { status: number };
    }) => {
      const { config } = error;

      if (error.response?.status === 401) {
        const retryOriginalRequest = new Promise((resolve) => {
          subscribeTokenRefresh(() => {
            resolve(axios(config));
          });
        });

        if (!isRefreshing && getRefreshToken()) {
          isRefreshing = true;
          await refreshToken()
            .then(() => {
              isRefreshing = false;
              onRefreshed();
            })
            .catch((refreshTokenError: Error) => {
              removeTokens();
              return Promise.reject(refreshTokenError);
            });
        }

        return retryOriginalRequest;
      }

      return Promise.reject(error);
    }
  );

  configure({ axios });
};
export default configureAxios;
