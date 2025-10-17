import { useEffect, useState } from 'react'
import { Box, Typography, Card, TextField } from '@mui/material'
import CustomBC from '../../component/CustomBC';
import CustomBtn from '../../component/CustomBtn';
import CommonTable from '../../component/CommonTable';
import type { GridColDef } from '@mui/x-data-grid'
import dayjs from 'dayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import type { AxiosError } from 'axios';
import { getMaterialInput, updateMaterialInput, deleteMaterialInput } from '../../api/materialInputApi';
import ExcelBtn from '../../component/ExcelBtn';
import LabelInput from '../../component/LabelInput';
import LabelDatepicker from '../../component/LabelDatepicker';
import SearchBar from '../../component/SearchBar';

interface RowData {
    id: number;
    materialInputId: number;
    materialInputNo: string;
    companyName: string;
    materialId: number;
    materialNo: string;
    materialName: string;
    spec: string;
    specValue?: string;
    total?: number;
    materialInputQty: number
    materialInputDate: string;
    makeDate: string;
    maker: string;
    isEditing? : boolean;
}

function InputState() {
    const [rows, setRows ] = useState<RowData[]>([])
    const [temp, setTemp] = useState<RowData>(rows[0])
    /* Search */
    const [searchInfo, setSearchInfo] = useState({
            companyName: '',
            materialNo: '',
            materialName: '',
            materialInputNo: '',
            materialInputDate: '',
        })
    const [searchRows, setSearchRows] = useState<RowData[]>([])
    const [isSearch, setIsSearch] = useState(false)

    const getMaterialInputData = async () => {
        try {
            const data = await getMaterialInput();
            
            const result = data.map((row:RowData, index:number) => ({
                ...row,
                idx: index+1,
                id: row.materialInputId
            }))

            setRows(result)
        }
        catch(err) {
            console.error(err)
            alert("조회 실패!")
        }
    };
    
    useEffect(()=> {
        getMaterialInputData();
    }, [])

    const BoardRefresh = () => {
        getMaterialInputData();
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
            await updateMaterialInput(row.id, {
                materialId: row.materialId,
                materialInputQty: row.materialInputQty,
                materialInputDate: row.materialInputDate,
                makeDate: row.makeDate,
            }).then(()=>{
                // handleAlertSuccess()
                BoardRefresh()
            })
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
                ['materialInputQty']: temp.materialInputQty,
                ['materialInputDate']: temp.materialInputDate,
                ['makeDate']: temp.makeDate,
            }
            : r
        )
      );
    }
    // 삭제 버튼 클릭
    const handleDelete = async (id: number) => {
        if (!confirm("정말 삭제하시겠습니까?")) return;
                
        try {
            await deleteMaterialInput(id).then(()=>{
                // handleAlertSuccess()
                BoardRefresh()
            })
        } catch(err) {
            console.error(err);
            // handleAlertFail()
        }
    }

    /* 검색/초기화 관련함수 */
    const handleSearch = () => {
        setIsSearch(true)
        const filtered = rows.filter(row =>
            (row.companyName?.toLowerCase() || '').includes(searchInfo.companyName.toLowerCase()) &&
            (row.materialNo?.toLowerCase() || '').includes(searchInfo.materialNo.toLowerCase()) &&
            (row.materialName?.toLowerCase() || '').includes(searchInfo.materialName.toLowerCase()) &&
            (row.materialInputNo?.toLowerCase() || '').includes(searchInfo.materialInputNo.toLowerCase()) &&
            (row.materialInputDate?.toLowerCase() || '').includes(searchInfo.materialInputDate.toLowerCase()) 
        )
        setSearchRows(filtered)
    }
    const handleReset = () => {
        setIsSearch(false)
        setSearchInfo({
            companyName: '',
            materialNo: '',
            materialName: '',
            materialInputNo: '',
            materialInputDate: ''
        })
        setSearchRows(rows)
    }
    const handleSearchChange = (key: keyof typeof searchInfo, value: string) => {
        setSearchInfo((prev) => ({ ...prev, [key]: value }));
    };

    /* ExcelBtn Props */
    interface ExcelData {
        materialInputNo: string;
        companyName: string;
        materialNo: string;
        materialName: string;
        spec: string;
        materialInputQty: number;
        total: number;
        materialInputDate: string;
        makeDate: string;
        maker: string;
    }
    // 엑셀 컬럼 헤더 매핑 정의
    const headerMap: Record<keyof ExcelData, string> = {
        materialInputNo: '입고번호',
        companyName: '기업명',
        materialNo: '품목번호',
        materialName: '품목명',
        spec: '규격',
        materialInputQty: '입고수량',
        total: '총량',
        materialInputDate: '입고일자',
        makeDate: '제조일자',
        maker: '제조사',
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
        { field: 'materialInputNo', headerName: '입고번호', width: 200, headerAlign: 'center', align: 'center' },
        { field: 'companyName', headerName: '거래처명', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'center' },
        { field: 'materialNo', headerName: '품목번호', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
        { field: 'materialName', headerName: '품목명', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'center' },
        { field: 'spec', headerName: '규격', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
        { field: 'materialInputQty', headerName: '입고수량', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'right',
            renderCell: (params) => {
                if(params.row.isEditing) {
                    return (
                        <TextField
                            type="text"
                            size="small"
                            value={params.row.materialInputQty?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || ''}
                            onChange={(e) => {
                                // 입력값에서 콤마 제거 후 숫자로 변환
                                const rawValue = e.target.value.replace(/,/g, '');
                                handleChange(params.row.id, 'materialInputQty', Number(rawValue))
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
        { field: 'total', headerName: '총량', flex: 1, minWidth: 100, headerAlign: 'center', align: 'right',
            renderCell: (params) => {
                return params.value?.toLocaleString();
            }
         },
        { field: 'materialInputDate', headerName: '입고일자', flex: 2, minWidth: 200, headerAlign: 'center', align: 'center',
            renderCell: (params) => {
                if(params.row.isEditing) {
                    return (
                        <DatePicker
                          format="YYYY-MM-DD"
                          value={params.row.materialInputDate ? dayjs(params.row.materialInputDate) : null}
                          onChange={(newValue) =>
                            handleChange(
                              params.row.id,
                              'materialInputDate',
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
        { field: 'makeDate', headerName: '제조일자', flex: 2, minWidth: 200, headerAlign: 'center', align: 'center',
            renderCell: (params) => {
                if(params.row.isEditing) {
                    return (
                        <DatePicker
                          format="YYYY-MM-DD"
                          value={params.row.makeDate ? dayjs(params.row.makeDate) : null}
                          onChange={(newValue) =>
                            handleChange(
                              params.row.id,
                              'makeDate',
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
        { field: 'maker', headerName: '제조사', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
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
                        onClick={() => handleDelete(params.row.materialInputId)}
                    />
                )
            }
        },
    ]
        

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Card
                sx={{ height: '98%', margin: '0.5%', width: '100%'}}
            >
                <Box>
                    {/* Breadcrumbs 영역 */}
                    <CustomBC text="입고 현황" subText='원자재 입출고 관리' />
                    {/* Content 영역 */}
                    <Box sx={{padding: 2}}>
                        <SearchBar onSearch={handleSearch} onReset={handleReset}>
                            <LabelInput 
                                labelText='매입처명'
                                value={searchInfo.companyName}
                                onChange={(e) => handleSearchChange('companyName', e.target.value)}
                            />
                            <LabelInput 
                                labelText='품목번호'
                                value={searchInfo.materialNo}
                                onChange={(e) => handleSearchChange('materialNo', e.target.value)}
                            />
                            <LabelInput 
                                labelText='품목명'
                                value={searchInfo.materialName}
                                onChange={(e) => handleSearchChange('materialName', e.target.value)}
                            />
                            <LabelInput 
                                labelText='입고번호'
                                value={searchInfo.materialInputNo}
                                onChange={(e) => handleSearchChange('materialInputNo', e.target.value)}
                            />
                            <LabelDatepicker 
                                labelText='입고일자'
                                value={searchInfo.materialInputDate}
                                onChange={(date) => handleSearchChange('materialInputDate', date ? date.format('YYYY-MM-DD') : '')}
                            />
                        </SearchBar>
                    </Box>
                    <Box>
                        <Box
                            sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
                        >
                            <Typography sx={{ fontSize: '24px', fontWeight: 'bold', paddingLeft: 2 }}>원자재 품목 입고 현황</Typography>
                            <Box sx={{paddingRight: 2}}>
                                <ExcelBtn mappingdata={excelData} sheetName="원자재 입고 현황" fileName="원자재 입고 현황" />
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