import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

// 공통 axios config (토큰, 헤더 등 필요 시 확장 가능)
const getAxiosConfig = () => ({
  headers: { "Content-Type": "application/json" },
});

// 입고 등록
export const createProductInput = async (data: {
    productId: number | undefined;
    productInputQty: number;
    productInputDate: string;
}) => {
    const res = await axios.post(`${BASE_URL}/product-input`, data, getAxiosConfig());
    return res.data;
};

// 전체 조회
export const getProductInput = async () => {
    const res = await axios.get(`${BASE_URL}/product-input`, getAxiosConfig()); 
    return res.data;
};

// 출고 가능한 입고 목록 조회 (추가된 부분) 
export const getAvailableProductInputs = async () => {
  const res = await axios.get(`${BASE_URL}/product-input/available`, getAxiosConfig());
  return res.data;
};

// 수정
export const updateProductInput = async (
  productInputId: number,
  data: { productInputQty: number; productInputDate: string }
) => {
  const res = await axios.put(`${BASE_URL}/product-input/${productInputId}`, data, getAxiosConfig());
  return res.data;
};

//삭제
export const deleteProductInput = async (productInputId: number) => {
  const res = await axios.delete(`${BASE_URL}/product-input/${productInputId}`, getAxiosConfig());
  return res.data;
};

//공정진행
export const getLotProcessHistory = async (productInputId: number) => {
  const res = await axios.get(`${BASE_URL}/lot-process/${productInputId}`, getAxiosConfig());
  return res.data;
};

  //공정갱신
  export const updateLotProcess = async (
  lotProcessHistoryId: number,
  payload: { remark?: string; processEnd?: string }
) => {
  const res = await axios.put(`${BASE_URL}/update/${lotProcessHistoryId}`, payload, getAxiosConfig());
  return res.data;
};

 //출고등록조회
 export const getOutPut = async () => {
    const res = await axios.get(`${BASE_URL}/completed`, getAxiosConfig()); 
    return res.data;
};