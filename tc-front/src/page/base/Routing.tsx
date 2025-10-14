import { Box, Breadcrumbs, Typography, Card } from '@mui/material'
import CustomBtn from '../../component/CustomBtn';
import CommonTable from '../../component/CommonTable';
import type { GridColDef } from '@mui/x-data-grid'

const columns: GridColDef[] = [
    { field: 'idx', headerName: 'No', width: 70, headerAlign: 'center', align: 'center' },
    { field: 'process_code', headerName: '공정코드', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
    { field: 'process_name', headerName: '공정명', flex: 1.5, minWidth: 200, headerAlign: 'center', align: 'center' },
    { field: 'process_time', headerName: '공정시간(h)', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
    { field: 'remark', headerName: '비고', flex: 3, minWidth: 500, headerAlign: 'center', align: 'center' },
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
  { id: 1, idx: 1, process_code: 'LC01', process_name: '수입검사', process_time: 3, remark: '찍힘 확인' },
  { id: 2, idx: 2, process_code: 'LC02', process_name: '액체도장', process_time: 4 },
  { id: 3, idx: 3, process_code: 'LC03', process_name: '포장', process_time: 4.5 },
  { id: 4, idx: 3, process_code: 'LC03', process_name: '포장', process_time: 4.5 },
  { id: 5, idx: 3, process_code: 'LC03', process_name: '포장', process_time: 4.5 },
  { id: 6, idx: 3, process_code: 'LC03', process_name: '포장', process_time: 4.5 },
  { id: 7, idx: 3, process_code: 'LC03', process_name: '포장', process_time: 4.5 },
  { id: 8, idx: 3, process_code: 'LC03', process_name: '포장', process_time: 4.5 },
  { id: 9, idx: 3, process_code: 'LC03', process_name: '포장', process_time: 4.5 },
  { id: 10, idx: 3, process_code: 'LC03', process_name: '포장', process_time: 4.5 },
];

function Routing() {
    return (
        <Card
            sx={{ height: '98%', margin: '0.5%'}}
        >
            <Box>
                {/* Breadcrumbs 영역 */}
                <Breadcrumbs sx={{padding: 2}}>
                    <Typography sx={{ color: 'text.primary' }}>기준정보 관리</Typography>
                    <Typography sx={{ color: 'text.primary', fontWeight: 'bold' }}>라우팅 관리</Typography>
                </Breadcrumbs>
                {/* Content 영역 */}
                <Box>
                    <Box
                        sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
                    >
                        <Typography sx={{ fontSize: '24px', fontWeight: 'bold', paddingLeft: 2 }}>라우팅 정보</Typography>
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

export default Routing;