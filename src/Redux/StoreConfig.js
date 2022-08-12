import {configureStore} from '@reduxjs/toolkit'
import StoreSlice from './StoreSlices';

export const MyStore = configureStore({
    reducer: { Store : StoreSlice }
})