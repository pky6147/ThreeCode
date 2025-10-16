import { useEffect, useState } from 'react';
import { Box, Breadcrumbs, Typography, Card, TextField } from '@mui/material';
import CustomBtn from '../../component/CustomBtn';
import CommonTable from '../../component/CommonTable';
import type { GridColDef } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import '../../OutputState.css';
import { productOutputApi } from '../../api/ProductApi';

// 프론트용 Dto
interface OutputData {
    id: number; 
    productOutputId: number; 
    product_output_no: string;
    company_name: string; 
    product_no: string; 
    product_name: string; 
    category: string; 
    paint_type: string; 
    product_output_qty: number | string;
    product_output_date: string;
    isEditing?: boolean;
}

// 백엔드 응답 타입
interface BackendOutput {
    productOutputId: number;
    productOutputNo: string;
    productOutputQty: number;
    productOutputDate: string; 
    companyName: string; 
    productNo: string;
    productName: string;
    category: string;
    paintType: string;
}


function OutputState() {
    // 1. 더미 데이터 제거 및 빈 배열로 초기화
    const [rows, setRows] = useState<OutputData[]>([]);
    const [temp, setTemp] = useState<OutputData | null>(null);

    // API 호출 후 데이터 가져오기
    const fetchData = async () => {
    try {
        const res = await productOutputApi.getAll(); // GET /product-output 호출
        
        if (res.data && res.data.length > 0) {
            const mappedData: OutputData[] = res.data
    .filter((item: BackendOutput) => item)
    .map((item: BackendOutput, index: number) => ({
        id: item.productOutputId ?? index + 1, // productOutputId 없으면 index 사용
        productOutputId: item.productOutputId,
        product_output_no: item.productOutputNo || '-',
        company_name: item.companyName || '-',
        product_no: item.productNo || '-',
        product_name: item.productName || '-',
        category: item.category || '-',
        paint_type: item.paintType || '-',
        product_output_qty: item.productOutputQty ?? 0,
        product_output_date: item.productOutputDate || '-',
        isEditing: false,
    }));

            setRows(mappedData);
        } else {
            setRows([]);
        }
    } catch (err) {
        console.error(err);
        alert('출고 목록을 불러오는 중 오류가 발생했습니다.');
    }
};



    useEffect(() => {
        fetchData();
    }, []);
    
    // ... (handleChange 함수는 DataGrid ID로 필터링하므로 유지)

    const handleChange = <K extends keyof OutputData>(id: number, field: K, value: OutputData[K]) => {
        setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
    };


    const handleEdit = (row: OutputData, edit: boolean) => {
        setTemp({ ...row });
        setRows(prev => prev.map(r => r.id === row.id ? { ...r, isEditing: edit } : r));
    };

    const handleSave = async (row: OutputData) => {
        // 유효성 검사 (수량 및 일자 입력 확인)
        if (!row.product_output_date || !row.product_output_qty) {
            alert('출고일자와 출고 수량을 모두 입력해주세요.');
            return;
        }
        try {
            await productOutputApi.update(row.productOutputId, {
                productOutputQty: Number(row.product_output_qty),
                productOutputDate: row.product_output_date
            });
            alert('수정 완료되었습니다.');
            handleEdit(row, false);
            fetchData();
        } catch (err) {
            console.error(err);
            alert('수정 중 오류가 발생했습니다.');
        }
    };


    const handleCancel = (row: OutputData) => {
        if (!temp) return;
        setRows(prev =>
            prev.map(r =>
                r.id === row.id
                    ? { 
                        ...r, 
                        isEditing: false, 
                        product_output_qty: temp.product_output_qty, 
                        product_output_date: temp.product_output_date 
                      }
                    : r
            )
        );
    };

     const handleDelete = async (row: OutputData) => {
        if (!window.confirm(`출고번호 ${row.product_output_no} 정보를 정말 삭제하시겠습니까?`)) return;
        try {
            await productOutputApi.remove(row.productOutputId); 
            alert('삭제 완료되었습니다.');
            fetchData();
        } catch (err) {
            console.error(err);
            alert('삭제 중 오류가 발생했습니다.');
        }
    };
    
    const handleGuide = (row: OutputData) => {
        console.log(`출하증 출력: ${row.product_output_no}`);
    };


    // ... (columns 정의는 필드명을 OutputData에 맞게 사용하여 그대로 유지)
    const columns: GridColDef[] = [
        { field: 'product_output_no', headerName: '출고번호', width: 150, headerAlign: 'center', align: 'center' },
        { field: 'company_name', headerName: '거래처명', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'center' },
        { field: 'product_no', headerName: '품목번호', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
        { field: 'product_name', headerName: '품목명', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'center' },
        { field: 'category', headerName: '분류', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
        { field: 'paint_type', headerName: '도장방식', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
        { field: 'product_output_qty', headerName: '출고수량', flex: 1.5, minWidth: 150, headerAlign: 'right', align: 'right', renderCell: (params) => {
            if (params.row.isEditing) {
                return (
                    <TextField size="small" value={params.row.product_output_qty?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || ''}
                        onChange={e => handleChange(params.row.id, 'product_output_qty', e.target.value.replace(/,/g, ''))}
                    />
                )
            } else return params.value?.toLocaleString();
        }},
        { field: 'product_output_date', headerName: '출고일자', flex: 2, minWidth: 200, headerAlign: 'center', align: 'center', renderCell: (params) => {
            if (params.row.isEditing) {
                return (
                    <DatePicker
                        format="YYYY-MM-DD"
                        value={params.row.product_output_date ? dayjs(params.row.product_output_date) : null}
                        onChange={(newValue) => handleChange(params.row.id, 'product_output_date', newValue?.format('YYYY-MM-DD') || '')}
                        slotProps={{ textField: { size: 'small', sx: { width: '100%' } } }}
                    />
                )
            } else return dayjs(params.value).format('YY.MM.DD');
        }},
        { field: 'edit', headerName: '수정', width: 150, headerAlign: 'center', align: 'center', renderCell: (params) => {
            if (params.row.isEditing) {
                return (
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                        <CustomBtn text="저장" backgroundColor="green" onClick={() => handleSave(params.row)} />
                        <CustomBtn text="취소" backgroundColor="red" onClick={() => handleCancel(params.row)} />
                    </Box>
                )
            } else {
                return <CustomBtn text="수정" width="50px" onClick={() => handleEdit(params.row, true)} />
            }
        }},
        { field: 'del', headerName: '삭제', width: 90, headerAlign: 'center', align: 'center', renderCell: (params) =>
            <CustomBtn text="삭제" width="50px" backgroundColor="red" onClick={() => handleDelete(params.row)} />
        },
        { field: 'guide', headerName: '출하증', width: 110, headerAlign: 'center', align: 'center', renderCell: (params) =>
            <CustomBtn text="출하증" width="90px" backgroundColor="green" onClick={() => handleGuide(params.row)} />
        }
    ];

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Card className="outputCard">
                <Breadcrumbs className="outputBreadcrumb">
                    <Typography>수주대상 입출고 관리</Typography>
                    <Typography style={{ fontWeight: 'bold' }}>출고 현황</Typography>
                </Breadcrumbs>

                <Box className="outputHeader">
                    <Typography className="outputTitle">수주대상품목 출고 현황</Typography>
                    <Box className="outputExcelBtn">
                        <CustomBtn text="엑셀" backgroundColor="green" />
                    </Box>
                </Box>

                <Box style={{ padding: 16 }}>
                    <CommonTable columns={columns} rows={rows} />
                </Box>
            </Card>
        </LocalizationProvider>
    )
}

export default OutputState;