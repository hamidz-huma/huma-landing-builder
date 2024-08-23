import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
export interface ICanvasState {
  selectedElement: any;
  canvas: any;
  selectedElementStyle: any;
}

const initialState: ICanvasState = {
  selectedElement: undefined,
  canvas: undefined,
  selectedElementStyle: undefined,
};

export const canvasSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setSelectedElementStyle: (state, action: PayloadAction<any>) => {
      state.selectedElementStyle = action.payload;
    },
    setSelectedElement: (state, action: PayloadAction<any>) => {
      state.selectedElement = action.payload;
    },
    updateSelectedElement: (state, action: PayloadAction<any>) => {
      state.selectedElement = action.payload;
    },
  },
});

export const { setSelectedElement, updateSelectedElement ,setSelectedElementStyle} = canvasSlice.actions;
export const canvasReducer = canvasSlice.reducer;
