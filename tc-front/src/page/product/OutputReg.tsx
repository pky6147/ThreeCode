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
    lot_no: string;
    company_name: string;
    product_no: string;
    product_name: string;
    category: string;
    paint_type: string;
    product_input_qty: number | string;
    product_input_date: number | string;
    product_output_qty: number | string;
    product_output_date: number | string;
}

function OutputReg() {
    const [rows, setRows ] = useState<RowData[]>([
        { id: 1, lot_no: 'LOT-20251015-001', company_name: '업체A', product_no: 'P001', product_name: '스프링', category: '방산', paint_type: '액체', product_input_qty: 100, product_input_date: '20251015', product_output_qty: 0, product_output_date: '' },
        { id: 2, lot_no: 'LOT-20251015-002', company_name: '업체B', product_no: 'P002', product_name: '팬', category: '방산', paint_type: '액체', product_input_qty: 200, product_input_date: '20251015', product_output_qty: 0, product_output_date: '' },
        { id: 3, lot_no: 'LOT-20251015-003', company_name: '업체1', product_no: 'P010', product_name: 'Test1', category: '일반', paint_type: '분체', product_input_qty: 300, product_input_date: '20251015', product_output_qty: 0, product_output_date: '' },
        { id: 4, lot_no: 'LOT-20251015-004', company_name: '업체2', product_no: 'P100', product_name: 'Test2', category: '일반', paint_type: '분체', product_input_qty: 400, product_input_date: '20251015', product_output_qty: 0, product_output_date: '' },
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

    const handleOutput = (row: RowData) => {
        console.log('row값', row)
    }

    const columns: GridColDef[] = [
        { field: 'lot_no', headerName: 'Lot.No', width: 150, headerAlign: 'center', align: 'center' },
        { field: 'company_name', headerName: '거래처명', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'center' },
        { field: 'product_no', headerName: '품목번호', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
        { field: 'product_name', headerName: '품목명', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'center' },
        { field: 'category', headerName: '분류', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
        { field: 'paint_type', headerName: '도장방식', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
        { field: 'product_input_date', headerName: '입고일자', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center',
            renderCell: (params) => {
                if (!params.value) return ''; // 값 없으면 빈 문자열
                return dayjs(params.value).format('YY.MM.DD'); 
            }
         },
        { field: 'product_input_qty', headerName: '입고수량', flex: 1, minWidth: 100, headerAlign: 'center', align: 'right',
            renderCell: (params) => {
                const value = params.value;
                return value?.toLocaleString();  // 천단위 콤마
            }
        },
        { field: 'product_output_date', headerName: '출고일자', flex: 2, minWidth: 200, headerAlign: 'center', align: 'center',
            renderCell: (params) => (
                <DatePicker
                  format="YYYY-MM-DD"
                  value={params.row.product_output_date ? dayjs(params.row.product_output_date) : null}
                  onChange={(newValue) =>
                    handleChange(
                      params.row.id,
                      'product_output_date',
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
        { field: 'product_output_qty', headerName: '출고수량', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'right',
            renderCell: (params) => (
                <TextField
                    type="text"
                    size="small"
                    value={params.row.product_output_qty?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || ''}
                    onChange={(e) => {
                        // 입력값에서 콤마 제거 후 숫자로 변환
                        const rawValue = e.target.value.replace(/,/g, '');
                        handleChange(params.row.id, 'product_output_qty', rawValue)
                    }}
                    sx={{ width: '100%', paddingTop: 0.7, display: 'flex' }}
                    InputProps={{ sx: { '& input': { textAlign: 'right' } } }}
                />
            )
        },
        { field: 'outputbtn', headerName: '출고', width: 100, headerAlign: 'center', align: 'center',
            renderCell: (params) => (
                <CustomBtn
                  width="50px"
                  text="출고"
                  onClick={() => handleOutput(params.row)}
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
                        <Typography sx={{ color: 'text.primary', fontWeight: 'bold' }}>출고 등록</Typography>
                    </Breadcrumbs>
                    {/* Content 영역 */}
                    <Box>
                        <Box
                            sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
                        >
                            <Typography sx={{ fontSize: '24px', fontWeight: 'bold', paddingLeft: 2 }}>수주대상품목 출고 등록</Typography>
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

export default OutputReg;