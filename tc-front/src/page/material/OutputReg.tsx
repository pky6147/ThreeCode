import { useState, useEffect } from 'react'
import { Box, Typography, Card, TextField } from '@mui/material'
import CustomBC from '../../component/CustomBC';
import CustomBtn from '../../component/CustomBtn';
import CommonTable from '../../component/CommonTable';
import type { GridColDef } from '@mui/x-data-grid'
import dayjs from 'dayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

interface RowData {
    id: number;
    material_input_no: string;
    company_name: string;
    material_no: string;
    material_name: string;
    maker: string;
    // material_input_qty: number | string;
    // material_input_date: number | string;
    stock_qty?: number | string;
    material_output_qty?: number | string;
    material_output_date?: number | string;
}

function OutputReg() {
    const [rows, setRows ] = useState<RowData[]>([])

    useEffect(()=> {
            const baseRow = [
                { id: 1, material_input_no: 'MINC-20251015-001', company_name: '업체A', material_no: 'P001', material_name: '원자재1', maker: '제조사A' },
                { id: 2, material_input_no: 'MINC-20251015-002', company_name: '업체B', material_no: 'P002', material_name: '원자재2', maker: '제조사B' },
                { id: 3, material_input_no: 'MINC-20251015-003', company_name: '업체1', material_no: 'P010', material_name: '원자재3', maker: '제조사C' },
                { id: 4, material_input_no: 'MINC-20251015-004', company_name: '업체2', material_no: 'P100', material_name: '원자재4', maker: '제조사D' },
            ]
    
            const result = baseRow.map(r => ({
                ...r, 
                stock_qty: 500 // DB에서 계산해서 갖고올것
            }))
            setRows(result)
    
    }, [])

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
        { field: 'material_input_no', headerName: '입고번호', width: 150, headerAlign: 'center', align: 'center' },
        { field: 'company_name', headerName: '매입처명', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'center' },
        { field: 'material_no', headerName: '품목번호', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
        { field: 'material_name', headerName: '품목명', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'center' },
        { field: 'maker', headerName: '제조사', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
        { field: 'stock_qty', headerName: '재고량', flex: 1, minWidth: 100, headerAlign: 'center', align: 'right',
            renderCell: (params) => {
                const value = params.value;
                return value?.toLocaleString();  // 천단위 콤마
            }
        },
        { field: 'material_output_qty', headerName: '출고수량', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'right',
            renderCell: (params) => (
                <TextField
                    type="text"
                    size="small"
                    value={params.row.material_output_qty?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || ''}
                    onChange={(e) => {
                        // 입력값에서 콤마 제거 후 숫자로 변환
                        const rawValue = e.target.value.replace(/,/g, '');
                        handleChange(params.row.id, 'material_output_qty', rawValue)
                    }}
                    sx={{ width: '100%', paddingTop: 0.7, display: 'flex' }}
                    InputProps={{ sx: { '& input': { textAlign: 'right' } } }}
                />
            )
        },
        { field: 'material_output_date', headerName: '출고일자', flex: 2, minWidth: 200, headerAlign: 'center', align: 'center',
            renderCell: (params) => (
                <DatePicker
                  format="YYYY-MM-DD"
                  value={params.row.material_output_date ? dayjs(params.row.material_output_date) : null}
                  onChange={(newValue) =>
                    handleChange(
                      params.row.id,
                      'material_output_date',
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
                    <CustomBC text="출고 등록" subText='원자재 입출고 관리' />
                    {/* Content 영역 */}
                    <Box>
                        <Box
                            sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
                        >
                            <Typography sx={{ fontSize: '24px', fontWeight: 'bold', paddingLeft: 2 }}>원자재 품목 출고 등록</Typography>
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