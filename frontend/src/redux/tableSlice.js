import { createSlice } from "@reduxjs/toolkit";

const tableSlice = createSlice({
    name: "table",
    initialState: {
        shopTables: [],
        shopBookings: [],
        myBookings: [],
    },
    reducers: {
        setShopTables: (state, action) => {
            state.shopTables = action.payload;
        },
        setShopBookings: (state, action) => {
            state.shopBookings = action.payload;
        },
        setMyBookings: (state, action) => {
            state.myBookings = action.payload;
        }
    }
});

export const { setShopTables, setShopBookings, setMyBookings } = tableSlice.actions;
export default tableSlice.reducer;
