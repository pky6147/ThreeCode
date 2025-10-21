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
// import type { AxiosError } from 'axios';
import { getOutPut } from '../../api/productInputApi';

interface RowData {
    id?: number;
    productInputId: number;      // 입고 아이디
    lotNo: string;
    companyName: string;
    productNo: string;
    productName: string;
    category: string;
    paintType: string;
    productInputQty: number;    
    productInputDate: string;  
    // processStatus?: string;  공정진행상태 (최종만 출고 가능)
    productOutputQty?: number;  // 출고수량 (입력 필드)
    productOutputDate?: string; // 출고일자 (입력 필드)
    remark?: string;     // 비고
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

    /* 입고 데이터 & 출고 데이터 불러와서 필터링 */
    const getTableData = async () => {
        try {
            const data = await getOutPut();
            const results = data
            .map((row:RowData) => ({
                ...row,
                id: row.productInputId,
                productOutputQty: 0,
                productOutputDate: '',
            }))
            setRows(results)

    /* 출고되지 않은 입고만 필터링 */    
    // const filtered = inputs.filter(
    //     (i: any) => !outputIds.has(i.productInputId)
    //   );

    // /* 출고 가능 상태만 남김 */
    // const valid = filtered.filter(
    //     (i: any) => i.processStatus === '최종' || i.processStatus
    // );

    //  const result = valid.map((row: RowData) => ({
    //     ...row,
    //     id: row.productInputId,
    //     productOutputQty: 0,
    //     productOutputDate: dayjs().format('YYYY-MM-DD') // 등록 시 자동 오늘 날짜
    //   }));

    //   setRows(result);
    } catch (err) {
      console.error(err);
      alert("조회 실패!");
    }
  };

   useEffect(() => {
    getTableData();
   }, []);

    /* 출고 등록 */
    const handleOutput = async (row: RowData) => {
        if (!row.productOutputDate || !row.productOutputQty) {
            alert('출고일자와 출고 수량을 모두 입력해주세요.');
            return;
        }

        try {
           const res = await productOutputApi.create({
            productInputId: row.productInputId,
            productOutputQty: row.productOutputQty,
            productOutputDate: row.productOutputDate || dayjs().format('YYYY-MM-DD'),
            remark: row.remark || ''
           });
        
           if (res) {
        handleAlertSuccess();
        getTableData(); // 새로고침
      }
    } catch (err) {
      console.error(err);
      handleAlertFail();
    }
  };

        /** 검색 & 초기화 **/
  const handleSearch = () => {
    setIsSearch(true);
    const filtered = rows.filter((row) =>
      (row.companyName || '').toLowerCase().includes(searchInfo.companyName.toLowerCase()) &&
      (row.productNo || '').toLowerCase().includes(searchInfo.productNo.toLowerCase()) &&
      (row.productName || '').toLowerCase().includes(searchInfo.productName.toLowerCase()) &&
      (row.lotNo || '').toLowerCase().includes(searchInfo.lotNo.toLowerCase()) &&
      (row.productInputDate || '').toLowerCase().includes(searchInfo.productInputDate.toLowerCase())
    );
    setSearchRows(filtered);
  };

  const handleReset = () => {
    setIsSearch(false);
    setSearchInfo({
      companyName: '',
      productNo: '',
      productName: '',
      lotNo: '',
      productInputDate: ''
    });
    setSearchRows(rows);
  };

  const handleSearchChange = (key: keyof typeof searchInfo, value: string) => {
    setSearchInfo((prev) => ({ ...prev, [key]: value }));
  };

  /* Alert 팝업 */
  const handleCloseAlert = () => setAlertOpen(false); 
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

/* 테이블 컬럼 정의 */
  const columns: GridColDef[] = [
    { field: 'lotNo', headerName: 'Lot.No', width: 150, headerAlign: 'center', align: 'center' },
    { field: 'companyName', headerName: '거래처명', flex: 1.2, headerAlign: 'center', align: 'center' },
    { field: 'productNo', headerName: '품목번호', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'productName', headerName: '품목명', flex: 1.3, headerAlign: 'center', align: 'center' },
    { field: 'category', headerName: '분류', flex: 1, headerAlign: 'center', align: 'center' },
    { field: 'paintType', headerName: '도장방식', flex: 1, headerAlign: 'center', align: 'center' },
    {
      field: 'productInputDate',
      headerName: '입고일자',
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => dayjs(params.value).format('YY.MM.DD')
    },
    {
      field: 'productOutputQty',
      headerName: '출고수량',
      flex: 1.2,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <TextField
          type="number"
          size="small"
          value={params.row.productOutputQty || ''}
          onChange={(e) =>
            setRows((prev) =>
              prev.map((r) =>
                r.productInputId === params.row.productInputId
                  ? { ...r, productOutputQty: Number(e.target.value) }
                  : r
              )
            )
          }
          sx={{ width: '100px' }}
        />
      )
    },
    {
      field: 'productOutputDate',
      headerName: '출고일자',
      flex: 1.2,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <DatePicker
          format="YYYY-MM-DD"
          value={dayjs(params.row.productOutputDate)}
          onChange={(newValue) =>
            setRows((prev) =>
              prev.map((r) =>
                r.productInputId === params.row.productInputId
                  ? { ...r, productOutputDate: newValue?.format('YYYY-MM-DD') || '' }
                  : r
              )
            )
          }
          slotProps={{ textField: { size: 'small', sx: { width: '120px', paddingTop: 0.7 } } }}
        />
      )
    },
    {
      field: 'outputbtn',
      headerName: '출고',
      width: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <CustomBtn
          width="60px"
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
                            fontSize={22}
                            onChange={(e) => handleSearchChange('companyName', e.target.value)}
                        />
                        <LabelInput 
                            labelText='품목번호'
                            value={searchInfo.productNo}
                            fontSize={22}
                            onChange={(e) => handleSearchChange('productNo', e.target.value)}
                        />
                        <LabelInput 
                            labelText='품목명'
                            value={searchInfo.productName}
                            fontSize={22}
                            onChange={(e) => handleSearchChange('productName', e.target.value)}
                        />
                        <LabelInput 
                            labelText='입고번호'
                            value={searchInfo.lotNo}
                            fontSize={22}
                            onChange={(e) => handleSearchChange('lotNo', e.target.value)}
                        />
                        <LabelDatepicker 
                            labelText='입고일자'
                            value={searchInfo.productInputDate}
                            fontSize={22}
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

                    <Box sx={{ padding: 2 }}>
                      <CommonTable columns={columns} rows={isSearch ? searchRows : rows} />
                    </Box>
                </Box>

                <Dialog open={alertOpen} onClose={handleCloseAlert}>
                  <AlertPopup type={alertInfo.type} title={alertInfo.title} text={alertInfo.text} />
                </Dialog>
            </Card>
        </LocalizationProvider>
  );
}

export default OutputReg;