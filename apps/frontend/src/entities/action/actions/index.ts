import { createAsyncThunk } from '@reduxjs/toolkit'
import { Action } from '../type'
import { $api } from '../../../shared'
import axios, { AxiosResponse } from 'axios'

export const fetchAllActions = createAsyncThunk(
    'actions/fetchAllActions',
    async (): Promise<Action[]> => {
        try {
            const response: AxiosResponse<Action[]> = await $api.get("/action")        
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
