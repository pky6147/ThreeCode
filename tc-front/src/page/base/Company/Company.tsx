import { useState, useEffect } from 'react';
import { Box, Typography, Card, Dialog, type SelectChangeEvent } from '@mui/material';
import CustomBC from '../../../component/CustomBC';
import CustomBtn from '../../../component/CustomBtn';
import CommonTable from '../../../component/CommonTable';
import SearchBar from '../../../component/SearchBar';
import LabelInput from '../../../component/LabelInput';
import LabelSelect from '../../../component/LabelSelect'
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
  const [searchInfo, setSearchInfo] = useState({
          companyType: '거래처',
          companyName: '',
          ceoName: '',
          isActive: 'Y',
      })
  const [listActiveYN] = useState<{id: string; name:string}[]>([
          {id: 'Y', name: 'Y'},
          {id: 'N', name: 'N'},
  ])
  const [listType] = useState<{id: string; name:string}[]>([
          {id: '거래처', name: '거래처'},
          {id: '매입처', name: '매입처'},
  ])
  const [searchRows, setSearchRows] = useState<CompanyRow[]>([])
  const [isSearch, setIsSearch] = useState(false)

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

  /* 검색/초기화 관련함수 */
  const handleSelectChange_CompanyType = (event: SelectChangeEvent<string>) => {
          const selectedId = event.target.value;
          const selectedType = listType.find(c => c.id === selectedId)
  
          if(selectedType) {
              setSearchInfo(prev => ({
                  ...prev,
                  companyType: selectedType.name,
              }))
          }
  }
  const handleSelectChange_IsActive = (event: SelectChangeEvent<string>) => {
          const selectedId = event.target.value;
          const selectedActive = listActiveYN.find(c => c.id === selectedId)
  
          if(selectedActive) {
              setSearchInfo(prev => ({
                  ...prev,
                  isActive: selectedActive.name,
              }))
          }
  }
  const handleSearch = () => {
      setIsSearch(true)
      const filtered = companies.filter(row =>
          (row.companyType?.toLowerCase() || '').includes(searchInfo.companyType.toLowerCase()) &&
          (row.companyName?.toLowerCase() || '').includes(searchInfo.companyName.toLowerCase()) &&
          (row.ceoName?.toLowerCase() || '').includes(searchInfo.ceoName.toLowerCase()) &&
          (row.isActive?.toLowerCase() || '').includes(searchInfo.isActive.toLowerCase()) 
      )
      setSearchRows(filtered)
  }
  const handleReset = () => {
      setIsSearch(false)
      setSearchInfo({
          companyType: '거래처',
          companyName: '',
          ceoName: '',
          isActive: 'Y'
      })
      setSearchRows(companies)
  }
  const handleSearchChange = (key: keyof typeof searchInfo, value: string) => {
      setSearchInfo((prev) => ({ ...prev, [key]: value }));
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
          sx={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                height: '100%', width: '100%'
           }}
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
        <CustomBC text="업체 관리" subText='기준정보 관리' />
        <Box sx={{padding: 2}}>
          <SearchBar onSearch={handleSearch} onReset={handleReset}>
            <LabelSelect 
                labelText='업체유형'
                value={searchInfo.companyType?.toString() || ''}
                onChange={handleSelectChange_CompanyType}
                options={listType}
            />
            <LabelInput 
                labelText='업체명'
                value={searchInfo.companyName}
                onChange={(e) => handleSearchChange('companyName', e.target.value)}
            />
            <LabelInput 
                labelText='대표명'
                value={searchInfo.ceoName}
                onChange={(e) => handleSearchChange('ceoName', e.target.value)}
            />
            <LabelSelect 
                labelText='사용여부'
                value={searchInfo.isActive?.toString() || ''}
                onChange={handleSelectChange_IsActive}
                options={listActiveYN}
            />
          </SearchBar>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingX: 2 }}>
          <Typography sx={{ fontSize: '24px', fontWeight: 'bold' }}>업체 정보</Typography>
          <CustomBtn text="등록" backgroundColor="green" onClick={() => handleOpenForm()} />
        </Box>

        <Box sx={{ padding: 2 }}>
          {/* <CommonTable columns={columns} rows={companies} /> */}
          { isSearch ? (
                            <CommonTable 
                            columns={columns}
                            rows={searchRows}
                            />
                        ) : (
                            <CommonTable 
                                columns={columns}
                                rows={companies}
                            />
                        )}
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
