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
    material_no: string;
    material_name: string;
    spec: string;
    maker: string;
    material_input_qty: number | string;
    material_input_date: number | string;
    make_date: number | string;
}

function InputReg() {
    const [rows, setRows ] = useState<RowData[]>([
        { id: 1, idx: 1, company_name: '업체A', material_no: 'M001', material_name: 'A페인트', spec: 'Kg', maker: 'ㅁ제조사', material_input_qty: 0, material_input_date: '', make_date: '' },
        { id: 2, idx: 2, company_name: '업체B', material_no: 'M002', material_name: 'B신나', spec: 'L', maker: 'ㅁ제조사', material_input_qty: 0, material_input_date: '', make_date: '' },
        { id: 3, idx: 3, company_name: '업체1', material_no: 'M010', material_name: 'C세척제', spec: '통', maker: 'ㅇ제조사', material_input_qty: 0, material_input_date: '', make_date: '' },
        { id: 4, idx: 4, company_name: '업체2', material_no: 'M100', material_name: 'D경화제', spec: '통', maker: 'ㅇ제조사', material_input_qty: 0, material_input_date: '', make_date: '' },
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
        { field: 'company_name', headerName: '매입처명', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'center' },
        { field: 'material_no', headerName: '품목번호', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
        { field: 'material_name', headerName: '품목명', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'center' },
        { field: 'spec', headerName: '규격', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
        { field: 'maker', headerName: '제조사', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
        { field: 'material_input_qty', headerName: '입고수량', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'right',
            renderCell: (params) => (
                <TextField
                    type="text"
                    size="small"
                    value={params.row.material_input_qty?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || ''}
                    onChange={(e) => {
                        // 입력값에서 콤마 제거 후 숫자로 변환
                        const rawValue = e.target.value.replace(/,/g, '');
                        handleChange(params.row.id, 'material_input_qty', rawValue)
                    }}
                    sx={{ width: '100%', paddingTop: 0.7, display: 'flex' }}
                    InputProps={{ sx: { '& input': { textAlign: 'right' } } }}
                />
            )
         },
        { field: 'material_input_date', headerName: '입고일자', flex: 2, minWidth: 200, headerAlign: 'center', align: 'center',
            renderCell: (params) => (
                <DatePicker
                  format="YYYY-MM-DD"
                  value={params.row.material_input_date ? dayjs(params.row.material_input_date) : null}
                  onChange={(newValue) =>
                    handleChange(
                      params.row.id,
                      'material_input_date',
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
        { field: 'make_date', headerName: '제조일자', flex: 2, minWidth: 200, headerAlign: 'center', align: 'center',
            renderCell: (params) => (
                <DatePicker
                  format="YYYY-MM-DD"
                  value={params.row.make_date ? dayjs(params.row.make_date) : null}
                  onChange={(newValue) =>
                    handleChange(
                      params.row.id,
                      'make_date',
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
        { field: 'inputbtn', headerName: '등록', width: 100, headerAlign: 'center', align: 'center',
            renderCell: (params) => (
                <CustomBtn
                  width="50px"
                  text="등록"
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