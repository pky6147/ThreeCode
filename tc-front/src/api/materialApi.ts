import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

// 공통 axios config (토큰, 헤더 등 필요 시 확장 가능)
const getAxiosConfig = () => ({
  headers: { "Content-Type": "application/json" },
});

// 원자재 등록
export const createMaterial = async (data: {
  companyId: number,
  materialName: string;
  materialNo: string;
  category: string;
  color: string;
  spec: string;
  spec_value: string;
  maker: string;
  isActive: string;
  remark?: string;
}) => {
  const response = await axios.post(`${BASE_URL}/material`, data, getAxiosConfig());
  return response.data;
};

// 원자재 전체 조회
export const getMaterial = async () => {
  const response = await axios.get(`${BASE_URL}/material`, getAxiosConfig());
  return response.data;
};

// 원자재 수정
export const updateMaterial = async (id:number, data: {
  companyId: number,
  materialName: string;
  materialNo: string;
  category: string;
  color: string;
  spec: string;
  spec_value: string;
  maker: string;
  isActive: string;
  remark?: string;
}) => {
  const response = await axios.put(`${BASE_URL}/material/${id}`,data, getAxiosConfig());
  return response.data;
};

// 원자재 삭제
export const deleteMaterial = async (id: number) => {
  const response = await axios.delete(`${BASE_URL}/material/${id}`, getAxiosConfig());
  return response.data;
};
