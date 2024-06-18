import { createSlice } from '@reduxjs/toolkit'
import { BaseState } from '../../../shared/types';
import { Action } from '../type';
import { fetchAllActions } from '../actions';

interface ActionState extends BaseState {
    actions: Action[];
}

const initialState: ActionState = {
    status: 'idle',
    statusCode: null,
    error: null,
    actions: [],
}

export const actionSlice = createSlice({
    name: 'action',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading state as needed
        builder.addCase(fetchAllActions.fulfilled, (state, action) => {
            // Add user to the state array
            state.status = 'succeeded'
            state.actions.push(...action.payload)
        })
    },
})

export const actionReducer = actionSlice.reducer