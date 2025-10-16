import { useState, useEffect } from 'react'
import { Box, Breadcrumbs, Typography, Card, Dialog, type SelectChangeEvent } from '@mui/material'
import CustomBtn from '../../component/CustomBtn';
import CommonTable from '../../component/CommonTable';
import type { GridColDef } from '@mui/x-data-grid'
import LabelInput from '../../component/LabelInput';
import LabelSelect from '../../component/LabelSelect'
import SearchBar from '../../component/SearchBar';
import MaterialReg from './Material/MaterialReg';
import MaterialDetailView from './Material/MaterialDetailView';
import MaterialEdit from './Material/MaterialEdit';

interface RowData {
    id?: number;
    idx?: number;
    material_id?: number | string;
    company_id?: number | string;
    company_name?: string;
    material_no?: string;
    material_name?: string;
    category?: string;
    color?: string;
    spec?: string;
    spec_value?: number | string;
    maker?: string;
    remark?: string;
    is_active?: string;
}

function Material() {
    const [rows, setRows ] = useState<RowData[]>([]) // tableData
    const [clickedRow, setClickedRow] = useState<RowData>({})
    /* Search */
    const [searchInfo, setSearchInfo] = useState({
            company_name: '',
            material_no: '',
            material_name: '',
            is_active: 'Y',
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

    useEffect(()=> {
        // Get 구문이 들어와야함

        const baseRow = [
            { id: 1, idx: 1, company_id: 1, company_name: '업체A', material_no: 'A001', material_name: '빨강도료', category: '페인트', color: '빨강', spec: '10Kg', spec_value: '10', maker: '제조사A', remark: '비고1', is_active: 'Y' },
            { id: 2, idx: 2, company_id: 2, company_name: '업체B', material_no: 'B002', material_name: '파랑도료', category: '신나', color: '파랑', spec: '2L', spec_value: '20', maker: '제조사B', remark: '비고2', is_active: 'N' },
            { id: 3, idx: 3, company_id: 3, company_name: '업체1', material_no: 'C010', material_name: '초록도료', category: '세척제', color: '초록', spec: '2통', spec_value: '30', maker: '제조사C', remark: '비고3', is_active: 'Y' },
            { id: 4, idx: 4, company_id: 4, company_name: '업체2', material_no: 'D100', material_name: '노랑도료', category: '경화제', color: '노랑', spec: '5Kg', spec_value: '40', maker: '제조사D', remark: '비고4', is_active: 'N' },
        ]

        setRows(baseRow)

        
    }, [])

    const BoardRefresh = () => {
        console.log('테이블 리프레시')
    }

    /* 검색/초기화 관련함수 */
    const handleSelectChange = (event: SelectChangeEvent<string>) => {
            const selectedId = event.target.value;
            const selectedActive = listActiveYN.find(c => c.id === selectedId)
    
            if(selectedActive) {
                setSearchInfo(prev => ({
                    ...prev,
                    // company_id: selectedActive.id,
                    is_active: selectedActive.name,
                }))
            }
    }

    const handleSearch = () => {
        setIsSearch(true)
        const filtered = rows.filter(row =>
            (row.company_name?.toLowerCase() || '').includes(searchInfo.company_name.toLowerCase()) &&
            (row.material_no?.toLowerCase() || '').includes(searchInfo.material_no.toLowerCase()) &&
            (row.material_name?.toLowerCase() || '').includes(searchInfo.material_name.toLowerCase()) &&
            (row.is_active?.toLowerCase() || '').includes(searchInfo.is_active.toLowerCase()) 
        )
        setSearchRows(filtered)
    }
    const handleReset = () => {
        setIsSearch(false)
        setSearchInfo({
            company_name: '',
            material_no: '',
            material_name: '',
            is_active: 'Y'
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
    const handleDelete = (row: RowData) => {
        console.log('Delete', row)
    }

    /* 테이블 헤더 */
    const columns: GridColDef[] = [
        { field: 'idx', headerName: 'No', width: 70, headerAlign: 'center', align: 'center' },
        { field: 'company_name', headerName: '매입처명', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'center' },
        { field: 'material_no', headerName: '품목번호', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
        { field: 'material_name', headerName: '품목명', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'center',
            renderCell: (params) => (
            <Typography
                variant="body2"
                sx={{ 
                    cursor: 'pointer', textDecoration: 'underline', color: 'blue', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    height: '100%', width: '100%'}}
                onClick={()=> handleOpenDetail(params.row)}
            >
              {params.value}
            </Typography>
          ),
         },
        { field: 'spec', headerName: '규격', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
        { field: 'maker', headerName: '제조사', flex: 2, minWidth: 200, headerAlign: 'center', align: 'center' },
        { field: 'remark', headerName: '비고', flex: 3, minWidth: 400, headerAlign: 'center', align: 'left' },
        { field: 'is_active', headerName: '사용여부', width: 100, headerAlign: 'center', align: 'center' },
        { field: 'edit', headerName: '수정', width: 100, headerAlign: 'center', align: 'center',
            renderCell: (params) => (
          <CustomBtn
            width="50px"
            text="수정"
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
                  onClick={() => handleDelete(params.row)}
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
                <Breadcrumbs sx={{padding: 2}}>
                    <Typography sx={{ color: 'text.primary' }}>기준정보 관리</Typography>
                    <Typography sx={{ color: 'text.primary', fontWeight: 'bold' }}>원자재 관리</Typography>
                </Breadcrumbs>
                {/* Content 영역 */}
                {/* 검색필터 */}
                <SearchBar onSearch={handleSearch} onReset={handleReset}>
                    <LabelInput 
                        labelText='매입처명'
                        value={searchInfo.company_name}
                        onChange={(e) => handleSearchChange('company_name', e.target.value)}
                    />
                    <LabelInput 
                        labelText='품목번호'
                        value={searchInfo.material_no}
                        onChange={(e) => handleSearchChange('material_no', e.target.value)}
                    />
                    <LabelInput 
                        labelText='품목명'
                        value={searchInfo.material_name}
                        onChange={(e) => handleSearchChange('material_name', e.target.value)}
                    />
                    {/* <LabelInput 
                        labelText='사용여부'
                        value={searchInfo.is_active}
                        onChange={(e) => handleSearchChange('is_active', e.target.value)}
                    /> */}
                    <LabelSelect 
                        labelText='사용여부'
                        value={searchInfo.is_active?.toString() || ''}
                        onChange={handleSelectChange}
                        options={listActiveYN}
                    />
                </SearchBar>
                <Box>
                    {/* 등록, 엑셀버튼 영역 */}
                    <Box
                        sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
                    >
                        <Typography sx={{ fontSize: '24px', fontWeight: 'bold', paddingLeft: 2 }}>원자재 정보</Typography>
                        <Box sx={{paddingRight: 2}}>
                            <CustomBtn 
                                text="등록"
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
        </Card>
    )
}

export default Material;