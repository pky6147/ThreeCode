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
import { productOutputApi } from '../../api/ProductOutputApi';

interface RowData {
    id: number;
    lot_no: string;
    company_name: string;
    product_no: string;
    product_name: string;
    category: string;
    paint_type: string;
    product_input_qty: number | string;
    product_input_date: string;
    product_output_qty: number | string;
    product_output_date: string;
}

function OutputReg() {

    // 더미 데이터 (추후 삭제)
    const [rows, setRows ] = useState<RowData[]>([
        { id: 1, lot_no: 'LOT-20251015-001', company_name: '업체A', product_no: 'P001', product_name: '스프링', category: '방산', paint_type: '액체', product_input_qty: 100, product_input_date: '20251015', product_output_qty: 0, product_output_date: '' },
        { id: 2, lot_no: 'LOT-20251015-002', company_name: '업체B', product_no: 'P002', product_name: '팬', category: '방산', paint_type: '액체', product_input_qty: 200, product_input_date: '20251015', product_output_qty: 0, product_output_date: '' },
        { id: 3, lot_no: 'LOT-20251015-003', company_name: '업체1', product_no: 'P010', product_name: 'Test1', category: '일반', paint_type: '분체', product_input_qty: 300, product_input_date: '20251015', product_output_qty: 0, product_output_date: '' },
        { id: 4, lot_no: 'LOT-20251015-004', company_name: '업체2', product_no: 'P100', product_name: 'Test2', category: '일반', paint_type: '분체', product_input_qty: 400, product_input_date: '20251015', product_output_qty: 0, product_output_date: '' },
    ]);

    // 테이블 셀 값 변경 핸들러 
    const handleChange = <K extends keyof RowData>(id: number, field: K, value: RowData[K]) => {
        setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
    };

    const handleOutput = async (row: RowData) => {
        if (!row.product_output_date || !row.product_output_qty) {
            alert('출고일자와 출고 수량을 모두 입력해주세요.');
            return;
        }

        try {
        // API 호출 결과를 res 변수에 저장
            const res = await productOutputApi.create({
                productInputId: row.id,
                productOutputQty: Number(row.product_output_qty),
                productOutputDate: dayjs(row.product_output_date).format('YYYY-MM-DD'),
            });

            if (res) {
                alert('출고 등록 완료!');
                // 등록 후 상태 업데이트 -> 등록된 출고 데이터도 관리하고 싶으면 여기서 rows 업데이트 가능
            }
        } catch (err) {
            console.error(err);
            alert('출고 등록 중 오류가 발생했습니다.');
        }
    };

    // 테이블 컬럼 설정 
    const columns: GridColDef[] = [
        { field: 'lot_no', headerName: 'Lot.No', width: 150, headerAlign: 'center', align: 'center' },
        { field: 'company_name', headerName: '거래처명', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'center' },
        { field: 'product_no', headerName: '품목번호', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
        { field: 'product_name', headerName: '품목명', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'center' },
        { field: 'category', headerName: '분류', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
        { field: 'paint_type', headerName: '도장방식', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
        { field: 'product_input_date', headerName: '입고일자', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center', renderCell: params => dayjs(params.value).format('YY.MM.DD') },
        { field: 'product_input_qty', headerName: '입고수량', flex: 1, minWidth: 100, headerAlign: 'center', align: 'right', renderCell: params => params.value?.toLocaleString() },
        { field: 'product_output_date', headerName: '출고일자', flex: 2, minWidth: 200, headerAlign: 'center', align: 'center',
            renderCell: params => (
                <DatePicker
                    format="YYYY-MM-DD"
                    value={params.row.product_output_date ? dayjs(params.row.product_output_date) : null}
                    onChange={newValue => handleChange(params.row.id, 'product_output_date', newValue?.format('YYYY-MM-DD') || '')}
                    slotProps={{ textField: { size: 'small', sx: { width: '100%' } } }}
                />
            )
        },
        { field: 'product_output_qty', headerName: '출고수량', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'right',
            renderCell: params => (
                <TextField
                    size="small"
                    value={params.row.product_output_qty?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || ''}
                    onChange={e => handleChange(params.row.id, 'product_output_qty', e.target.value.replace(/,/g, ''))}
                    sx={{ width: '100%' }}
                />
            )
        },
        { field: 'outputbtn', headerName: '출고', width: 100, headerAlign: 'center', align: 'center',
            renderCell: params => <CustomBtn width="50px" text="출고" onClick={() => handleOutput(params.row)} />
        }
    ];

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Card sx={{ height: '98%', margin: '0.5%' }}>
                <Box>
                    {/* Breadcrumbs 영역 */}
                    <CustomBC text="출고 등록" subText='수주대상 입출고 관리' />
                    {/* Content 영역 */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2 }}>
                        <Typography sx={{ fontSize: 24, fontWeight: 'bold' }}>수주대상품목 출고 등록</Typography>
                        <CustomBtn text="엑셀" backgroundColor="green" />
                    </Box>

                    <Box sx={{ padding: 2 }}>
                        <CommonTable columns={columns} rows={rows} />
                    </Box>
                </Box>
            </Card>
        </LocalizationProvider>
    )
}

export default OutputReg;