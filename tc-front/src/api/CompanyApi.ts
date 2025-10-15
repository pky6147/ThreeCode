import axios from 'axios';

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
  const res = await axios.get<CompanyDto[]>('/api/company');
  return res.data;
};

// 업체 등록
export const createCompany = async (data: CompanyDto) => {
  const res = await axios.post<CompanyDto>('/api/company', data);
  return res.data;
};

// 업체 수정
export const updateCompany = async (companyId: number, data: CompanyDto) => {
  const res = await axios.put<CompanyDto>(`/api/company/${companyId}`, data);
  return res.data;
};

// 업체 삭제
export const deleteCompany = async (companyId: number) => {
  const res = await axios.delete<number>(`/api/company/${companyId}`);
  return res.data;
};
