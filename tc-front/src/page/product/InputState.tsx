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
    remark: string;
    product_input_qty: number | string;
    product_input_date: number | string;
    isEditing? : boolean;
}

function InputState() {
    const [rows, setRows ] = useState<RowData[]>([
        { id: 1, lot_no: 'LOT-20251015-001', company_name: '업체A', product_no: 'P001', product_name: '스프링', category: '방산', paint_type: '액체', remark: '비고1', product_input_qty: 0, product_input_date: '' },
        { id: 2, lot_no: 'LOT-20251015-002', company_name: '업체B', product_no: 'P002', product_name: '팬', category: '방산', paint_type: '액체', remark: '비고2', product_input_qty: 0, product_input_date: '' },
        { id: 3, lot_no: 'LOT-20251015-003', company_name: '업체1', product_no: 'P010', product_name: 'Test1', category: '일반', paint_type: '분체', remark: '비고3', product_input_qty: 0, product_input_date: '' },
        { id: 4, lot_no: 'LOT-20251015-004', company_name: '업체2', product_no: 'P100', product_name: 'Test2', category: '일반', paint_type: '분체', remark: '비고4', product_input_qty: 0, product_input_date: '' },
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
                ['product_input_qty']: temp.product_input_qty,
                ['product_input_date']: temp.product_input_date,
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
    // Lot번호 클릭, 공정진행화면을 팝업해야함
    const handleRunningPage = (row: RowData) => {
        console.log('공정진행화면을 켤 행의 data', row)
    }

    const columns: GridColDef[] = [
        { field: 'lot_no', headerName: 'Lot.No', width: 150, headerAlign: 'center', align: 'center',
            renderCell: (params) => (
                <Typography
                    variant="body2"
                    sx={{ 
                        cursor: 'pointer', textDecoration: 'underline', color: 'blue', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        height: '100%', width: '100%'}}
                    onClick={() => handleRunningPage(params.row)}
                >
                  {params.value}
                </Typography>
            ),
        },
        { field: 'company_name', headerName: '거래처명', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'center' },
        { field: 'product_no', headerName: '품목번호', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
        { field: 'product_name', headerName: '품목명', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'center' },
        { field: 'category', headerName: '분류', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
        { field: 'paint_type', headerName: '도장방식', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
        { field: 'remark', headerName: '비고', flex: 2.5, minWidth: 250, headerAlign: 'center', align: 'left' },
        { field: 'product_input_qty', headerName: '입고수량', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'right',
            renderCell: (params) => {
                if(params.row.isEditing) {
                    return (
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
                } else {
                    return params.value?.toLocaleString();
                }
            }
         },
        { field: 'product_input_date', headerName: '입고일자', flex: 2, minWidth: 200, headerAlign: 'center', align: 'center',
            renderCell: (params) => {
                if(params.row.isEditing) {
                    return (
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
            renderCell: (params) => {
                return (
                    <CustomBtn
                        width="50px"
                        text="삭제"
                        backgroundColor='red'
                        onClick={() => handleDelete(params.row)}
                    />
                )
            }
        },
        { field: 'guide', headerName: '작업지시서', width: 110, headerAlign: 'center', align: 'center',
            renderCell: (params) => {
                return (
                    <CustomBtn
                        width="85px"
                        text="작업지시서"
                        backgroundColor='green'
                        onClick={() => handleGuide(params.row)}
                    />
                )
            }
        }
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
                        <Typography sx={{ color: 'text.primary', fontWeight: 'bold' }}>입고 현황</Typography>
                    </Breadcrumbs>
                    {/* Content 영역 */}
                    <Box>
                        <Box
                            sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
                        >
                            <Typography sx={{ fontSize: '24px', fontWeight: 'bold', paddingLeft: 2 }}>수주대상품목 입고 현황</Typography>
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

export default InputState;