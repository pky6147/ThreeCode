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
import ExcelBtn from '../../component/ExcelBtn';
import LabelInput from '../../component/LabelInput';
import LabelDatepicker from '../../component/LabelDatepicker';
import SearchBar from '../../component/SearchBar';
import type { AxiosError } from 'axios';

interface RowData {
    id: number;
    productInputId?: number;
    lotNo: string;
    companyName: string;
    productId?: number;
    productNo: string;
    productName: string;
    category: string;
    paintType: string;    
    productInputQty: number;
    productInputDate: string;
    isEditing? : boolean;
}

function InputState() {
    // const [rows, setRows ] = useState<RowData[]>([])
    const [rows, setRows ] = useState<RowData[]>([
        { id: 1, lotNo: 'LOT-20251015-001', companyName: '업체A', productNo: 'P001', productName: '스프링', category: '방산', paintType: '액체', productInputQty: 0, productInputDate: '' },
        { id: 2, lotNo: 'LOT-20251015-002', companyName: '업체B', productNo: 'P002', productName: '팬', category: '방산', paintType: '액체', productInputQty: 0, productInputDate: '' },
        { id: 3, lotNo: 'LOT-20251015-003', companyName: '업체1', productNo: 'P010', productName: 'Test1', category: '일반', paintType: '분체', productInputQty: 0, productInputDate: '' },
        { id: 4, lotNo: 'LOT-20251015-004', companyName: '업체2', productNo: 'P100', productName: 'Test2', category: '일반', paintType: '분체', productInputQty: 0, productInputDate: '' },
    ])
    const [temp, setTemp] = useState<RowData>(rows[0])
    /* Search */
    const [searchInfo, setSearchInfo] = useState({
            companyName: '',
            productNo: '',
            productName: '',
            lotNo: '',
            productInputDate: '',
        })
    const [searchRows, setSearchRows] = useState<RowData[]>([])
    const [isSearch, setIsSearch] = useState(false)

    const getProductInputData = async () => {
        try {
            // const data = await getProductInput();
            
            // const result = data.map((row:RowData, index:number) => ({
            //     ...row,
            //     idx: index+1,
            //     id: row.productInputId
            // }))

            // setRows(result)
        }
        catch(err) {
            console.error(err)
            alert("조회 실패!")
        }
    };
    
    useEffect(()=> {
        getProductInputData();
    }, [])

    // const BoardRefresh = () => {
    //     getProductInputData();
    // }

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

    // 수정버튼 클릭
    const handleEdit = (row: RowData, edit: boolean) => {
        setTemp(row)
        setRows(prev => prev.map(r => r.id === row.id ? { ...r, isEditing: edit } : r));
    }
    // 저장 버튼 클릭
    const handleSave = async (row: RowData) => {
        try {
            if (!row.id) {
              console.error("❌ 수정할 데이터에 id가 없습니다.");
              return;
            }
            // await updateMaterialInput(row.id, {
            //     materialId: row.materialId,
            //     materialInputQty: row.materialInputQty,
            //     materialInputDate: row.materialInputDate,
            //     makeDate: row.makeDate,
            // }).then(()=>{
            //     // handleAlertSuccess()
            //     BoardRefresh()
            // })
        } catch(err) {
            const axiosError = err as AxiosError;
            console.error(err)
            if (axiosError.response && axiosError.response.data) {
                // handleAlertFail()
            } else {
                // handleAlertFail()
            }
        }
    };
    // 취소 버튼 클릭
    const handleCancel = (row: RowData) => {
      setRows(prev =>
        prev.map(r =>
          r.id === row.id
            ? { ...r, 
                isEditing: false, 
                ['productInputQty']: temp.productInputQty,
                ['productInputDate']: temp.productInputDate,
            }
            : r
        )
      );
    }
    // 삭제 버튼 클릭
    const handleDelete = async (id: number) => {
        console.log('delete id', id)
        if (!confirm("정말 삭제하시겠습니까?")) return;
                        
                try {
                    // await deleteMaterialInput(id).then(()=>{
                    //     // handleAlertSuccess()
                    //     // BoardRefresh()
                    // })
                } catch(err) {
                    console.error(err);
                    // handleAlertFail()
                }
    }
    // 작업지시서 버튼 클릭
    const handleGuide = (row: RowData) => {
        console.log('작업지시서를 켤 행의 data', row)
    }
    // Lot번호 클릭, 공정진행화면을 팝업해야함
    const handleRunningPage = (row: RowData) => {
        console.log('공정진행화면을 켤 행의 data', row)
    }

    /* 검색/초기화 관련함수 */
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

    /* ExcelBtn Props */
    interface ExcelData {
        lotNo: string;
        companyName: string;
        productNo: string;
        productName: string;
        category: string;
        paintType: string;
        productInputQty: number;
        productInputDate: string;
    }
    // 엑셀 컬럼 헤더 매핑 정의
    const headerMap: Record<keyof ExcelData, string> = {
        lotNo: 'LOT번호',
        companyName: '기업명',
        productNo: '품목번호',
        productName: '품목명',
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

    const columns: GridColDef[] = [
        { field: 'lotNo', headerName: 'Lot.No', width: 150, headerAlign: 'center', align: 'center',
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
        { field: 'companyName', headerName: '거래처명', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'center' },
        { field: 'productNo', headerName: '품목번호', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
        { field: 'productName', headerName: '품목명', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'center' },
        { field: 'category', headerName: '분류', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
        { field: 'paintType', headerName: '도장방식', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
        { field: 'productInputQty', headerName: '입고수량', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'right',
            renderCell: (params) => {
                if(params.row.isEditing) {
                    return (
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
                } else {
                    return params.value?.toLocaleString();
                }
            }
         },
        { field: 'productInputDate', headerName: '입고일자', flex: 2, minWidth: 200, headerAlign: 'center', align: 'center',
            renderCell: (params) => {
                if(params.row.isEditing) {
                    return (
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
                                icon="check"
                                onClick={() => handleSave(params.row)}
                            />
                            <CustomBtn
                                backgroundColor='red'
                                text="취소"
                                icon="close"
                                onClick={() => handleCancel(params.row)}
                            />
                        </Box>
                    
                    );
                } else {
                    return (
                        <CustomBtn
                            width="50px"
                            text="수정"
                            icon="edit"
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
                        icon="delete"
                        backgroundColor='red'
                        onClick={() => handleDelete(params.row.productInputId)}
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
                    <CustomBC text="입고 현황" subText='수주대상 입출고 관리' />
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
                    <Box>
                        <Box
                            sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
                        >
                            <Typography sx={{ fontSize: '24px', fontWeight: 'bold', paddingLeft: 2 }}>수주대상품목 입고 현황</Typography>
                            <Box sx={{paddingRight: 2}}>
                                <ExcelBtn mappingdata={excelData} sheetName="수주대상품목 입고 현황" fileName="수주대상품목 입고 현황" />
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
            </Card>
        </LocalizationProvider>
    )
}

export default InputState;