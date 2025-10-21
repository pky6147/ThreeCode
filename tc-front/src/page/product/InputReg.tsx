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
import ExcelBtn from '../../component/ExcelBtn';
import LabelInput from '../../component/LabelInput';
import SearchBar from '../../component/SearchBar';
import { getProducts, getProductDetail } from '../../api/productApi';
import { createProductInput } from '../../api/productInputApi'
import { getCompanies } from '../../api/CompanyApi';
import type { CompanyRow } from '../base/Company/Company'
import ProductDetail from '../base/Product/ProductDetail'
import AlertPopup, {type AlertProps} from '../../component/AlertPopup';

interface RowData {
    id: number;
    idx?: number;
    compnayId?: number;
    companyName?: string;
    productId?: number;
    productNo?: string;
    productName?: string;
    category?: string;
    paintType?: string;
    remark?: string;
    productInputQty?: number;
    productInputDate?: string;
    isActive?: string;
}


function InputReg() {
    const [rows, setRows ] = useState<RowData[]>([])
    // Detail
    const [detailOpen, setDetailOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    /* Search */
    const [searchInfo, setSearchInfo] = useState({
            companyName: '',
            productNo: '',
            productName: '',
        })
    const [searchRows, setSearchRows] = useState<RowData[]>([])
    const [isSearch, setIsSearch] = useState(false)
    // Alert
    const [alertOpen, setAlertOpen] = useState(false)
    const [alertInfo, setAlertInfo] = useState<AlertProps>({})

    
    const getProductData = async () => {
            try {
                const companyData = await getCompanies();
                const productData = await getProducts();
                
                const filteredCompany = companyData.filter((row) => row.isActive === 'Y' && row.companyType === '거래처') // 업체사용여부 Y, 거래처
                const filteredProduct = productData
                .filter((row: RowData) => row.isActive === 'Y') // 수주품목 사용여부 Y 인것
                .filter((row: CompanyRow) =>
                  filteredCompany.some((company) => company.companyId === row.companyId)
                );
                
                // => 업체 매입처, 사용여부 Y, 원자재 사용여부 Y인 것만 노출
                const result = filteredProduct
                .map((row:RowData, index:number) => ({
                    ...row,
                    id: row.productId,
                    idx: index+1,
                    productInputQty: 0,
                    productInputDate: '',
                }))
                
                setRows(result)
            }
            catch(err) {
                console.error(err)
                alert("조회 실패!")
            }
        };
        
        useEffect(()=> {
            getProductData();
        }, [])
    
        const BoardRefresh = () => {
            getProductData();
        }

    // 테이블 내 값 변경
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

    // 품목명 클릭시 상세조회
    const handleDetail = async (productId: number) => {
    try {
      const res = await getProductDetail(productId);
      console.log("상세조회 응답:", res);
      setSelectedProduct(res);
      setDetailOpen(true);
    } catch (err) {
      console.error("상세조회 실패:", err);
    }
  };

    // 입고버튼 클릭
    const handleInput = async (row: RowData) => {
    
    if (!row.productInputQty || !row.productInputDate) {
        setAlertInfo({
            type: 'error',
            title: '수주대상 입고 등록 실패',
            text: '입고수량과 입고일자를 입력해주세요.'
        })
        handleAlert();
        return;
    }

    try {
        await createProductInput({
            productId: row.productId,
            productInputQty: row.productInputQty,
            productInputDate: row.productInputDate,
        });
        setAlertInfo({
            type: 'success',
            title: '수주대상 입고 등록',
            text: '수주대상 입고 등록이 완료되었습니다.'
        })
        handleAlert();
        BoardRefresh();
    } catch(err) {
        console.error(err);
        setAlertInfo({
            type: 'error',
            title: '수주대상 입고 등록 실패',
            text: '예기치 못한 오류로 입고 등록을 실패하였습니다.'
        })
        handleAlert();
    }
}

    /* Search */
    const handleSearch = () => {
        setIsSearch(true)
        const filtered = rows.filter(row =>
            (row.companyName?.toLowerCase() || '').includes(searchInfo.companyName.toLowerCase()) &&
            (row.productNo?.toLowerCase() || '').includes(searchInfo.productNo.toLowerCase()) &&
            (row.productName?.toLowerCase() || '').includes(searchInfo.productName.toLowerCase())
        )
        setSearchRows(filtered)
    }
    const handleReset = () => {
        setIsSearch(false)
        setSearchInfo({
            companyName: '',
            productNo: '',
            productName: '',
        })
        setSearchRows(rows)
    }
    const handleSearchChange = (key: keyof typeof searchInfo, value: string) => {
        setSearchInfo((prev) => ({ ...prev, [key]: value }));
    };

    /* ExcelBtn Props */
    interface ExcelData {
        idx: number;
        companyName: string;
        productName: string;
        productNo: string;
        category: string;
        paintType: string;
        remark: string;
    }
    // 엑셀 컬럼 헤더 매핑 정의
    const headerMap: Record<keyof ExcelData, string> = {
        idx: 'Seq',
        companyName: '기업명',
        productName: '품목명',
        productNo: '품목번호',
        category: '분류',
        paintType: '도장방식',
        remark: '비고',
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

    /* Alert 팝업 */
    const handleCloseAlert = () => {
        setAlertOpen(false)
    }
    const handleAlert = () => {
        setAlertOpen(true)
        setTimeout(() => setAlertOpen(false), 3000)
    }

    const columns: GridColDef[] = [
        { field: 'idx', headerName: 'No', width: 70, headerAlign: 'center', align: 'center' },
        { field: 'companyName', headerName: '거래처명', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'center' },
        { field: 'productNo', headerName: '품목번호', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
        { field: 'productName', headerName: '품목명', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'center',
            renderCell: (params) => (
            <Typography
                variant="body2"
                sx={{ 
                    cursor: 'pointer', color: 'blue', // textDecoration: 'underline', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    height: '100%', width: '100%', fontWeight: 'bold', fontSize: 16
                }}
                onClick={() => handleDetail(params.row.id)}
            >
              {params.value}
            </Typography>
          ),
         },
        { field: 'category', headerName: '분류', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
        { field: 'paintType', headerName: '도장방식', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
        { field: 'remark', headerName: '비고', flex: 3, minWidth: 300, headerAlign: 'center', align: 'left' },
        { field: 'productInputQty', headerName: '입고수량', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'right',
            renderCell: (params) => (
                <TextField
                    type="text"
                    size="small"
                    value={params.row.productInputQty?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || ''}
                    onChange={(e) => {
                        // 입력값에서 콤마 제거 후 숫자로 변환
                        const rawValue = e.target.value.replace(/,/g, '');
                        handleChange(params.row.id, 'productInputQty', Number(rawValue))
                    }}
                    sx={{ width: '100%', paddingTop: 0.7, display: 'flex' }}
                    InputProps={{ sx: { '& input': { textAlign: 'right' } } }}
                />
            )
         },
        { field: 'productInputDate', headerName: '입고일자', flex: 2, minWidth: 200, headerAlign: 'center', align: 'center',
            renderCell: (params) => (
                <DatePicker
                  format="YYYY-MM-DD"
                  value={params.row.productInputDate ? dayjs(params.row.productInputDate) : null}
                  onChange={(newValue) =>
                    handleChange(
                      params.row.id,
                      'productInputDate',
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
                    <CustomBC text="입고 등록" subText='수주대상 입출고 관리' />
                    {/* Content 영역 */}
                    <Box sx={{padding: 2}}>
                        <SearchBar onSearch={handleSearch} onReset={handleReset}>
                            <LabelInput 
                                labelText='거래처명'
                                value={searchInfo.companyName}
                                fontSize={22}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearchChange('companyName', e.target.value)}
                            />
                            <LabelInput 
                                labelText='품목번호'
                                value={searchInfo.productNo}
                                fontSize={22}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearchChange('productNo', e.target.value)}
                            />
                            <LabelInput 
                                labelText='품목명'
                                value={searchInfo.productName}
                                fontSize={22}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearchChange('productName', e.target.value)}
                            />
                        </SearchBar>
                    </Box>
                    <Box>
                        <Box
                            sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
                        >
                            <Typography sx={{ fontSize: '24px', fontWeight: 'bold', paddingLeft: 2 }}>수주대상품목 입고 등록</Typography>
                            <Box sx={{paddingRight: 2}}>
                                <ExcelBtn mappingdata={excelData} sheetName="수주대상품목 입고 등록" fileName="수주대상품목 입고 등록" />
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
                </Box>
                <ProductDetail
                    open={detailOpen}
                    onClose={() => setDetailOpen(false)}
                    data={selectedProduct}
                />
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

export default InputReg;