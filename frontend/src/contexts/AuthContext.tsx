import useAxios from "axios-hooks";
import React, { createContext, useContext, useEffect, useReducer } from "react";
import { getAccessToken, removeTokens } from "../api/auth";
import { User } from "../types/common";

/*
 * This implementation follows the idea from
 * https://theodorusclarence.com/library/auth-context
 */

type TokenResponse = {
  access_token: string;
  refresh_token: string;
};

type AuthState = {
  authenticated: boolean;
  user: User | null;
  loading: boolean;
  forceLoadProfile: boolean;
};

type Action =
  | { type: "LOGIN"; payload: TokenResponse }
  | { type: "POPULATE_USER"; payload: User }
  | { type: "AUTHENTICATE" }
  | { type: "LOGOUT" }
  | { type: "STOP_LOADING" };

type Dispatch = React.Dispatch<Action>;

const StateContext = createContext<AuthState>({
  authenticated: false,
  user: null,
  loading: true,
  forceLoadProfile: false,
});

const DispatchContext = createContext<Dispatch>(() => {});

const reducer = (state: AuthState, action: Action): AuthState => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        authenticated: true,
        forceLoadProfile: true,
      };
    case "POPULATE_USER":
      return {
        ...state,
        user: action.payload,
        forceLoadProfile: false,
      };
    case "AUTHENTICATE":
      return {
        ...state,
        authenticated: true,
      };
    case "LOGOUT":
      removeTokens();
      return {
        ...state,
        authenticated: false,
        user: null,
      };
    case "STOP_LOADING":
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    user: null,
    authenticated: false,
    loading: true,
    forceLoadProfile: false,
  });

  const [, fetchProfile] = useAxios("/auth/user", {
    manual: true,
  });

  useEffect(() => {
    const loadUser = async () => {
      let exception;

      try {
        const token = getAccessToken();
        if (token == null || typeof token == "undefined") {
          dispatch({ type: "STOP_LOADING" });
          return;
        }

        dispatch({
          type: "AUTHENTICATE",
        });

        const { data } = await fetchProfile();

        dispatch({
          type: "POPULATE_USER",
          payload: data,
        });
      } catch (err) {
        exception = err;
      } finally {
        // if the request has been canceled, we do not want to trigger
        // the stop loading action as another request might be active due to the request being fired twice in dev environments
        // https://beta.reactjs.org/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development
        if (!(exception instanceof Error)) {
          dispatch({ type: "STOP_LOADING" });
        }
      }
    };

    if (!state.user || state.forceLoadProfile) {
      loadUser();
    }
  }, [fetchProfile, state.user, state.user?.id, state.forceLoadProfile]);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export const useAuthState: () => AuthState = () => useContext(StateContext);
export const useAuthDispatch: () => Dispatch = () =>
  useContext(DispatchContext);
