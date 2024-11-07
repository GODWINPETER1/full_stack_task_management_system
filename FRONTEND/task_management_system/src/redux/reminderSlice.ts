import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchReminders = createAsyncThunk('reminders/fetchReminders', async (taskId) => {
  const response = await axios.get(`http://127.0.0.1:8000/api/v1/tasks/${taskId}/reminders`);
  return response.data;
});

const reminderSlice = createSlice({
  name: 'reminders',
  initialState: [],
  reducers: {
    // Add your additional reducers here if necessary
  },
  extraReducers: (builder) => {
    builder.addCase(fetchReminders.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export default reminderSlice.reducer;
