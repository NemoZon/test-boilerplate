import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { BaseState } from '../../../shared/types';
import { Action } from '../type';
import { createAction, fetchAllActions } from '../actions';

interface ActionState extends BaseState {
    actions: Action[];
}

const initialState: ActionState = {
    status: 'idle',
    error: null,
    actions: [],
}

export const actionSlice = createSlice({
    name: 'action',
    initialState,
    reducers: {
        deleteActionById: (state, action: PayloadAction<string>) => {
            state.actions = state.actions.filter((elem) => elem._id !== action.payload)
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAllActions.pending, (state) => {
            state.status = 'loading'
        })
        builder.addCase(fetchAllActions.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.actions = [...action.payload]
        })
        builder.addCase(fetchAllActions.rejected, (state, action) => {
            state.error = action.error.message || null;
            state.status = 'failed'
        })
        builder.addCase(createAction.pending, (state) => {
            state.status = 'loading'
        })
        builder.addCase(createAction.fulfilled, (state, action) => {
            state.status = 'succeeded'
            state.actions.push(action.payload)
        })
        builder.addCase(createAction.rejected, (state, action) => {
            state.error = action.error.message || null;
            state.status = 'failed'
        })
    },
})

export const { deleteActionById } = actionSlice.actions

export const actionReducer = actionSlice.reducer