import { apiSlice } from "../../api/apiSlice";
import { userLoggedIn } from "../auth/authSlice";

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/users/profile",
        method: "PUT",
        body: data,
      }),
      async onQueryStarted(args, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          // Update the user in the store with the new data
          dispatch(userLoggedIn({ user: result.data.user }));
        } catch (error) {
          //console.log(error);
        }
      },
    }),
  }),
  overrideExisting: true,
});

export const { useUpdateProfileMutation } = usersApi;
