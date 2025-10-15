import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

// 공통 axios config (토큰, 헤더 등 필요 시 확장 가능)
const getAxiosConfig = () => ({
  headers: { "Content-Type": "application/json" },
});

//라우팅 등록
export const createRouting = async (data: {
  processCode: string;
  processName: string;
  processTime: number;
  processOrder: number;
  remark?: string;
}) => {
  const response = await axios.post(`${BASE_URL}/routing-master`, data, getAxiosConfig());
  return response.data;
};

//라우팅 전체 조회
export const getRoutings = async () => {
  const response = await axios.get(`${BASE_URL}/routing-master`, getAxiosConfig());
  return response.data;
};

//라우팅 수정

export const updateRoutings = async (id:number, data: {
  processCode: string;
  processName: string;
  processTime: number;
  processOrder: number;
  remark?: string;
}) => {
  const response = await axios.put(`${BASE_URL}/routing-master/${id}`,data, getAxiosConfig());
  return response.data;
};

export const deleteRouting = async (id: number) => {
  const response = await axios.delete(`${BASE_URL}/routing-master/${id}`, getAxiosConfig());
  return response.data;
};
