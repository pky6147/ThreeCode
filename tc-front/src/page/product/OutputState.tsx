import { useState } from 'react'
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
    product_output_no: string;
    company_name: string;
    product_no: string;
    product_name: string;
    category: string;
    paint_type: string;
    product_output_qty: number | string;
    product_output_date: number | string;
    isEditing? : boolean;
}

function OutputState() {
    const [rows, setRows ] = useState<RowData[]>([
        { id: 1, product_output_no: 'OUT-20251015-001', company_name: '업체A', product_no: 'P001', product_name: '스프링', category: '방산', paint_type: '액체', product_output_qty: 100, product_output_date: '20251015' },
        { id: 2, product_output_no: 'OUT-20251015-002', company_name: '업체B', product_no: 'P002', product_name: '팬', category: '방산', paint_type: '액체', product_output_qty: 200, product_output_date: '20251016' },
        { id: 3, product_output_no: 'OUT-20251015-003', company_name: '업체1', product_no: 'P010', product_name: 'Test1', category: '일반', paint_type: '분체', product_output_qty: 300, product_output_date: '20251017' },
        { id: 4, product_output_no: 'OUT-20251015-004', company_name: '업체2', product_no: 'P100', product_name: 'Test2', category: '일반', paint_type: '분체', product_output_qty: 400, product_output_date: '20251018' },
    ])

    const [temp, setTemp] = useState<RowData>(rows[0])

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

    // 수정버튼 클릭
    const handleEdit = (row: RowData, edit: boolean) => {
        setTemp(row)
        setRows(prev => prev.map(r => r.id === row.id ? { ...r, isEditing: edit } : r));
    }
    // 저장 버튼 클릭
    const handleSave = (row: RowData) => {
        console.log('저장할 row값', row)
    };
    // 취소 버튼 클릭
    const handleCancel = (row: RowData) => {
      setRows(prev =>
        prev.map(r =>
          r.id === row.id
            ? { ...r, 
                isEditing: false, 
                ['product_output_qty']: temp.product_output_qty,
                ['product_output_date']: temp.product_output_date,
            }
            : r
        )
      );
    }
    // 삭제 버튼 클릭
    const handleDelete = (row: RowData) => {
        console.log('삭제할 rowr값', row)
    }
    // 작업지시서 버튼 클릭
    const handleGuide = (row: RowData) => {
        console.log('작업지시서를 켤 행의 data', row)
    }

    const columns: GridColDef[] = [
        { field: 'product_output_no', headerName: '출고번호', width: 150, headerAlign: 'center', align: 'center' },
        { field: 'company_name', headerName: '거래처명', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'center' },
        { field: 'product_no', headerName: '품목번호', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
        { field: 'product_name', headerName: '품목명', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'center' },
        { field: 'category', headerName: '분류', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
        { field: 'paint_type', headerName: '도장방식', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
        { field: 'product_output_qty', headerName: '출고수량', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'right',
            renderCell: (params) => {
                if(params.row.isEditing) {
                    return (
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
                } else {
                    return params.value?.toLocaleString();
                }
            }
         },
        { field: 'product_output_date', headerName: '출고일자', flex: 2, minWidth: 200, headerAlign: 'center', align: 'center',
            renderCell: (params) => {
                if(params.row.isEditing) {
                    return (
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
                    )
                } else {
                    if (!params.value) return ''; // 값 없으면 빈 문자열
                    return dayjs(params.value).format('YY.MM.DD'); 
                }
            }
        },
        { field: 'edit', headerName: '수정', width: 150, headerAlign: 'center', align: 'center',
            renderCell: (params) => {
                if(params.row.isEditing) {
                    return (
                        <Box sx={{display: 'flex', gap: 0.5, justifyContent: 'center', paddingTop: 1.3}}>
                            <CustomBtn
                                backgroundColor='green'
                                text="저장"
                                onClick={() => handleSave(params.row)}
                            />
                            <CustomBtn
                                backgroundColor='red'
                                text="취소"
                                onClick={() => handleCancel(params.row)}
                            />
                        </Box>
                    
                    );
                } else {
                    return (
                        <CustomBtn
                            width="50px"
                            text="수정"
                            onClick={() => handleEdit(params.row, true)}
                        />
                    )
                }
            }
        },
        { field: 'del', headerName: '삭제', width: 90, headerAlign: 'center', align: 'center',
            renderCell: (params) => (
                <CustomBtn
                    width="50px"
                    text="삭제"
                    backgroundColor='red'
                    onClick={() => handleDelete(params.row)}
                />

            )
        },
        { field: 'guide', headerName: '출하증', width: 110, headerAlign: 'center', align: 'center',
            renderCell: (params) => (
                <CustomBtn
                    width="90px"
                    text="출하증"
                    backgroundColor='green'
                    onClick={() => handleGuide(params.row)}
                />

            )
        }
    ]
        

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Card
                sx={{ height: '98%', margin: '0.5%'}}
            >
                <Box>
                    {/* Breadcrumbs 영역 */}
                    <CustomBC text="출고 현황" subText='수주대상 입출고 관리' />
                    {/* Content 영역 */}
                    <Box>
                        <Box
                            sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
                        >
                            <Typography sx={{ fontSize: '24px', fontWeight: 'bold', paddingLeft: 2 }}>수주대상품목 출고 현황</Typography>
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

export default OutputState;