import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

const getAxiosConfig = () => ({
  headers: { 'Content-Type': 'application/json' },
});

export const productOutputApi = {
  getAll: async () => axios.get(`${BASE_URL}/product-output`, getAxiosConfig()),
  getById: async (id: number) => axios.get(`${BASE_URL}/product-output/${id}`, getAxiosConfig()),
  create: async (data: {
    productInputId: number;
    productOutputQty: number;
    productOutputDate: string;
    remark?: string;
  }) => axios.post(`${BASE_URL}/product-output`, data, getAxiosConfig()),
  update: async (id: number, data: { productOutputQty: number; productOutputDate: string }) =>
    axios.put(`${BASE_URL}/product-output/${id}`, data, getAxiosConfig()),
  remove: async (id: number) => axios.delete(`${BASE_URL}/product-output/${id}`, getAxiosConfig()),
};