import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api/employees';

const client = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

function extractErrorMessage(error) {
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message;
  }
  return 'Something went wrong. Please try again.';
}

export const employeeApi = {
  async getAll() {
    try {
      const res = await client.get('/');
      return res.data;
    } catch (err) {
      throw new Error(extractErrorMessage(err));
    }
  },

  async getById(id) {
    try {
      const res = await client.get(`/${id}`);
      return res.data;
    } catch (err) {
      throw new Error(extractErrorMessage(err));
    }
  },

  async create(employee) {
    try {
      const res = await client.post('/', employee);
      return res.data;
    } catch (err) {
      throw new Error(extractErrorMessage(err));
    }
  },

  async update(id, employee) {
    try {
      const res = await client.put(`/${id}`, employee);
      return res.data;
    } catch (err) {
      throw new Error(extractErrorMessage(err));
    }
  },

  async remove(id) {
    try {
      await client.delete(`/${id}`);
    } catch (err) {
      throw new Error(extractErrorMessage(err));
    }
  },
};
