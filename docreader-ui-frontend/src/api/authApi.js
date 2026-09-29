import axiosClient from './axiosClient';

export const authApi = {
  login: async ({ username, password }) => {
    try {
      const response = await axiosClient.post('/auth/login', { username, password });
      return response.data; // { accessToken, user: { id, username, email, role } }
    } catch (err) {
      const serverMsg = err.response?.data?.message || err.response?.data?.error;
      if (serverMsg && serverMsg.includes('Bad credentials')) {
        throw new Error('Invalid username or password', { cause: err });
      }
      throw new Error(serverMsg || 'Login failed. Please check your credentials.', { cause: err });
    }
  },

  register: async ({ username, email, password }) => {
    try {
      const response = await axiosClient.post('/auth/register', { username, email, password });
      return response.data; // { id, username, email, role }
    } catch (err) {
      const serverMsg = err.response?.data?.message || err.response?.data?.error;
      if (serverMsg && serverMsg.includes('already exists')) {
        throw new Error('Username or email already exists', { cause: err });
      }
      throw new Error(serverMsg || 'Registration failed. Please try again.', { cause: err });
    }
  },
};
