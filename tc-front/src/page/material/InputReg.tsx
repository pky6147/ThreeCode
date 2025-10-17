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
import { getMaterial } from '../../api/materialApi';
import { getCompanies } from '../../api/CompanyApi';
import LabelInput from '../../component/LabelInput';
import SearchBar from '../../component/SearchBar';
import ExcelBtn from '../../component/ExcelBtn';
import type { AxiosError } from 'axios';
import AlertPopup from '../../component/AlertPopup';
import { createMaterialInput } from '../../api/materialInputApi';
import type { CompanyRow } from '../base/Company/Company'

interface RowData {
    id?: number;
    idx?: number;
    companyId?: number;
    companyName?: string;
    materialId?: number;
    materialNo?: string;
    materialName?: string;
    spec?: string;
    specValue?: string;
    maker?: string;
    materialInputQty?: number;
    materialInputDate?: string;
    makeDate?: string;
    isActive?: string;
}

interface AlertInfo {
  type?: 'error' | 'warning' | 'info' | 'success';
  title?: string;
  text?: string;
}

function InputReg() {
    const [rows, setRows ] = useState<RowData[]>([])
    /* Search */
    const [searchInfo, setSearchInfo] = useState({
            companyName: '',
            materialNo: '',
            materialName: '',
        })
    const [searchRows, setSearchRows] = useState<RowData[]>([])
    const [isSearch, setIsSearch] = useState(false)
    /* Alert */
    const [alertOpen, setAlertOpen] = useState(false)
    const [alertInfo, setAlertInfo] = useState<AlertInfo>({})

    const getMaterialData = async () => {
        try {
            const companyData = await getCompanies();
            const materialData = await getMaterial();
            
            const filteredCompany = companyData.filter((row) => row.isActive === 'Y' && row.companyType === '매입처') // 업체사용여부 Y, 매입처
            const filteredMaterial = materialData
            .filter((row: RowData) => row.isActive === 'Y') // 원자재 사용여부 Y 인것
            .filter((row: CompanyRow) =>
              filteredCompany.some((company) => company.companyId === row.companyId)
            );
            // => 업체 매입처, 사용여부 Y, 원자재 사용여부 Y인 것만 노출
            const result = filteredMaterial
            .map((row:RowData, index:number) => ({
                ...row,
                id: row.materialId,
                idx: index+1,
                materialInputQty: 0,
                materialInputDate: '',
                makeDate: ''
            }))

            setRows(result)
        }
        catch(err) {
            console.error(err)
            alert("조회 실패!")
        }
    };
    
    useEffect(()=> {
        getMaterialData();
    }, [])

    const BoardRefresh = () => {
        getMaterialData();
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

    /* Search */
    const handleSearch = () => {
        setIsSearch(true)
        const filtered = rows.filter(row =>
            (row.companyName?.toLowerCase() || '').includes(searchInfo.companyName.toLowerCase()) &&
            (row.materialNo?.toLowerCase() || '').includes(searchInfo.materialNo.toLowerCase()) &&
            (row.materialName?.toLowerCase() || '').includes(searchInfo.materialName.toLowerCase())
        )
        setSearchRows(filtered)
    }
    const handleReset = () => {
        setIsSearch(false)
        setSearchInfo({
            companyName: '',
            materialNo: '',
            materialName: '',
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
            title: '원자재 입고 등록',
            text: '원자재 입고 등록이 완료되었습니다.'
        })
        setAlertOpen(true)

        setTimeout(() => setAlertOpen(false), 2000)
    }
    const handleAlertFail = () => {
        setAlertInfo({
            type: 'error',
            title: '원자재 입고 등록',
            text: '원자재 입고 등록 실패'
        })
        setAlertOpen(true)

        setTimeout(()=> setAlertOpen(false), 3000)
    }

    // 입고
    const handleInput = async (row: RowData) => {
        console.log('row값', row)

        try {
            await createMaterialInput({
                materialId: row.materialId,
                materialInputQty: row.materialInputQty,
                materialInputDate: row.materialInputDate,
                makeDate: row.makeDate
            })
            handleAlertSuccess()
            BoardRefresh()
        } catch(err) {
            const axiosError = err as AxiosError;
            console.error(err)
            if (axiosError.response && axiosError.response.data) {
                handleAlertFail()
                // alert((axiosError.response.data as AxiosError).message || "저장을 실패했습니다.");
            } else {
                handleAlertFail()
            }
        }
    }

    /* ExcelBtn Props */
    interface ExcelData {
        idx: number;
        companyName: string;
        materialName: string;
        materialNo: string;
        spec: string;
        maker: string;
    }
    // 엑셀 컬럼 헤더 매핑 정의
    const headerMap: Record<keyof ExcelData, string> = {
        idx: 'Seq',
        companyName: '기업명',
        materialName: '품목명',
        materialNo: '품목번호',
        spec: '규격',
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
        { field: 'idx', headerName: 'No', width: 70, headerAlign: 'center', align: 'center' },
        { field: 'companyName', headerName: '매입처명', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'center' },
        { field: 'materialNo', headerName: '품목번호', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
        { field: 'materialName', headerName: '품목명', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'center' },
        { field: 'spec', headerName: '규격', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
        { field: 'maker', headerName: '제조사', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
        { field: 'materialInputQty', headerName: '입고수량', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'right',
            renderCell: (params) => (
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
         },
        { field: 'materialInputDate', headerName: '입고일자', flex: 2, minWidth: 200, headerAlign: 'center', align: 'center',
            renderCell: (params) => (
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
            ),
        },
        { field: 'makeDate', headerName: '제조일자', flex: 2, minWidth: 200, headerAlign: 'center', align: 'center',
            renderCell: (params) => (
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
            ),
        },
        { field: 'inputbtn', headerName: '등록', width: 100, headerAlign: 'center', align: 'center',
            renderCell: (params) => (
                <CustomBtn
                  width="50px"
                  text="등록"
                  icon="check"
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
                    <CustomBC text="입고 등록" subText='원자재 입출고 관리' />
                    {/* Content 영역 */}
                    <Box sx={{padding: 2}}>
                        <SearchBar onSearch={handleSearch} onReset={handleReset}>
                            <LabelInput 
                                labelText='매입처명'
                                value={searchInfo.companyName}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearchChange('companyName', e.target.value)}
                            />
                            <LabelInput 
                                labelText='품목번호'
                                value={searchInfo.materialNo}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearchChange('materialNo', e.target.value)}
                            />
                            <LabelInput 
                                labelText='품목명'
                                value={searchInfo.materialName}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearchChange('materialName', e.target.value)}
                            />
                        </SearchBar>
                    </Box>
                    <Box>
                        <Box
                            sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
                        >
                            <Typography sx={{ fontSize: '24px', fontWeight: 'bold', paddingLeft: 2 }}>원자재 품목 입고 등록</Typography>
                            <Box sx={{paddingRight: 2}}>
                                <ExcelBtn mappingdata={excelData} sheetName="원자재 입고 등록" fileName="원자재 입고 등록" />
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