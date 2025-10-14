import { Box, Breadcrumbs, Typography, Card } from '@mui/material'
import CustomBtn from '../../component/CustomBtn';
import CommonTable from '../../component/CommonTable';
import type { GridColDef } from '@mui/x-data-grid'

const columns: GridColDef[] = [
    { field: 'idx', headerName: 'No', width: 70, headerAlign: 'center', align: 'center' },
    { field: 'company_name', headerName: '거래처명', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'center' },
    { field: 'product_no', headerName: '품목번호', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
    { field: 'product_name', headerName: '품목명', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'center',
        renderCell: (params) => (
        <Typography
            variant="body2"
            sx={{ 
                cursor: 'pointer', textDecoration: 'underline', color: 'blue', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                height: '100%', width: '100%'}}
            onClick={() => {
              alert('품목명 클릭')
              console.log('클릭한 행의 데이터?', params.row)
            }}
        >
          {params.value}
        </Typography>
      ),
     },
    { field: 'category', headerName: '분류', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
    { field: 'paint_type', headerName: '도장방식', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
    { field: 'price', headerName: '단가', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'right',
              renderCell: (params) => {
          const value = params.value;
          return value?.toLocaleString();  // 천단위 콤마
        }
     },
    { field: 'remark', headerName: '비고', flex: 3, minWidth: 300, headerAlign: 'center', align: 'left' },
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
  { id: 1, idx: 1, company_name: '업체A', product_no: 'P001', product_name: '스프링', category: '방산', paint_type: '액체', price: 5000, remark: '비고1', is_active: 'Y' },
  { id: 2, idx: 2, company_name: '업체B', product_no: 'P002', product_name: '팬', category: '방산', paint_type: '액체', price: 7000, remark: '비고2', is_active: 'N' },
  { id: 3, idx: 3, company_name: '업체1', product_no: 'P010', product_name: 'Test1', category: '일반', paint_type: '분체', price: 2500, remark: '비고3', is_active: 'Y' },
  { id: 4, idx: 4, company_name: '업체2', product_no: 'P100', product_name: 'Test2', category: '일반', paint_type: '분체', price: 1000, remark: '비고4', is_active: 'N' },
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
                    <Typography sx={{ color: 'text.primary', fontWeight: 'bold' }}>수주품목 관리</Typography>
                </Breadcrumbs>
                {/* Content 영역 */}
                <Box>
                    <Box
                        sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
                    >
                        <Typography sx={{ fontSize: '24px', fontWeight: 'bold', paddingLeft: 2 }}>수주품목 정보</Typography>
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