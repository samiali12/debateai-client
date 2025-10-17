import {
  BaseQueryApi,
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { userLoggedIn } from "../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
});

const baseQueryWithReAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: object
) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    const refreshResult = await baseQuery(
      "/auth/refresh-token",
      api,
      extraOptions
    );
    if (refreshResult.data) {
      // Retry the original query
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Dispatch logout if token refresh fails
      //api.dispatch({ type: "auth/logout" });
    }
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    refreshToken: builder.query({
      query: () => ({
        url: "/auth/refresh-token",
        method: "GET",
        credentials: "include",
      }),
    }),
    loadUser: builder.query({
      query: () => ({
        url: "/auth/me",
        method: "GET",
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const res = await queryFulfilled;
          dispatch(userLoggedIn({ user: res.data.data }));
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {}
      },
    }),
  }),
});

export const { useRefreshTokenQuery, useLoadUserQuery } = apiSlice;
