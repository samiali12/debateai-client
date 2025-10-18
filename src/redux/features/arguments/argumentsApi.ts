import { apiSlice } from "@/redux/api/apiSlice";
import { ArgumentType } from "@/types/Arguments";

interface ArgumentListResponse {
  data: ArgumentType[];
}

export const argumentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllArguments: builder.query<ArgumentListResponse, { debate_id: number }>(
      {
        query: ({ debate_id }) => ({
          url: `/arguments/${debate_id}`,
          method: "GET",
          credentials: "include",
        }),
      }
    ),
  }),
});

export const { useGetAllArgumentsQuery } = argumentsApi;
