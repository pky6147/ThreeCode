import { useState } from 'react'
import { Box, Breadcrumbs, Typography, Card, TextField } from '@mui/material'
import CustomBtn from '../../component/CustomBtn';
import CommonTable from '../../component/CommonTable';
import type { GridColDef } from '@mui/x-data-grid'
import dayjs from 'dayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

interface RowData {
    id: number;
    idx: number;
    company_name: string;
    product_no: string;
    product_name: string;
    category: string;
    paint_type: string;
    remark: string;
    product_input_qty: number | string;
    product_input_date: number | string;
}

// const rows = [
//   { id: 1, idx: 1, company_name: '업체A', product_no: 'P001', product_name: '스프링', category: '방산', paint_type: '액체', remark: '비고1', product_input_qty: 0, product_input_date: '' },
//   { id: 2, idx: 2, company_name: '업체B', product_no: 'P002', product_name: '팬', category: '방산', paint_type: '액체', remark: '비고2', product_input_qty: 0, product_input_date: '' },
//   { id: 3, idx: 3, company_name: '업체1', product_no: 'P010', product_name: 'Test1', category: '일반', paint_type: '분체', remark: '비고3', product_input_qty: 0, product_input_date: '' },
//   { id: 4, idx: 4, company_name: '업체2', product_no: 'P100', product_name: 'Test2', category: '일반', paint_type: '분체', remark: '비고4', product_input_qty: 0, product_input_date: '' },
// ];

function InputReg() {
    const [rows, setRows ] = useState<RowData[]>([
        { id: 1, idx: 1, company_name: '업체A', product_no: 'P001', product_name: '스프링', category: '방산', paint_type: '액체', remark: '비고1', product_input_qty: 0, product_input_date: '' },
        { id: 2, idx: 2, company_name: '업체B', product_no: 'P002', product_name: '팬', category: '방산', paint_type: '액체', remark: '비고2', product_input_qty: 0, product_input_date: '' },
        { id: 3, idx: 3, company_name: '업체1', product_no: 'P010', product_name: 'Test1', category: '일반', paint_type: '분체', remark: '비고3', product_input_qty: 0, product_input_date: '' },
        { id: 4, idx: 4, company_name: '업체2', product_no: 'P100', product_name: 'Test2', category: '일반', paint_type: '분체', remark: '비고4', product_input_qty: 0, product_input_date: '' },
    ])

    const handleChange = <K extends keyof RowData> (
        id: number,
        field: K,
        value: RowData[K]
    ) => {
        setRows((prev) => 
            prev.map((row) =>
                row.id === id ? { ...row, [field]: value } : row
            )
        )
    }

    const handleInput = (row: RowData) => {
        console.log('row값', row)
    }

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
        { field: 'remark', headerName: '비고', flex: 3, minWidth: 300, headerAlign: 'center', align: 'left' },
        { field: 'product_input_qty', headerName: '입고수량', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'right',
            renderCell: (params) => (
                <TextField
                    type="text"
                    size="small"
                    value={params.row.product_input_qty?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || ''}
                    onChange={(e) => {
                        // 입력값에서 콤마 제거 후 숫자로 변환
                        const rawValue = e.target.value.replace(/,/g, '');
                        handleChange(params.row.id, 'product_input_qty', rawValue)
                    }}
                    sx={{ width: '100%', paddingTop: 0.7, display: 'flex' }}
                    InputProps={{ sx: { '& input': { textAlign: 'right' } } }}
                />
            )
         },
        { field: 'product_input_date', headerName: '입고일자', flex: 2, minWidth: 200, headerAlign: 'center', align: 'center',
            renderCell: (params) => (
                <DatePicker
                  format="YYYY-MM-DD"
                  value={params.row.product_input_date ? dayjs(params.row.product_input_date) : null}
                  onChange={(newValue) =>
                    handleChange(
                      params.row.id,
                      'product_input_date',
                      newValue?.format('YYYY-MM-DD') || ''
                    )
                  }
                  slotProps={{
                    textField: {
                      size: 'small',
                      sx: { width: '100%', paddingTop: 0.7 },
                    },
                  }}
                />
            ),
        },
        { field: 'inputbtn', headerName: '입고', width: 100, headerAlign: 'center', align: 'center',
            renderCell: (params) => (
                <CustomBtn
                  width="50px"
                  text="입고"
                  onClick={() => handleInput(params.row)}
                >
                </CustomBtn>
            ),
        },
    ]
        

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Card
                sx={{ height: '98%', margin: '0.5%'}}
            >
                <Box>
                    {/* Breadcrumbs 영역 */}
                    <Breadcrumbs sx={{padding: 2}}>
                        <Typography sx={{ color: 'text.primary' }}>수주대상 입출고 관리</Typography>
                        <Typography sx={{ color: 'text.primary', fontWeight: 'bold' }}>입고 등록</Typography>
                    </Breadcrumbs>
                    {/* Content 영역 */}
                    <Box>
                        <Box
                            sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
                        >
                            <Typography sx={{ fontSize: '24px', fontWeight: 'bold', paddingLeft: 2 }}>수주대상품목 입고 등록</Typography>
                            <Box sx={{paddingRight: 2}}>
                                <CustomBtn 
                                    text="엑셀"
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
        </LocalizationProvider>
    )
}

export default InputReg;