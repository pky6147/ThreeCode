import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

const getAxiosConfig = () => ({
  headers: { 'Content-Type': 'application/json' },
});

// 출고 관련 API
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

// 출하증 관련 API
export const deliveryNoteApi = {
  // 전체 출하증
  getAll: async () => axios.get(`${BASE_URL}/delivery-note`, getAxiosConfig()),

  // productOutputId로 출하증 단건 조회
  getByOutputId: async (outputId: number) =>
    axios.get(`${BASE_URL}/delivery-note/by-output/${outputId}`, getAxiosConfig()),

  create: async (data: {
    productOutputId: number;
    receiverName: string;
    address: string;
    contact: string;
    issueDate: string;
  }) => axios.post(`${BASE_URL}/delivery-note`, data, getAxiosConfig()),

  update: async (
    id: number,
    data: Partial<{
      receiverName: string;
      address: string;
      contact: string;
      issueDate: string;
    }>
  ) => axios.put(`${BASE_URL}/delivery-note/${id}`, data, getAxiosConfig()),

  remove: async (id: number) => axios.delete(`${BASE_URL}/delivery-note/${id}`, getAxiosConfig()),
};