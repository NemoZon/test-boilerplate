import { configureStore } from '@reduxjs/toolkit'
import { actionReducer, actionTypeReducer } from '../../entities'
import { creditReducer } from '../../entities/credits/slices'

export const store = configureStore({
  reducer: {
    action: actionReducer,
    actionType: actionTypeReducer,
    creditReducer: creditReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch