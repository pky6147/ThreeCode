import { useState, useEffect } from 'react';
import { Box, Breadcrumbs, Typography, Card, Dialog } from '@mui/material';
import CustomBtn from '../../component/CustomBtn';
import CommonTable from '../../component/CommonTable';
import type { GridColDef } from '@mui/x-data-grid';
import axios from 'axios';

import CompanyForm from './CompanyReg';
import CompanyDetail from './CompanyDetail';

// 타입 export
export interface CompanyRow {
  companyId: number;
  idx?: number;
  companyType?: string;
  companyName?: string;
  ceoName?: string;
  ceoPhone?: string;
  address?: string;
  remark?: string;
  isActive?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  contactAddress?: string;
  contactRemark?: string;
}

function Company() {
  const [companies, setCompanies] = useState<CompanyRow[]>([]);
  const [editData, setEditData] = useState<CompanyRow | null>(null);
  const [detailData, setDetailData] = useState<CompanyRow | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);

  // 전체 회사 조회
  const fetchCompanies = async () => {
    try {
      const res = await axios.get<CompanyRow[]>('/api/company');
      setCompanies(
        res.data.map((item, index) => ({
          ...item,
          idx: index + 1,
          id: item.companyId, //DataGrid 고유 id
        }))
      );
    } catch (err) {
      console.error('회사 목록 조회 실패', err);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleOpenForm = (rowData?: CompanyRow) => {
    setEditData(rowData || null);
    setOpenForm(true);
  };
  const handleCloseForm = () => setOpenForm(false);
  const handleAfterSubmit = () => {
    handleCloseForm();
    fetchCompanies();
  };

  const handleOpenDetail = (rowData: CompanyRow) => {
    setDetailData(rowData);
    setOpenDetail(true);
  };
  const handleCloseDetail = () => setOpenDetail(false);

  const handleDelete = async (rowData: CompanyRow) => {
    if (!confirm(`"${rowData.companyName}" 업체를 삭제하시겠습니까?`)) return;
    try {
      await axios.delete(`/api/company/${rowData.companyId}`);
      alert('삭제되었습니다.');
      fetchCompanies();
    } catch (err) {
      console.error(err);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const columns: GridColDef[] = [
    { field: 'idx', headerName: 'No', width: 70, headerAlign: 'center', align: 'center' },
    { field: 'companyType', headerName: '업체유형', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
    {
      field: 'companyName',
      headerName: '업체명',
      flex: 1.5,
      minWidth: 150,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}
          onClick={() => handleOpenDetail(params.row)}
        >
          {params.value}
        </Typography>
      ),
    },
    { field: 'ceoName', headerName: '대표명', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
    { field: 'ceoPhone', headerName: '전화번호', flex: 2, minWidth: 200, headerAlign: 'center', align: 'center' },
    { field: 'address', headerName: '주소', flex: 3, minWidth: 300, headerAlign: 'center', align: 'left' },
    { field: 'remark', headerName: '비고', flex: 3, minWidth: 300, headerAlign: 'center', align: 'left' },
    { field: 'isActive', headerName: '사용여부', width: 100, headerAlign: 'center', align: 'center' },
    {
      field: 'edit',
      headerName: '수정',
      width: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => <CustomBtn width="50px" text="수정" onClick={() => handleOpenForm(params.row)} />,
    },
    {
      field: 'del',
      headerName: '삭제',
      width: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <CustomBtn width="50px" text="삭제" backgroundColor="#fb1e1eff" onClick={() => handleDelete(params.row)} />
      ),
    },
  ];

  return (
    <Card sx={{ height: '98%', margin: '0.5%' }}>
      <Box>
        <Breadcrumbs sx={{ padding: 2 }}>
          <Typography sx={{ color: 'text.primary' }}>기준정보 관리</Typography>
          <Typography sx={{ color: 'text.primary', fontWeight: 'bold' }}>업체 관리</Typography>
        </Breadcrumbs>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingX: 2 }}>
          <Typography sx={{ fontSize: '24px', fontWeight: 'bold' }}>업체 정보</Typography>
          <CustomBtn text="등록" backgroundColor="green" onClick={() => handleOpenForm()} />
        </Box>

        <Box sx={{ padding: 2 }}>
          <CommonTable columns={columns} rows={companies} />
        </Box>
      </Box>

      <Dialog open={openForm} onClose={handleCloseForm} maxWidth={false}>
        <CompanyForm mode={editData ? 'edit' : 'create'} initialData={editData || undefined} onSubmit={handleAfterSubmit} />
      </Dialog>

      {detailData && <CompanyDetail company={detailData} open={openDetail} onClose={handleCloseDetail} />}
    </Card>
  );
}

export default Company;
