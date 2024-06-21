import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { BaseState } from '../../../shared/types';
import { Credit } from '../type';
import { fetchAllCredits } from '../actions';

interface CreditState extends BaseState {
    credits: Credit[];
}

const initialState: CreditState = {
    status: 'idle',
    error: null,
    credits: [],
}

export const creditSlice = createSlice({
    name: 'action',
    initialState,
    reducers: {
        setCredits: (state, action: PayloadAction<Credit[]>) => {
            state.credits = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAllCredits.pending, (state) => {
            state.status = 'loading'
        })
        builder.addCase(fetchAllCredits.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.credits = action.payload
        })
        builder.addCase(fetchAllCredits.rejected, (state, action) => {
            state.error = action.error.message || null;
            state.status = 'failed'
        })
    },
})

export const { setCredits } = creditSlice.actions

export const creditReducer = creditSlice.reducer