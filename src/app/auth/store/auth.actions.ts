import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ======= types ======= //
import { LogIn } from 'src/app/auth/types/LogIn.type';
import { tokens } from 'src/app/auth/types/tokens.type';
import { ResetToken } from '../types/ResetToken.type';
import { ForgotPassword } from '../types/ForgotPassword.type';
import { ResetPassword } from '../types/ResetPassword.type';
import { SignUp } from '../types/SignUp.type';

// ======= utils ======= //
import getDeviceId from '../utils/getDeviceId';

const { REACT_APP_BASE_URL } = process.env;

export const signin = createAsyncThunk<tokens, LogIn>(
  'POST/signin',
  async (body, { rejectWithValue }) => {
    try {
      const device_id = getDeviceId()
      const response = await axios.post(REACT_APP_BASE_URL + '/auth/signin', {
        ...body,
        device_id,
      });
      sessionStorage.setItem('access-token', response.data.access_token);
      localStorage.setItem('refresh-token', response.data.access_token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);


export const signup = createAsyncThunk<tokens, SignUp>(
  'POST/signup',
  async (body, { rejectWithValue }) => {
    try {
      const device_id = getDeviceId()
      const response = await axios.post(REACT_APP_BASE_URL + '/auth/signup', {
        ...body,
        device_id,
      });
      sessionStorage.setItem('access-token', response.data.access_token);
      localStorage.setItem('refresh-token', response.data.access_token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const forgotPassword = createAsyncThunk<ResetToken, ForgotPassword>(
  'POST/forgot-password',
  async (body, { rejectWithValue }) => {
    try {
      const device_id = getDeviceId()
      const response = await axios.post(REACT_APP_BASE_URL + '/auth/forgot-password', {
        ...body,
        device_id,
      });
      sessionStorage.setItem('reset-token', response.data.token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

export const resetPassword = createAsyncThunk<tokens, ResetPassword>(
  'POST/reset-password',
  async (body, { rejectWithValue }) => {
    try {
      const device_id = getDeviceId()
      const reset_token = sessionStorage.getItem('reset-token');
      const response = await axios.post(REACT_APP_BASE_URL + '/auth/reset-password', {
        ...body,
        device_id,
        reset_token,
      });
      sessionStorage.setItem('access-token', response.data.access_token);
      localStorage.setItem('refresh-token', response.data.access_token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);
