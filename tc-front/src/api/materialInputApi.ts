import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

// 공통 axios config (토큰, 헤더 등 필요 시 확장 가능)
const getAxiosConfig = () => ({
  headers: { "Content-Type": "application/json" },
});

// 원자재 입고 등록
export const createMaterialInput = async (data: Partial<{
  materialId: number;
  materialInputQty: number;
  materialInputDate: string;
  makeDate: string;
}>) => {
  const response = await axios.post(`${BASE_URL}/material-input`, data, getAxiosConfig());
  return response.data;
};

// 원자재 입고현황 조회
export const getMaterialInput = async () => {
  const response = await axios.get(`${BASE_URL}/material-input`, getAxiosConfig());
  return response.data;
};

// 원자재 입고 이력 수정
export const updateMaterialInput = async (id:number, data: Partial<{
  materialId: number;
  materialInputQty: number;
  materialInputDate: string;
  makeDate: string;
}>) => {
  const response = await axios.put(`${BASE_URL}/material-input/${id}`,data, getAxiosConfig());
  return response.data;
};

// 원자재 삭제
export const deleteMaterialInput = async (id: number) => {
  const response = await axios.delete(`${BASE_URL}/material-input/${id}`, getAxiosConfig());
  return response.data;
};
