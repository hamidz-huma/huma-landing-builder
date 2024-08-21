import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
export interface ICanvasState {
  selectedElement: any;
  canvas: any;
  rulesWithReferences: Array<{
    rule: any;
    selector: any;
    style: any;
  }>
}

const initialState: ICanvasState = {
  selectedElement: undefined,
  canvas: undefined,
  rulesWithReferences: []
};

export const canvasSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setRulesWithReferences: (state, action: PayloadAction<Array<{
      rule: any;
      selector: any;
      style: any;
    }>>) => {
      state.rulesWithReferences = [...action.payload]
    },
    setSelectedElement: (state, action: PayloadAction<any>) => {
      state.selectedElement = action.payload;
    },
    updateSelectedElement: (state, action: PayloadAction<any>) => {
      state.selectedElement = action.payload;
    },
  },
});

export const { setSelectedElement, updateSelectedElement, setRulesWithReferences } = canvasSlice.actions;
export const canvasReducer = canvasSlice.reducer;
