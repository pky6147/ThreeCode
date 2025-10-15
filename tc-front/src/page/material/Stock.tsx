import { useState, useEffect } from 'react'
import { Box, Breadcrumbs, Typography, Card } from '@mui/material'
import CustomBtn from '../../component/CustomBtn';
import CommonTable from '../../component/CommonTable';
import type { GridColDef } from '@mui/x-data-grid'

interface RowData {
    id: number;
    idx: number;
    company_name: string;
    material_no: string;
    material_name: string;
    spec: string;
    maker: string;
    count?: number | string; // 재고량   
}

function Stock() {
    const [rows, setRows ] = useState<RowData[]>([])

    useEffect(()=> {
        // Get 구문이 들어와야함

        const baseRow = [
            { id: 1, idx: 1, company_name: '업체A', material_no: 'M001', material_name: 'A페인트', spec: 'Kg', maker: 'ㅁ제조사', count: 500 },
            { id: 2, idx: 2, company_name: '업체B', material_no: 'M002', material_name: 'B신나', spec: 'L', maker: 'ㅁ제조사', count: 500 },
            { id: 3, idx: 3, company_name: '업체1', material_no: 'M010', material_name: 'C세척제', spec: '통', maker: 'ㅇ제조사', count: 500 },
            { id: 4, idx: 4, company_name: '업체2', material_no: 'M100', material_name: 'D경화제', spec: '통', maker: 'ㅇ제조사', count: 500 },
        ]

        const result = baseRow.map(r => ({
            ...r, 
            count: r.count // 재고량 계산해서 db에서 갖고올것
        }))
        setRows(result)

    }, [])

    const columns: GridColDef[] = [
        { field: 'idx', headerName: 'No', width: 70, headerAlign: 'center', align: 'center' },
        { field: 'company_name', headerName: '매입처명', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'center' },
        { field: 'material_no', headerName: '품목번호', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
        { field: 'material_name', headerName: '품목명', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'center' },
        { field: 'spec', headerName: '규격', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
        { field: 'maker', headerName: '제조사', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
        { field: 'count', headerName: '재고량', flex: 1.5, minWidth: 150, headerAlign: 'center', align: 'right',
            renderCell: (params) => {
                return params.value?.toLocaleString();
            }
        },
    ]
        

    return (
            <Card
                sx={{ height: '98%', margin: '0.5%'}}
            >
                <Box>
                    {/* Breadcrumbs 영역 */}
                    <Breadcrumbs sx={{padding: 2}}>
                        <Typography sx={{ color: 'text.primary' }}>원자재 입출고 관리</Typography>
                        <Typography sx={{ color: 'text.primary', fontWeight: 'bold' }}>재고 현황</Typography>
                    </Breadcrumbs>
                    {/* Content 영역 */}
                    <Box>
                        <Box
                            sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
                        >
                            <Typography sx={{ fontSize: '24px', fontWeight: 'bold', paddingLeft: 2 }}>재고 현황</Typography>
                            <Box sx={{paddingRight: 2}}>
                                <CustomBtn 
                                    text="엑셀"
                                    backgroundColor='green'
                                />
                            </Box>
                        </Box>

                        <Box sx={{padding: 2}}>
                            <CommonTable 
                                columns={columns}
                                rows={rows}
                                // pageSize={10}
                                // check={true}
                                // height={630}
                            />
                        </Box>
                    </Box>
                </Box>
            </Card>
    )
}

export default Stock;