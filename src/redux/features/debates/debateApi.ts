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
    newDebate: builder.mutation({
      query: (data) => ({
        url: "/debates",
        method: "POST",
        credentials: "include",
        body: data,
      }),
    }),
    updateDebate: builder.mutation({
      query: ({ id, data }) => ({
        url: `/debates/${id}`,
        method: "PATCH",
        credentials: "include",
        body: data,
      }),
    }),
    updateDebateStatus: builder.mutation({
      query: ({ debate_id, status }) => ({
        url: `/debates/${debate_id}/status`,
        method: "PATCH",
        credentials: "include",
        body: { status },
      }),
    }),
    deleteDebate: builder.mutation({
      query: ({ debate_id }) => ({
        url: `/debates/${debate_id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useGetDebatesQuery,
  useNewDebateMutation,
  useUpdateDebateMutation,
  useUpdateDebateStatusMutation,
  useDeleteDebateMutation,
} = debateApi;
