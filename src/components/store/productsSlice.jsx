import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: JSON.parse(localStorage.getItem("selectedProducts")) || [],
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addtocart: (state, action) => {
      state.items.push(action.payload);
      localStorage.setItem("selectedProducts", JSON.stringify(state.items));
    },
    deleteProduct: (state, action) => {
      state.items = state.items.filter(
        (item) => item.uniqCartId !== action.payload
      );
      localStorage.setItem("selectedProducts", JSON.stringify(state.items));
    },
    clearState: (state) => {
      (state.items = []), localStorage.removeItem("selectedProducts");
    },
  },
});

export const { addtocart, deleteProduct, clearState } = productsSlice.actions;
export default productsSlice.reducer;
