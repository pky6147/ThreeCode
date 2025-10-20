import { useState, useEffect } from 'react'
import { Box, Typography, Card, TextField, Dialog } from '@mui/material'
import CustomBC from '../../component/CustomBC';
import CustomBtn from '../../component/CustomBtn';
import CommonTable from '../../component/CommonTable';
import type { GridColDef } from '@mui/x-data-grid'
import dayjs from 'dayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { productOutputApi } from '../../api/ProductOutputApi';
import ExcelBtn from '../../component/ExcelBtn';
import SearchBar from '../../component/SearchBar';
import LabelInput from '../../component/LabelInput';
import LabelDatepicker from '../../component/LabelDatepicker';
import AlertPopup, { type AlertProps}  from '../../component/AlertPopup';
import type { AxiosError } from 'axios';

interface RowData {
    id?: number;
    productInputId: number;
    lotNo: string;
    companyName: string;
    productNo: string;
    productName: string;
    category: string;
    paintType: string;
    productInputQty: number;
    productInputDate: string;
    productOutputQty?: number;
    productOutputDate?: string;
}

function OutputReg() {
    const [rows, setRows ] = useState<RowData[]>([]);
    /* Search */
    const [searchInfo, setSearchInfo] = useState({
            companyName: '',
            productNo: '',
            productName: '',
            lotNo: '',
            productInputDate: ''
        })
    const [searchRows, setSearchRows] = useState<RowData[]>([])
    const [isSearch, setIsSearch] = useState(false)
    /* Alert */
    const [alertOpen, setAlertOpen] = useState(false)
    const [alertInfo, setAlertInfo] = useState<AlertProps>({})

    const getTableData = async () => {
        try {
            // productInput 에서 모든 라우팅의 진행이 완료되고 출고기록이 없는 데이터만 가져오기
            const dummy = [
                { productInputId: 1, lotNo: 'LOT-20251015-001', companyName: '업체A', productNo: 'P001', productName: '스프링', category: '방산', paintType: '액체', productInputQty: 100, productInputDate: '20251015' },
                { productInputId: 2, lotNo: 'LOT-20251015-002', companyName: '업체B', productNo: 'P002', productName: '팬', category: '방산', paintType: '액체', productInputQty: 200, productInputDate: '20251015' },
                { productInputId: 3, lotNo: 'LOT-20251015-003', companyName: '업체1', productNo: 'P010', productName: 'Test1', category: '일반', paintType: '분체', productInputQty: 300, productInputDate: '20251015' },
                { productInputId: 4, lotNo: 'LOT-20251015-004', companyName: '업체2', productNo: 'P100', productName: 'Test2', category: '일반', paintType: '분체', productInputQty: 400, productInputDate: '20251015' },
            ]

            const result = dummy
            .map((row:RowData) => ({
                ...row,
                id: row.productInputId,
                productOutputQty: 0,
                productOutputDate: '',
            }))

            setRows(result)
        }
        catch(err) {
            console.error(err)
            alert("조회 실패!")
        }
    };
    useEffect(()=> {
            getTableData();
    }, [])

    const BoardRefresh = () => {
        getTableData();
    }

    // 테이블 셀 값 변경 핸들러 
    const handleChange = <K extends keyof RowData>(id: number, field: K, value: RowData[K]) => {
        setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
    };

    // 출고
    const handleOutput = async (row: RowData) => {
        if (!row.productOutputDate || !row.productOutputQty) {
            alert('출고일자와 출고 수량을 모두 입력해주세요.');
            return;
        }

        try {
            // await createProductOutput({
            //     productInputId: Number(row.id),
            //     productOutputQty: Number(row.productOutputQty),
            //     productOutputDate: dayjs(row.productOutputDate).format('YYYY-MM-DD'),
            // })
            handleAlertSuccess()
            BoardRefresh()
        } catch(err) {
            const axiosError = err as AxiosError;
            console.error(err)
            if (axiosError.response && axiosError.response.data) {
                handleAlertFail()
            } else {
                handleAlertFail()
            }
        }

        try {
        // API 호출 결과를 res 변수에 저장
            const res = await productOutputApi.create({
                productInputId: Number(row.id),
                productOutputQty: Number(row.productOutputQty),
                productOutputDate: dayjs(row.productOutputDate).format('YYYY-MM-DD'),
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

    // 검색,초기화
    const handleSearch = () => {
    setIsSearch(true)
    const filtered = rows.filter(row =>
        (row.companyName?.toLowerCase() || '').includes(searchInfo.companyName.toLowerCase()) &&
        (row.productNo?.toLowerCase() || '').includes(searchInfo.productNo.toLowerCase()) &&
        (row.productName?.toLowerCase() || '').includes(searchInfo.productName.toLowerCase()) &&
        (row.lotNo?.toLowerCase() || '').includes(searchInfo.lotNo.toLowerCase()) &&
        (row.productInputDate?.toLowerCase() || '').includes(searchInfo.productInputDate.toLowerCase()) 
    )
    setSearchRows(filtered)
  }
  const handleReset = () => {
    setIsSearch(false)
    setSearchInfo({
        companyName: '',
        productNo: '',
        productName: '',
        lotNo: '',
        productInputDate: ''
    })
    setSearchRows(rows)
  }
  const handleSearchChange = (key: keyof typeof searchInfo, value: string) => {
    setSearchInfo((prev) => ({ ...prev, [key]: value }));
  };

  /* Alert 팝업 */
  const handleCloseAlert = () => {
      setAlertOpen(false)
  }
  const handleAlertSuccess = () => {
      setAlertInfo({
          type: 'success',
          title: '출고 성공',
          text: '출고가 완료되었습니다.'
      })
      setAlertOpen(true)
      setTimeout(() => setAlertOpen(false), 2000)
  }
  const handleAlertFail = () => {
      setAlertInfo({
          type: 'error',
          title: '출고 실패',
          text: '동작이 실패했습니다.'
      })
      setAlertOpen(true)
      setTimeout(()=> setAlertOpen(false), 3000)
  }

  /* ExcelBtn Props */
  interface ExcelData {
      lotNo: string;
      companyName: string;
      productName: string;
      productNo: string;
      category: string;
      paintType: string;
      productInputQty: number;
      productInputDate: string;
      
  }
  // 엑셀 컬럼 헤더 매핑 정의
  const headerMap: Record<keyof ExcelData, string> = {
      lotNo: 'LOT번호',
      companyName: '거래처명',
      productName: '품목명',
      productNo: '품목번호',
      category: '분류',
      paintType: '도장방식',
      productInputQty: '입고수량',
      productInputDate: '입고일자',
  }
  const excelData = rows.map(row =>
        (Object.keys(headerMap) as (keyof ExcelData)[]).reduce<Record<string, string>> (
            (acc, key) => {
                const value = row[key];
                acc[headerMap[key]] = value != null ? String(value) : '';
                return acc;
            },
            {}
        )
    );

// 테이블 컬럼 설정 
const columns: GridColDef[] = [
    { field: 'lotNo', headerName: 'Lot.No', width: 150, headerAlign: 'center', align: 'center' },
    { field: 'companyName', headerName: '거래처명', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'center' },
    { field: 'productNo', headerName: '품목번호', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
    { field: 'productName', headerName: '품목명', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'center' },
    { field: 'category', headerName: '분류', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
    { field: 'paintType', headerName: '도장방식', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
    { field: 'productInputDate', headerName: '입고일자', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center', 
        renderCell: params => dayjs(params.value).format('YY.MM.DD') },
    { field: 'productInputQty', headerName: '입고수량', flex: 1, minWidth: 100, headerAlign: 'center', align: 'right', 
        renderCell: params => params.value?.toLocaleString() },
    { field: 'productOutputDate', headerName: '출고일자', flex: 2, minWidth: 200, headerAlign: 'center', align: 'center',
        renderCell: params => (
            <DatePicker
                format="YYYY-MM-DD"
                value={params.row.productOutputDate ? dayjs(params.row.productOutputDate) : null}
                onChange={(newValue) => 
                    handleChange(params.row.id, 'productOutputDate', newValue?.format('YYYY-MM-DD') || '')}
                slotProps={{ textField: { size: 'small', sx: { width: '100%' } } }}
            />
        )
    },
    { field: 'productOutputQty', headerName: '출고수량', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'right',
        renderCell: params => (
            <TextField
                type="text"
                size="small"
                value={params.row.productOutputQty?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || ''}
                onChange={(e) => {
                    const rawValue = e.target.value.replace(/,/g, '')
                    handleChange(params.row.id, 'productOutputQty', Number(rawValue))
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
                icon="check" 
                onClick={() => handleOutput(params.row)} 
            />
        )
    }
];

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Card sx={{ height: '98%', margin: '0.5%' }}>
                <Box>
                    {/* Breadcrumbs 영역 */}
                    <CustomBC text="출고 등록" subText='수주대상 입출고 관리' />
                    {/* Content 영역 */}
                    <Box sx={{padding: 2}}>
                      <SearchBar onSearch={handleSearch} onReset={handleReset}>
                        <LabelInput 
                            labelText='거래처명'
                            value={searchInfo.companyName}
                            onChange={(e) => handleSearchChange('companyName', e.target.value)}
                        />
                        <LabelInput 
                            labelText='품목번호'
                            value={searchInfo.productNo}
                            onChange={(e) => handleSearchChange('productNo', e.target.value)}
                        />
                        <LabelInput 
                            labelText='품목명'
                            value={searchInfo.productName}
                            onChange={(e) => handleSearchChange('productName', e.target.value)}
                        />
                        <LabelInput 
                            labelText='입고번호'
                            value={searchInfo.lotNo}
                            onChange={(e) => handleSearchChange('lotNo', e.target.value)}
                        />
                        <LabelDatepicker 
                            labelText='입고일자'
                            value={searchInfo.productInputDate}
                            onChange={(date) => handleSearchChange('productInputDate', date ? date.format('YYYY-MM-DD') : '')}
                        />
                      </SearchBar>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2 }}>
                        <Typography sx={{ fontSize: 24, fontWeight: 'bold' }}>수주대상품목 출고 등록</Typography>
                        <Box sx={{paddingRight: 2}}>
                            <ExcelBtn mappingdata={excelData} sheetName="수주대상품목 출고 등록" fileName="수주대상품목 출고 등록" />
                        </Box>
                    </Box>

                    <Box sx={{padding: 2}}>
                        { isSearch ? (
                        <CommonTable 
                        columns={columns}
                        rows={searchRows}
                        />
                    ) : (
                        <CommonTable 
                            columns={columns}
                            rows={rows}
                        />
                    )}
                    </Box>
                </Box>
                {/* 팝업창 */}
                <Dialog open={alertOpen} onClose={handleCloseAlert}>
                    <AlertPopup 
                        type={alertInfo.type} 
                        title={alertInfo.title} 
                        text={alertInfo.text} 
                    />
                </Dialog>
            </Card>
        </LocalizationProvider>
    )
}

export default OutputReg;