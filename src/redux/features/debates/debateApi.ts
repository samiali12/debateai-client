import { apiSlice } from "@/redux/api/apiSlice";
import { DebateType } from "@/types/Debates";

interface DebateListResponse {
  data: DebateType[];
}

export const debateApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDebates: builder.query<DebateListResponse, void>({
      query: () => ({
        url: "/debates",
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const { useGetDebatesQuery } = debateApi;
