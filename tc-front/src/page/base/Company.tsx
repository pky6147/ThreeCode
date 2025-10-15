import { useState, useEffect } from 'react'
import { Box, Breadcrumbs, Typography, Card, Dialog } from '@mui/material'
import CustomBtn from '../../component/CustomBtn';
import CommonTable from '../../component/CommonTable';
import type { GridColDef } from '@mui/x-data-grid'
// import CompanyReg from './CompanyReg'
import axios from 'axios';
import CompanyForm from './CompanyReg';

// 회사 데이터 타입 정의
interface CompanyRow {
companyId: number;
  idx: number;
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
}

function Company() {
  const [open, setOpen] = useState(false);
  const [companies, setCompanies] = useState<CompanyRow[]>([]);
  const [editData, setEditData] = useState<CompanyRow | null>(null);

  // 백엔드에서 회사 목록 가져오기
  const fetchCompanies = async () => {
    try {
      const res = await axios.get<CompanyRow[]>('/api/company'); // 제네릭으로 타입 지정
      setCompanies(
        res.data.map((item, index: number) => ({
            ...item,
            id: item.companyId,
            idx: index + 1,
        }))
      );
    } catch (err) {
      console.error('회사 목록 조회 실패', err);
    }
  };

  useEffect(() => {
    fetchCompanies(); // 컴포넌트 마운트 시 목록 호출
  }, []);

  // 팝업 열기/닫기
  const handleOpen = () => {
    setEditData(null); // 등록모드에서는 editData 초기화
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  // 등록/수정 후 목록 갱신
  const handleAfterRegister = () => {
    handleClose();
    fetchCompanies();
  };

  // 수정 버튼 클릭 시
 const handleEdit = (rowData: CompanyRow) => {
    setEditData(rowData); // 그대로 넘기면 CompanyForm에서 초기화 처리됨
    // console.log('rowData', rowData)
    // console.log('companies', companies)
    setOpen(true);
  };

  // 삭제 버튼 클릭 시
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

  // 테이블 컬럼 정의
  const columns: GridColDef[] = [
    { field: 'idx', headerName: 'No', width: 70, headerAlign: 'center', align: 'center' },
    { field: 'companyType', headerName: '업체유형', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
    { field: 'companyName', headerName: '업체명', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'center',
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            cursor: 'pointer', textDecoration: 'underline', color: 'blue',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: '100%', width: '100%'
          }}
          onClick={() => {
            alert(`업체명 클릭: ${params.row.company_name}`);
            console.log('클릭한 행 데이터:', params.row);
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    { field: 'ceoName', headerName: '대표명', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
    { field: 'ceoPhone', headerName: '전화번호', flex: 2, minWidth: 200, headerAlign: 'center', align: 'center' },
    { field: 'address', headerName: '주소', flex: 3, minWidth: 400, headerAlign: 'center', align: 'left' },
    { field: 'remark', headerName: '비고', flex: 3, minWidth: 400, headerAlign: 'center', align: 'left' },
    { field: 'isActive', headerName: '사용여부', width: 100, headerAlign: 'center', align: 'center' },
    {
      field: 'edit', headerName: '수정', width: 100, headerAlign: 'center', align: 'center',
      renderCell: (params) => (
        <CustomBtn
          width="50px"
          text="수정"
          onClick={() => handleEdit(params.row)}
        />
      ),
    },
    {
      field: 'del', headerName: '삭제', width: 100, headerAlign: 'center', align: 'center',
      renderCell: (params) => (
        <CustomBtn
          width="50px"
          text="삭제"
          backgroundColor='#fb1e1eff'
          onClick={() => handleDelete(params.row)}
        />
      ),
    },
  ];

  return (
    <Card sx={{ height: '98%', margin: '0.5%' }}>
      <Box>
        {/* Breadcrumbs 영역 */}
        <Breadcrumbs sx={{ padding: 2 }}>
          <Typography sx={{ color: 'text.primary' }}>기준정보 관리</Typography>
          <Typography sx={{ color: 'text.primary', fontWeight: 'bold' }}>업체 관리</Typography>
        </Breadcrumbs>

        {/* Content 영역 */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '24px', fontWeight: 'bold', paddingLeft: 2 }}>업체 정보</Typography>
            <Box sx={{ paddingRight: 2 }}>
              <CustomBtn
                text="등록"
                backgroundColor='green'
                onClick={handleOpen}
              />
            </Box>
          </Box>

          <Box sx={{ padding: 2 }}>
            <CommonTable
              columns={columns}
              rows={companies}
            />
          </Box>
        </Box>
      </Box>

      {/* 등록/수정화면 팝업 */}
      <Dialog open={open} onClose={handleClose} maxWidth={false}>
        <CompanyForm
    mode={editData ? 'edit' : 'create'}  // editData가 있으면 수정 모드
    initialData={editData || undefined}  // 기존 데이터 넘기기
    onSubmit={handleAfterRegister}       // 저장 후 목록 갱신
  />
      </Dialog>
    </Card>
  );
}

export default Company;
