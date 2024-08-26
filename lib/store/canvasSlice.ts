import { IFrameMessage } from "@/components/Canvas";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
export interface ICanvasState {
  selectedElement: any;
  canvas: any;
  selectedElementStyle: any;
  rulesWithReferences: any;
  message: IFrameMessage | null;
  flatData: any
}

const initialState: ICanvasState = {
  selectedElement: undefined,
  canvas: undefined,
  selectedElementStyle: undefined,
  rulesWithReferences: [],
  message: null,
  flatData: {}
};

export const canvasSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setFlatData:(state, action: PayloadAction<any>) => {
      state.flatData = action.payload
    },
    setMessage:(state, action: PayloadAction<IFrameMessage>)=>{
      state.message = action.payload
    },
    setRulesWithReferences: (state, action: PayloadAction<any>) => {
      state.rulesWithReferences = action.payload;
    },
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

export const { setSelectedElement, updateSelectedElement,setFlatData ,setRulesWithReferences,setSelectedElementStyle,setMessage} = canvasSlice.actions;
export const canvasReducer = canvasSlice.reducer;
