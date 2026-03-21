import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  _id: string;
  fullNamme: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  accountType: 'Admin' | 'Student' | 'Instructor';
  active: boolean;
  approved: boolean;
  image: string;
  courses: any[];
  courseProgress: any[];
  additionalDetails?: {
    contactNumber?: string;
    about?: string;
    dateOfBirth?: string;
    gender?: string;
  };
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; accessToken: string }>) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      localStorage.removeItem("enrollmentToken");
      localStorage.removeItem("enrolledUser");
      localStorage.setItem('accessToken', action.payload.accessToken);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    loginFailure: (state) => {
      state.isLoading = false;
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    },
    // logout: (state) => {
    //   state.user = null;
    //   state.accessToken = null;
    //   state.isAuthenticated = false;
    //   localStorage.removeItem('accessToken');
    //   localStorage.removeItem('user');

    // },


    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;

      localStorage.clear();
    },

    loadUserFromStorage: (state) => {
      const accessToken = localStorage.getItem('accessToken');
      const user = localStorage.getItem('user');
      if (accessToken && user) {
        state.accessToken = accessToken;
        state.user = JSON.parse(user);
        state.isAuthenticated = true;
      }
      state.isLoading = false;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, loadUserFromStorage } = authSlice.actions;
export default authSlice.reducer;