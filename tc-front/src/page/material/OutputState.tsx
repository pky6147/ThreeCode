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
import type { AxiosError } from 'axios';
import ExcelBtn from '../../component/ExcelBtn';
import LabelInput from '../../component/LabelInput';
import LabelDatepicker from '../../component/LabelDatepicker';
import SearchBar from '../../component/SearchBar';
import { getMaterialOutput, updateMaterialOutput, deleteMaterialOutput } from '../../api/materialOutputApi'
import AlertPopup, {type AlertProps } from '../../component/AlertPopup';

export interface MaterialOutputType {
    id?: number;
    materialOutputId: number;
    materialOutputNo: string;
    companyName: string;
    materialId: number;
    materialNo: string;
    materialName: string;
    maker: string;
    materialOutputQty: number;
    materialOutputDate: string;
    materialInputId: number;
    materialInputNo: string;
    materialInputQty: number;
    materialInputDate: string;
    remainQty: number;
    createdAt: string;
    isEditing? : boolean;
}

function OutputState() {
    const [rows, setRows ] = useState<MaterialOutputType[]>([])
    const [temp, setTemp] = useState<MaterialOutputType>(rows[0])
    /* Search */
    const [searchInfo, setSearchInfo] = useState({
            companyName: '',
            materialNo: '',
            materialName: '',
            materialOutputNo: '',
            materialOutputDate: '',
        })
    const [searchRows, setSearchRows] = useState<MaterialOutputType[]>([])
    const [isSearch, setIsSearch] = useState(false)
    /* Alert */
    const [alertOpen, setAlertOpen] = useState(false)
    const [alertInfo, setAlertInfo] = useState<AlertProps>({})

    const getMaterialOutputData = async () => {
        try {
            const data = await getMaterialOutput();
            
            const result = data.map((row:MaterialOutputType) => ({
                ...row,
                id: row.materialOutputId
            }))

            setRows(result)
        }
        catch(err) {
            console.error(err)
            alert("조회 실패!")
        }
    }
    useEffect(()=> {
            getMaterialOutputData();
        }, [])
    
    const BoardRefresh = () => {
        getMaterialOutputData();
    }


    const handleChange = <K extends keyof MaterialOutputType> (
        id: number,
        field: K,
        value: MaterialOutputType[K]
    ) => {
        setRows((prev) => 
            prev.map((row) =>
                row.id === id ? { ...row, [field]: value } : row
            )
        )
    }

    // 수정버튼 클릭
    const handleEdit = (row: MaterialOutputType, edit: boolean) => {
        setTemp(row)
        setRows(prev => prev.map(r => r.id === row.id ? { ...r, isEditing: edit } : r));
    }
    // 저장 버튼 클릭
    const handleSave = async (row: MaterialOutputType) => {
        if( (row.materialOutputQty === 0 || isNaN(row.materialOutputQty)) ||
            (row.materialOutputDate === '' || null)) {
            setAlertInfo({
                type: 'error',
                title: '출고 이력 수정 실패',
                text: '출고수량과 출고일자를 입력해주세요.'
            })
            setAlertOpen(true)

            setTimeout(()=> setAlertOpen(false), 3000)
            return;
        } else if (row.materialOutputQty < 0) {
            setAlertInfo({
                type: 'error',
                title: '출고 이력 수정 실패',
                text: '출고수량은 1개 이상 입력해주세요.'
            })
            setAlertOpen(true)

            setTimeout(()=> setAlertOpen(false), 3000)
            return;
        } else if (row.materialOutputQty > row.remainQty + temp.materialOutputQty) {
            setAlertInfo({
                type: 'error',
                title: '출고 이력 수정 실패',
                text: `출고수량이 남은 재고량 ${row.remainQty+temp.materialOutputQty} (재고: ${row.remainQty} + 기존: ${temp.materialOutputQty}) 초과합니다.`
            })
            setAlertOpen(true)

            setTimeout(()=> setAlertOpen(false), 3000)
            return;
        }

        try {
            if (!row.id) {
              console.error("❌ 수정할 데이터에 id가 없습니다.");
              return;
            }
            await updateMaterialOutput(row.id, {
                materialOutputQty: row.materialOutputQty,
                materialOutputDate: row.materialOutputDate,
            }).then(()=>{
                setAlertInfo({
                    type: 'success',
                    title: '수정 성공',
                    text: '성공적으로 데이터를 수정하였습니다.'
                })
                setAlertOpen(true)

                setTimeout(()=> setAlertOpen(false), 3000)
                BoardRefresh()
            })
        } catch(err) {
            const axiosError = err as AxiosError;
            console.error(err)
            if (axiosError.response && axiosError.response.data) {
                if(axiosError.response.data == '출고일자는 입고일자보다 빠를 수 없습니다.') {
                    setAlertInfo({
                        type: 'error',
                        title: '수정 오류',
                        text: '출고일자는 입고일자보다 빠를 수 없습니다.'
                    })
                    setAlertOpen(true)
    
                    setTimeout(()=> handleCloseAlert(), 3000)
                }
            } else {
                // handleAlertFail()
            }
        }
    };
    // 취소 버튼 클릭
    const handleCancel = (row: MaterialOutputType) => {
      setRows(prev =>
        prev.map(r =>
          r.id === row.id
            ? { ...r, 
                isEditing: false, 
                ['materialOutputQty']: temp.materialOutputQty,
                ['materialOutputDate']: temp.materialOutputDate,
            }
            : r
        )
      );
    }
    // 삭제 버튼 클릭
    const handleDelete = async (id: number) => {
        if (!confirm("정말 삭제하시겠습니까?")) return;
                        
        try {
            await deleteMaterialOutput(id).then(()=>{
                setAlertInfo({
                    type: 'success',
                    title: '삭제 성공',
                    text: '성공적으로 데이터를 삭제하였습니다.'
                })
                setAlertOpen(true)

                setTimeout(()=> handleCloseAlert(), 3000)
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
            (row.materialOutputNo?.toLowerCase() || '').includes(searchInfo.materialOutputNo.toLowerCase()) &&
            (row.materialOutputDate?.toLowerCase() || '').includes(searchInfo.materialOutputDate.toLowerCase()) 
        )
        setSearchRows(filtered)
    }
    const handleReset = () => {
        setIsSearch(false)
        setSearchInfo({
            companyName: '',
            materialNo: '',
            materialName: '',
            materialOutputNo: '',
            materialOutputDate: ''
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

    /* ExcelBtn Props */
    interface ExcelData {
        materialOutputNo: string;
        companyName: string;
        materialNo: string;
        materialName: string;
        maker: string;
        materialOutputQty: number;
        materialOutputDate: string;
    }
    // 엑셀 컬럼 헤더 매핑 정의
    const headerMap: Record<keyof ExcelData, string> = {
        materialOutputNo: '출고번호',
        companyName: '매입처명',
        materialNo: '품목번호',
        materialName: '품목명',
        maker: '제조사',
        materialOutputQty: '출고수량',
        materialOutputDate: '출고일자',
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
        { field: 'materialOutputNo', headerName: '출고번호', width: 180, headerAlign: 'center', align: 'center' },
        { field: 'companyName', headerName: '매입처명', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'center' },
        { field: 'materialNo', headerName: '품목번호', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
        { field: 'materialName', headerName: '품목명', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'center' },
        { field: 'maker', headerName: '제조사', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
        { field: 'materialInputNo', headerName: '입고번호', minWidth: 180, headerAlign: 'center', align: 'center' },
        { field: 'materialInputQty', headerName: '입고수량', flex: 1, minWidth: 100, headerAlign: 'center', align: 'right',
            renderCell: (params) => {
                const value = params.value;
                return value?.toLocaleString();  // 천단위 콤마
            }
        },
        { field: 'materialInputDate', headerName: '입고일자', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center',
            renderCell: (params) => {
                if (!params.value) return ''; // 값 없으면 빈 문자열
                return dayjs(params.value).format('YY.MM.DD'); 
                
            }
        },
        { field: 'materialOutputQty', headerName: '출고수량', flex: 1, minWidth: 100, headerAlign: 'center', align: 'right',
            renderCell: (params) => {
                if(params.row.isEditing) {
                    return (
                        <TextField
                            type="text"
                            size="small"
                            value={params.row.materialOutputQty?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || ''}
                            onChange={(e) => {
                                // 입력값에서 콤마 제거 후 숫자로 변환
                                const rawValue = e.target.value.replace(/,/g, '');
                                handleChange(params.row.id, 'materialOutputQty', Number(rawValue))
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
        { field: 'materialOutputDate', headerName: '출고일자', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center',
            renderCell: (params) => {
                if(params.row.isEditing) {
                    return (
                        <DatePicker
                          format="YYYY-MM-DD"
                          value={params.row.materialOutputDate ? dayjs(params.row.materialOutputDate) : null}
                          onChange={(newValue) =>
                            handleChange(
                              params.row.id,
                              'materialOutputDate',
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
            renderCell: (params) => (
                <CustomBtn
                    width="50px"
                    text="삭제"
                    icon="delete"
                    backgroundColor='red'
                    onClick={() => handleDelete(params.row.materialOutputId)}
                />

            )
        },
    ]
        

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Card
                sx={{ height: '98%', margin: '0.5%'}}
            >
                <Box>
                    {/* Breadcrumbs 영역 */}
                    <CustomBC text="출고 현황" subText='원자재 입출고 관리' />
                    {/* Content 영역 */}
                    <Box sx={{padding: 2}}>
                        <SearchBar onSearch={handleSearch} onReset={handleReset}>
                            <LabelInput 
                                labelText='매입처명'
                                value={searchInfo.companyName}
                                fontSize={22}
                                onChange={(e) => handleSearchChange('companyName', e.target.value)}
                            />
                            <LabelInput 
                                labelText='품목번호'
                                value={searchInfo.materialNo}
                                fontSize={22}
                                onChange={(e) => handleSearchChange('materialNo', e.target.value)}
                            />
                            <LabelInput 
                                labelText='품목명'
                                value={searchInfo.materialName}
                                fontSize={22}
                                onChange={(e) => handleSearchChange('materialName', e.target.value)}
                            />
                            <LabelInput 
                                labelText='출고번호'
                                value={searchInfo.materialOutputNo}
                                fontSize={22}
                                onChange={(e) => handleSearchChange('materialOutputNo', e.target.value)}
                            />
                            <LabelDatepicker 
                                labelText='출고일자'
                                value={searchInfo.materialOutputDate}
                                fontSize={22}
                                onChange={(date) => handleSearchChange('materialOutputDate', date ? date.format('YYYY-MM-DD') : '')}
                            />
                        </SearchBar>
                    </Box>
                    <Box>
                        <Box
                            sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
                        >
                            <Typography sx={{ fontSize: '24px', fontWeight: 'bold', paddingLeft: 2 }}>원자재 품목 출고 현황</Typography>
                            <Box sx={{paddingRight: 2}}>
                                <ExcelBtn mappingdata={excelData} sheetName="원자재 출고 현황" fileName="원자재 출고 현황" />
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
                {/* 팝업창 */}
                <Dialog open={alertOpen} onClose={handleCloseAlert}>
                    <AlertPopup 
                        type={alertInfo.type || 'success'} 
                        title={alertInfo.title} 
                        text={alertInfo.text} 
                    />
                </Dialog>
            </Card>
        </LocalizationProvider>
    )
}

export default OutputState;