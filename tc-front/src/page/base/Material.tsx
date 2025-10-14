import { Box, Breadcrumbs, Typography, Card } from '@mui/material'
import CustomBtn from '../../component/CustomBtn';
import CommonTable from '../../component/CommonTable';
import type { GridColDef } from '@mui/x-data-grid'

const columns: GridColDef[] = [
    { field: 'idx', headerName: 'No', width: 70, headerAlign: 'center', align: 'center' },
    { field: 'company_name', headerName: '매입처명', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'center' },
    { field: 'material_no', headerName: '품목번호', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
    { field: 'material_name', headerName: '품목명', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'center' },
    { field: 'spec', headerName: '규격', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
    { field: 'maker', headerName: '제조사', flex: 2, minWidth: 200, headerAlign: 'center', align: 'center' },
    { field: 'remark', headerName: '비고', flex: 3, minWidth: 400, headerAlign: 'center', align: 'left' },
    { field: 'is_active', headerName: '사용여부', width: 100, headerAlign: 'center', align: 'center' },
    { field: 'edit', headerName: '수정', width: 100, headerAlign: 'center', align: 'center',
        renderCell: (params) => (
      <CustomBtn
        width="50px"
        text="수정"
        onClick={() => alert(params.row)}
      >
      </CustomBtn>
    ),
     },
    { field: 'del', headerName: '삭제', width: 100, headerAlign: 'center', align: 'center',
        renderCell: (params) => (
      <CustomBtn
        width="50px"
        text="삭제"
        backgroundColor='#fb1e1eff'
        onClick={() => alert(params.row)}
      >
      </CustomBtn>
    ),
     },
]

const rows = [
  { id: 1, idx: 1, company_name: '업체A', material_no: 'A001', material_name: '빨강도료', spec: '10Kg', remark: '비고1', is_active: 'Y' },
  { id: 2, idx: 2, company_name: '업체B', material_no: 'B002', material_name: '파랑도료', spec: '2L', remark: '비고2', is_active: 'N' },
  { id: 3, idx: 3, company_name: '업체1', material_no: 'C010', material_name: '초록도료', spec: '2통', remark: '비고3', is_active: 'Y' },
  { id: 4, idx: 4, company_name: '업체2', material_no: 'D100', material_name: '노랑도료', spec: '5Kg', remark: '비고4', is_active: 'N' },
];

function Company() {
    return (
        <Card
            sx={{ height: '98%', margin: '0.5%'}}
        >
            <Box>
                {/* Breadcrumbs 영역 */}
                <Breadcrumbs sx={{padding: 2}}>
                    <Typography sx={{ color: 'text.primary' }}>기준정보 관리</Typography>
                    <Typography sx={{ color: 'text.primary', fontWeight: 'bold' }}>원자재 관리</Typography>
                </Breadcrumbs>
                {/* Content 영역 */}
                <Box>
                    <Box
                        sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
                    >
                        <Typography sx={{ fontSize: '24px', fontWeight: 'bold', paddingLeft: 2 }}>원자재 정보</Typography>
                        <Box sx={{paddingRight: 2}}>
                            <CustomBtn 
                                text="등록"
                                backgroundColor='green'
                            />
                        </Box>
                    </Box>

                    <Box sx={{padding: 2}}>
                        <CommonTable 
                            columns={columns}
                            rows={rows}
                            // pageSize={10}
                            // check={true}
                            // height={630}
                        />
                    </Box>
                </Box>
            </Box>
        </Card>
    )
}

export default Company;