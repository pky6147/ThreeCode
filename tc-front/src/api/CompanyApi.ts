import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '';

export interface CompanyDto {
  companyId?: number;
  companyType: string;
  companyName: string;
  ceoName: string;
  ceoPhone: string;
  address: string;
  remark: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  contactAddress?: string;
  contactRemark?: string;
  isActive?: string;
}

// 업체 목록 조회
export const getCompanies = async () => {
  const res = await axios.get<CompanyDto[]>(`${BASE_URL}/company`);
  return res.data;
};

export const createCompany = async (data: CompanyDto) => {
  const res = await axios.post<CompanyDto>(
    `/api/company`,  // /api 추가
    data,
    { headers: { 'Content-Type': 'application/json' } }
  );
  return res.data;
};

export const updateCompany = async (companyId: number, data: CompanyDto) => {
  const res = await axios.put<CompanyDto>(
    `/api/company/${companyId}`, // /api 추가
    data,
    { headers: { 'Content-Type': 'application/json' } }
  );
  return res.data;
};

export const deleteCompany = async (companyId: number) => {
  const res = await axios.delete<number>(`${BASE_URL}/company/${companyId}`);
  return res.data;
};