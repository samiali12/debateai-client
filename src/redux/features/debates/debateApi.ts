import { apiSlice } from "@/redux/api/apiSlice";
import { DebateType } from "@/types/Debates";

interface DebateListResponse {
  data: DebateType[];
}

interface ParticipantsListResponse {
  data: {
    participantId: number;
    userId: number;
    fullName: string;
    email: string;
    role: string;
  }[];
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
    getDebateById: builder.query<{ data: DebateType }, number>({
      query: (id) => ({
        url: `/debates/${id}`,
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
    joinDebate: builder.mutation({
      query: ({ debate_id, role }) => ({
        url: `/debates/${debate_id}/join`,
        method: "PATCH",
        credentials: "include",
        body: { role },
      }),
    }),
    getParticipantsList: builder.query<
      ParticipantsListResponse,
      { debate_id: number }
    >({
      query: ({ debate_id }) => ({
        url: `/debates/${debate_id}/participants`,
        method: "GET",
        credentials: "include",
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
  useGetDebateByIdQuery,
  useGetParticipantsListQuery,
  useJoinDebateMutation,
  useNewDebateMutation,
  useUpdateDebateMutation,
  useUpdateDebateStatusMutation,
  useDeleteDebateMutation,
} = debateApi;
