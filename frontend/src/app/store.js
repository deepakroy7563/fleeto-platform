import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import bikeReducer from '../features/bikes/bikeSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    bikes: bikeReducer,
  },
})
