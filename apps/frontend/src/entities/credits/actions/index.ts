import { createAsyncThunk } from '@reduxjs/toolkit'
import { Credit } from '../type'
import { $api } from '../../../shared'
import axios, { AxiosResponse } from 'axios'

export const fetchAllCredits = createAsyncThunk(
    'credit/fetchAllCredits',
    async (): Promise<Credit[]> => {
        try {
            const response: AxiosResponse<Credit[]> = await $api.get("/credit")
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
