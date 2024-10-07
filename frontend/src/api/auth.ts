// credits https://github.com/SimpleJWT/drf-SimpleJWT-React/blob/master/jwt-react/src/api/auth.js
import Axios from "axios";
import { API_SERVER } from "../Settings";

export type TokenResponse = {
  access: string;
  refresh: string;
};

const REQUEST_TIMEOUT_IN_MS = 15000;
export const BASE_URL = API_SERVER;
export const LOCAL_STORAGE_ACCESS_TOKEN_NAME = "access_token";
export const LOCAL_STORAGE_REFRESH_TOKEN_NAME = "refresh_token";

const tokenRequest = Axios.create({
  baseURL: BASE_URL,
  timeout: REQUEST_TIMEOUT_IN_MS,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

export const setAccessToken = (token: string) => {
  window.localStorage.setItem(LOCAL_STORAGE_ACCESS_TOKEN_NAME, token);
};

export const setRefreshToken = (token: string) => {
  window.localStorage.setItem(LOCAL_STORAGE_REFRESH_TOKEN_NAME, token);
};

export const getAccessToken = () =>
  window.localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN_NAME);

export const getRefreshToken = () =>
  window.localStorage.getItem(LOCAL_STORAGE_REFRESH_TOKEN_NAME);

export const removeAccessToken = () =>
  window.localStorage.removeItem(LOCAL_STORAGE_ACCESS_TOKEN_NAME);

export const removeRefreshToken = () =>
  window.localStorage.removeItem(LOCAL_STORAGE_REFRESH_TOKEN_NAME);

export const setTokens = (data: TokenResponse) => {
  setAccessToken(data.access);
  setRefreshToken(data.refresh);
};

export const refreshToken = async () => {
  // TODO
  const refreshBody = {
    refresh_token: window.localStorage.getItem(
      LOCAL_STORAGE_REFRESH_TOKEN_NAME
    ),
  };

  try {
    const response = await tokenRequest.post("/auth/refresh", refreshBody);
    setTokens(response.data);

    return await Promise.resolve(response.data);
  } catch (error) {
    if (error instanceof Axios.AxiosError && error.response?.status === 401) {
      // Redirect user to login if refresh token could not be used to obtain a new access token
      window.location.replace("/login");
    }
    return await Promise.reject(error);
  }
};

type RequestAccessTokenBody = {
  username: string;
  password: string;
  tenant_id?: string;
};

export const getToken = async (tokenBody: RequestAccessTokenBody) => {
  try {
    let postPayload = tokenBody;

    const response = await tokenRequest.post<TokenResponse>(
      "/auth/token",
      postPayload
    );
    console.log(response.data);
    setTokens(response.data);

    return await Promise.resolve(response.data);
  } catch (error) {
    return await Promise.reject(error);
  }
};

export const removeTokens = () => {
  removeAccessToken();
  removeRefreshToken();
};
