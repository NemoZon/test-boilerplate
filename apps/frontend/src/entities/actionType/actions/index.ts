import { createAsyncThunk } from '@reduxjs/toolkit'
import { ActionType } from '../type'
import { $api } from '../../../shared'
import axios, { AxiosResponse } from 'axios'

export const fetchAllActionTypes = createAsyncThunk(
    'actionTypes/fetchAllActionTypes',
    async (): Promise<ActionType[]> => {
        try {
            const response: AxiosResponse<ActionType[]> = await $api.get("/actionType")
            return response.data
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    throw new Error(error.response.data.error);
                }
            }
            throw new Error("An unexpected error occurred");
        }
    }
)
