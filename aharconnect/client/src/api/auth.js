import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Change to your deployed URL later
});

// Signup request
export const signupUser = (userData) => API.post('/auth/signup', userData);

// Signin request
export const signinUser = (userData) => API.post('/auth/signin', userData);
