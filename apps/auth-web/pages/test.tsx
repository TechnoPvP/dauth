import axios, { AxiosError } from 'axios';
import React from 'react';

const Test = () => {
  const handleMe = async () => {
    try {
      const response = await axios.get('https://localhost:5050/auth/me', {
        withCredentials: true,
      });
      console.log(response.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data);
      }
    }
  };

  const handleCallHrms = async () => {
    try {
      const response = await axios.get('https://localhost:6010/employee', {
        withCredentials: true,
      });
      console.log(response.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error fetching data', error.response?.data);
      }
    }
  };

  const logout = async () => {
    try {
      const response = await axios.post(
        'https://localhost:5050/auth/logout',
        {},
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data);
      }
    }
  };

  return (
    <>
      <button onClick={handleCallHrms}>Call HRMS</button>
      <button onClick={handleMe}>Call Auth</button>
      <button onClick={logout}>Logout</button>

      <a href="https://localhost:5050/auth/login/github?redirectUrl=https://localhost:4200/test">
        Login Github
      </a>
    </>
  );
};

export default Test;
