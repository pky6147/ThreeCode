import { useState, useEffect } from 'react'
import { Box, Typography, Card } from '@mui/material'
import CustomBC from '../../component/CustomBC';
// import CustomBtn from '../../component/CustomBtn';
import CommonTable from '../../component/CommonTable';
import SearchBar from '../../component/SearchBar';
import LabelInput from '../../component/LabelInput';
import ExcelBtn from '../../component/ExcelBtn';
import type { GridColDef } from '@mui/x-data-grid'
import { getMaterialStock } from '../../api/materialStock'

export interface MaterialStockType {
    id?: number;
    idx: number;
    companyName: string;
    materialNo: string;
    materialName: string;
    spec: string;
    count?: number // 재고량   
    maker: string;
}


function Stock() {
    const [rows, setRows ] = useState<MaterialStockType[]>([])
    // Search
    const [searchInfo, setSearchInfo] = useState({
        companyName: '',
        materialNo: '',
        materialName: ''
    })
    const [searchRows, setSearchRows] = useState<MaterialStockType[]>([])
    const [isSearch, setIsSearch] = useState(false)

    const getStockData = async () => {
        try {
                const data = await getMaterialStock();

                const result = data.map((row: MaterialStockType, index: number) => ({
                    ...row,
                    id: index,
                    idx: index+1,
                }))
                setRows(result)
        } catch(err) {
            console.error(err)
            alert("조회 실패!")
        }
    }

    useEffect(()=> {
        getStockData()
    }, [])

    const columns: GridColDef[] = [
        { field: 'idx', headerName: 'No', width: 70, headerAlign: 'center', align: 'center' },
        { field: 'companyName', headerName: '매입처명', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'center' },
        { field: 'materialNo', headerName: '품목번호', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
        { field: 'materialName', headerName: '품목명', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'center' },
        { field: 'spec', headerName: '규격', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
        { field: 'maker', headerName: '제조사', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
        { field: 'count', headerName: '재고량', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'right',
            renderCell: (params) => {
                return params.value?.toLocaleString();
            }
        },
    ]

    /* 검색/초기화 관련함수 */
    const handleSearch = () => {
        setIsSearch(true)
        const filtered = rows.filter(row =>
            row.companyName.toLowerCase().includes(searchInfo.companyName.toLowerCase()) &&
            row.materialNo.toLowerCase().includes(searchInfo.materialNo.toLowerCase()) &&
            row.materialName.toLowerCase().includes(searchInfo.materialName.toLowerCase()) 
        )
        setSearchRows(filtered)
    }
    const handleReset = () => {
        setIsSearch(false)
        setSearchInfo({
            companyName: '',
            materialNo: '',
            materialName: ''
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
        materialNo: string;
        materialName: string;
        spec: string;
        count: number;
        maker: string;
    }
    // 엑셀 컬럼 헤더 매핑 정의
    const headerMap: Record<keyof ExcelData, string> = {
        idx: 'Seq',
        companyName: '매입처명',
        materialNo: '품목번호',
        materialName: '품목명',
        spec: '규격',
        count: '재고량',        
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

    return (
            <Card
                sx={{ height: '98%', margin: '0.5%'}}
            >
                <Box>
                    {/* Breadcrumbs 영역 */}
                    <CustomBC text="재고 현황" subText='원자재 입출고 관리' />
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
                        </SearchBar>
                    </Box>
                    <Box>
                        <Box
                            sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
                        >
                            <Typography sx={{ fontSize: '24px', fontWeight: 'bold', paddingLeft: 2 }}>재고 현황</Typography>
                            <Box sx={{paddingRight: 2}}>
                                <ExcelBtn mappingdata={excelData} sheetName="원자재 재고 현황" fileName="원자재 재고 현황" />
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
    )
}

export default Stock;