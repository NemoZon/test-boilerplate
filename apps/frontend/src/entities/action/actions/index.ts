import { createAsyncThunk } from '@reduxjs/toolkit'
import { Action } from '../type'
import { $api } from '../../../shared'
import { AxiosResponse } from 'axios'

export const fetchAllActions = createAsyncThunk(
    'actions/fetchAllActions',
    async (): Promise<Action[]> => {
        const response: AxiosResponse<Action[]> = await $api.get("/action")
        console.log(response.data);
        
        return response.data
    }
)
