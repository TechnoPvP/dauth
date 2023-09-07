import axios from 'axios';

const BASE_URL = 'http://localhost:5050';

export const fetchGithubCallback = async (params: { code: string }) => {
  const response = await axios.post(`${BASE_URL}/auth/github/callback`, {
    code: params.code,
  });

  return response;
};
