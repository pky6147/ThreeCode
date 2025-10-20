import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

// 공통 axios config (토큰, 헤더 등 필요 시 확장 가능)
const getAxiosConfig = () => ({
  headers: { "Content-Type": "application/json" },
});

// 원자재 재고현황 조회
export const getMaterialStock = async () => {
  const response = await axios.get(`${BASE_URL}/material-stock`, getAxiosConfig());
  return response.data;
};
