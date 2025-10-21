import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

// 공통 axios config (토큰, 헤더 등 필요 시 확장 가능)
const getAxiosConfig = () => ({
  headers: { "Content-Type": "application/json" },
});

// 수주대상 입고 등록
export const createProductInput = async (data: Partial<{
  productId: number;
  productInputQty: number;
  productInputDate: string;
}>) => {
  const response = await axios.post(`${BASE_URL}/product-input`, data, getAxiosConfig());
  return response.data;
};

// 수주대상 입고현황 조회
export const getProductInput = async () => {
  const response = await axios.get(`${BASE_URL}/product-input`, getAxiosConfig());
  return response.data;
};

// 수주대상 입고 이력 수정
export const updateProductInput = async (id:number, data: Partial<{
  productId: number;
  productInputQty: number;
  productInputDate: string;
}>) => {
  const response = await axios.put(`${BASE_URL}/product-input/${id}`,data, getAxiosConfig());
  return response.data;
};

// 수주대상 삭제
export const deleteProductInput = async (id: number) => {
  const response = await axios.delete(`${BASE_URL}/product-input/${id}`, getAxiosConfig());
  return response.data;
};
