import { configureStore } from "@reduxjs/toolkit"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import { counterSlice } from "../Features/contact/counterSlice"
import { basketSlice } from "../Features/basket/basketSlice"
 import { catalogSlice } from "../Features/catalog/catalogSlice"
import { accountSlice } from "../Features/account/accountSlice"


export const store = configureStore({
    reducer : {
        counter : counterSlice.reducer,
        basket : basketSlice.reducer,
        catalog : catalogSlice.reducer,
        account : accountSlice.reducer
    }
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


export const useAppDispatch = ()=> useDispatch<AppDispatch>();
export const useAppSelector : TypedUseSelectorHook<RootState> = useSelector;
