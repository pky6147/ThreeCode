import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

// 공통 axios config (토큰, 헤더 등 필요 시 확장 가능)
const getAxiosConfig = () => ({
  headers: { "Content-Type": "application/json" },
});

// 원자재 출고 등록
export const createMaterialOutput = async (data: Partial<{
  materialInputId: number;
  materialId: number;
  materialOutputQty: number;
  materialOutputDate: string;
}>) => {
  const response = await axios.post(`${BASE_URL}/material-output`, data, getAxiosConfig());
  return response.data;
};

// 원자재 출고현황 조회
export const getMaterialOutput = async () => {
  const response = await axios.get(`${BASE_URL}/material-output`, getAxiosConfig());
  return response.data;
};
// 원자재 출고등록 조회
export const getMaterialOutputReg = async () => {
  const response = await axios.get(`${BASE_URL}/material-output/available`, getAxiosConfig());
  return response.data;
};

// 원자재 출고 이력 수정
export const updateMaterialOutput = async (id:number, data: Partial<{
  materialId: number;
  materialOutputQty: number;
  materialOutputDate: string;
}>) => {
  const response = await axios.put(`${BASE_URL}/material-output/${id}`,data, getAxiosConfig());
  return response.data;
};

// 원자재 출고 이력 삭제
export const deleteMaterialOutput = async (id: number) => {
  const response = await axios.delete(`${BASE_URL}/material-output/${id}`, getAxiosConfig());
  return response.data;
};
