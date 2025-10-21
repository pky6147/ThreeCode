import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

const getAxiosConfig = () => ({
  headers: { 'Content-Type': 'application/json' },
});

// 출고 관련 API
export const productOutputApi = {
  // 전체 출고 목록 조회 
  getAll: async () => {
    const res = await axios.get(`${BASE_URL}/product-output`, getAxiosConfig());
    return res.data;
  },

  // 출고 단건 조회
  getById: async (id: number) => {
    const res = await axios.get(`${BASE_URL}/product-output/${id}`, getAxiosConfig());
    return res.data;
  },

  // 출고 등록
  create: async (data: {
    productInputId: number;
    productOutputQty: number;
    productOutputDate: string;
    remark?: string;
  }) => {
    const res = await axios.post(`${BASE_URL}/product-output`, data, getAxiosConfig());
    return res.data;
  },

  // 출고 수정
  update: async (id: number, data: { productOutputQty?: number; productOutputDate?: string; remark?: string }) => {
    const res = await axios.put(`${BASE_URL}/product-output/${id}`, data, getAxiosConfig());
    return res.data;
  },

  // 출고 삭제 (Soft Delete)
  remove: async (id: number) => {
    const res = await axios.delete(`${BASE_URL}/product-output/${id}`, getAxiosConfig());
    return res.data;
  },

  // 출하증 단건 조회
  getDeliveryNote: async (id: number) => {
    const res = await axios.get(`${BASE_URL}/product-output/${id}/delivery-note`, getAxiosConfig());
    return res.data;
  },
};