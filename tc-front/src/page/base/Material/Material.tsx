import { useState, useEffect } from 'react'
import { Box, Typography, Card, Dialog, type SelectChangeEvent } from '@mui/material'
import CustomBC from '../../../component/CustomBC';
import CustomBtn from '../../../component/CustomBtn';
import CommonTable from '../../../component/CommonTable';
import type { GridColDef } from '@mui/x-data-grid'
import LabelInput from '../../../component/LabelInput';
import LabelSelect from '../../../component/LabelSelect'
import SearchBar from '../../../component/SearchBar';
import MaterialReg from './MaterialReg';
import MaterialDetailView from './MaterialDetailView';
import MaterialEdit from './MaterialEdit';
import { getMaterial, deleteMaterial } from '../../../api/materialApi';
import AlertPopup, { type AlertProps}  from '../../../component/AlertPopup';
import ExcelBtn from '../../../component/ExcelBtn';

interface RowData {
    id?: number;
    idx?: number;
    materialId?: number;
    companyId?: number;
    companyName?: string;
    materialNo?: string;
    materialName?: string;
    category?: string;
    color?: string;
    spec?: string;
    specValue: string;
    maker?: string;
    remark?: string;
    isActive?: string;
}

function Material() {
    const [rows, setRows ] = useState<RowData[]>([]) // tableData
    const [clickedRow, setClickedRow] = useState<RowData>(rows[0])
    /* Search */
    const [searchInfo, setSearchInfo] = useState({
            companyName: '',
            materialNo: '',
            materialName: '',
            isActive: 'Y',
        })
    const [listActiveYN] = useState<{id: string; name:string}[]>([
            {id: 'Y', name: 'Y'},
            {id: 'N', name: 'N'},
    ])
    const [searchRows, setSearchRows] = useState<RowData[]>([])
    const [isSearch, setIsSearch] = useState(false)
    /* Dialog open */
    const [open, setOpen] = useState(false) // Reg on/off
    const [openDetail, setOpenDetail] = useState(false) // Detail on/off
    const [openEdit, setOpenEdit] = useState(false) // Edit on/off
    /* Alert */
    const [alertOpen, setAlertOpen] = useState(false)
    const [alertInfo, setAlertInfo] = useState<AlertProps>({})
    

    const getTableData = async () => {
        try {
            const data = await getMaterial();
            
            const result = data.map((row: RowData, index: number) => ({
                ...row,
                id: row.materialId,
                idx: index+1,
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

    /* 검색/초기화 관련함수 */
    const handleSelectChange = (event: SelectChangeEvent<string>) => {
            const selectedId = event.target.value;
            const selectedActive = listActiveYN.find(c => c.id === selectedId)
    
            if(selectedActive) {
                setSearchInfo(prev => ({
                    ...prev,
                    // company_id: selectedActive.id,
                    isActive: selectedActive.name,
                }))
            }
    }

    const handleSearch = () => {
        setIsSearch(true)
        const filtered = rows.filter(row =>
            (row.companyName?.toLowerCase() || '').includes(searchInfo.companyName.toLowerCase()) &&
            (row.materialNo?.toLowerCase() || '').includes(searchInfo.materialNo.toLowerCase()) &&
            (row.materialName?.toLowerCase() || '').includes(searchInfo.materialName.toLowerCase()) &&
            (row.isActive?.toLowerCase() || '').includes(searchInfo.isActive.toLowerCase()) 
        )
        setSearchRows(filtered)
    }
    const handleReset = () => {
        setIsSearch(false)
        setSearchInfo({
            companyName: '',
            materialNo: '',
            materialName: '',
            isActive: 'Y'
        })
        setSearchRows(rows)
    }
    const handleSearchChange = (key: keyof typeof searchInfo, value: string) => {
        setSearchInfo((prev) => ({ ...prev, [key]: value }));
    };

    /* 등록 페이지 */
    const handleOpenReg = () => {
        setOpen(true)
    }
    const handleCloseReg = () => {
        setOpen(false)
    }
    const handleRegDone = () => {
        BoardRefresh()
        handleCloseReg()
    }
    /* 수정 페이지 */
    const handleOpenEdit = (row: RowData) => {
        setClickedRow(row)
        setOpenEdit(true)
    }
    const handleCloseEdit = () => {
        setOpenEdit(false)
    }
    const handleEditDone = () => {
        BoardRefresh()
        handleCloseEdit()
    }

    /* 품목명 클릭시 상세조회 */
    const handleOpenDetail = (row: RowData) => {
        setClickedRow(row)
        setOpenDetail(true)
    }
    const handleCloseDetail = () => {
        setOpenDetail(false)
    }
    /* 삭제 */
    const handleDelete = async (id: number) => {
        if (!confirm("정말 삭제하시겠습니까?")) return;
        
        try {
            await deleteMaterial(id).then(()=>{
                handleAlertSuccess()
                BoardRefresh()
            })
        } catch(err) {
            console.error(err);
            handleAlertFail()
        }
    }

    /* Alert 팝업 */
    const handleCloseAlert = () => {
        setAlertOpen(false)
    }
    const handleAlertSuccess = () => {
        setAlertInfo({
            type: 'success',
            title: '삭제',
            text: '데이터 삭제 성공'
        })
        setAlertOpen(true)

        setTimeout(() => setAlertOpen(false), 2000)
    }
    const handleAlertFail = () => {
        setAlertInfo({
            type: 'error',
            title: '데이터 삭제',
            text: '데이터 삭제 실패'
        })
        setAlertOpen(true)

        setTimeout(()=> setAlertOpen(false), 3000)
    }

    /* ExcelBtn Props */
    interface ExcelData {
        idx: number;
        companyName: string;
        materialName: string;
        materialNo: string;
        spec: string;
        maker: string;
        remark: string;
        isActive: string;
    }
    // 엑셀 컬럼 헤더 매핑 정의
    const headerMap: Record<keyof ExcelData, string> = {
        idx: 'Seq',
        companyName: '기업명',
        materialName: '품목명',
        materialNo: '품목번호',
        spec: '규격',
        maker: '제조사',
        remark: '비고',
        isActive: '사용여부'
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
    

    /* 테이블 헤더 */
    const columns: GridColDef[] = [
        { field: 'idx', headerName: 'No', width: 70, headerAlign: 'center', align: 'center' },
        { field: 'companyName', headerName: '매입처명', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'center' },
        { field: 'materialNo', headerName: '품목번호', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
        { field: 'materialName', headerName: '품목명', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'center',
            renderCell: (params) => (
            <Typography
                variant="body2"
                sx={{ 
                    cursor: 'pointer', color: 'blue', //textDecoration: 'underline',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    height: '100%', width: '100%', fontWeight: 'bold', fontSize: 16
                }}
                onClick={()=> handleOpenDetail(params.row)}
            >
              {params.value}
            </Typography>
          ),
         },
        { field: 'spec', headerName: '규격', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
        { field: 'maker', headerName: '제조사', flex: 2, minWidth: 200, headerAlign: 'center', align: 'center' },
        { field: 'remark', headerName: '비고', flex: 3, minWidth: 400, headerAlign: 'center', align: 'left' },
        { field: 'isActive', headerName: '사용여부', width: 100, headerAlign: 'center', align: 'center' },
        { field: 'edit', headerName: '수정', width: 100, headerAlign: 'center', align: 'center',
            renderCell: (params) => (
          <CustomBtn
            width="50px"
            text="수정"
            icon="edit"
            onClick={() => handleOpenEdit(params.row)}
          >
          </CustomBtn>
        ),
         },
        { field: 'del', headerName: '삭제', width: 100, headerAlign: 'center', align: 'center',
            renderCell: (params) => (
                <CustomBtn
                  width="50px"
                  text="삭제"
                  backgroundColor='#fb1e1eff'
                  icon="delete"
                  onClick={() => handleDelete(params.row.materialId)}
                >
                </CustomBtn>
            ),
        },
    ]

    return (
        <Card
            sx={{ height: '98%', margin: '0.5%'}}
        >
            <Box>
                {/* Breadcrumbs 영역 */}
                <CustomBC text="원자재 관리" subText='기준정보 관리' />
                {/* Content 영역 */}
                {/* 검색필터 */}
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
                        <LabelSelect 
                            labelText='사용여부'
                            value={searchInfo.isActive?.toString() || ''}
                            fontSize={22}
                            onChange={handleSelectChange}
                            options={listActiveYN}
                        />
                    </SearchBar>
                </Box>
                <Box>
                    {/* 등록, 엑셀버튼 영역 */}
                    <Box
                        sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
                    >
                        <Typography sx={{ fontSize: '24px', fontWeight: 'bold', paddingLeft: 2 }}>원자재 정보</Typography>
                        <Box sx={{ display:'flex', paddingRight: 2, gap: 2}}>
                            <ExcelBtn mappingdata={excelData} sheetName="원자재품목" fileName="원자재품목" />
                            <CustomBtn 
                                text="등록"
                                icon="add"
                                backgroundColor='green'
                                onClick={handleOpenReg}
                            />
                        </Box>
                    </Box>
                    {/* 테이블 영역 */}
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
            {/* 등록 페이지 */}
            <Dialog open={open} onClose={handleCloseReg} maxWidth={false}>
                <MaterialReg doFinish={handleRegDone} doCancle={handleCloseReg} />
            </Dialog>
            {/* 품목명 클릭시 상세조회 */}
            <Dialog open={openDetail} onClose={handleCloseDetail} maxWidth={false}>
                <MaterialDetailView row={clickedRow} doCancle={handleCloseDetail} />
            </Dialog>
            {/* 수정 페이지 */}
            <Dialog open={openEdit} onClose={handleCloseEdit} maxWidth={false}>
                <MaterialEdit row={clickedRow} doFinish={handleEditDone} doCancle={handleCloseEdit} />
            </Dialog>
            {/* 팝업창 */}
            <Dialog open={alertOpen} onClose={handleCloseAlert}>
                <AlertPopup 
                    type={alertInfo.type} 
                    title={alertInfo.title} 
                    text={alertInfo.text} 
                />
            </Dialog>
        </Card>
    )
}

export default Material;