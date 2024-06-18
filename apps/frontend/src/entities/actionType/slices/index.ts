import { createSlice } from '@reduxjs/toolkit'
import { BaseState } from '../../../shared/types';
import { ActionType } from '../type';
import { fetchAllActionTypes } from '../actions';

interface ActionTypeState extends BaseState {
    actionTypes: { [key: string]: ActionType };
}

const initialState: ActionTypeState = {
    status: 'idle',
    error: null,
    actionTypes: {},
}

export const actionTypeSlice = createSlice({
    name: 'action',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchAllActionTypes.pending, (state) => {
            state.status = 'loading'
        })
        builder.addCase(fetchAllActionTypes.fulfilled, (state, action) => {
            state.status = 'succeeded'
            action.payload.forEach((type) => {
                state.actionTypes[type._id] = type
            })
        })
        builder.addCase(fetchAllActionTypes.rejected, (state, action) => {
            state.error = action.error.message || null;
            state.status = 'failed'
        })
    },
})

export const actionTypeReducer = actionTypeSlice.reducer