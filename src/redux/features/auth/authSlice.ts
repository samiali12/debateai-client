import { UserType } from "@/types/User";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
interface AuthState {
  user: UserType | null; // Adjust the type according to your user object structure
}

// Define the initial state using that type
const initialState: AuthState = {
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userLoggedIn: (state, action: PayloadAction<{ user: UserType }>) => {
      state.user = action.payload.user;
    },
    userLogout: (state) => {
      state.user = null;
    },
  },
});

export const { userLoggedIn, userLogout } = authSlice.actions;
export default authSlice.reducer;
