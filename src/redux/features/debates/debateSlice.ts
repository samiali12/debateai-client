import { DebateType } from "@/types/Debates";
import { createSlice } from "@reduxjs/toolkit";

interface DebateState {
  debate: DebateType | null;
}

const initialState: DebateState = {
  debate: null,
};

export const debateSlice = createSlice({
  name: "debate",
  initialState,
  reducers: {
    setDebate: (state, action) => {
      state.debate = action.payload;
    },
    clearDebate: (state) => {
      state.debate = null;
    },
  },
});
export const { setDebate, clearDebate } = debateSlice.actions;
export default debateSlice.reducer;
