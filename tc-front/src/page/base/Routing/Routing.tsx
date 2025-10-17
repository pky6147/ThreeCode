import { useEffect, useState } from 'react'
import { Box, Typography, Card, Dialog } from '@mui/material'
import CustomBC from '../../../component/CustomBC';
import CustomBtn from '../../../component/CustomBtn';
import CommonTable from '../../../component/CommonTable';
import type { GridColDef } from '@mui/x-data-grid'
import RoutingReg from './RoutingReg'
import { deleteRouting, getRoutings } from '../../../api/routingApi';
import RoutingEdit from './RoutingEdit';

interface RoutingType {
  processCode: string;
  processName: string;
  processTime: number;
  processOrder: number;
  remark?: string;
  routingMasterId: number; // 백엔드 ID
  id?: number;  // DataGrid 필수
  idx?: number; // 번호 컬럼
}

function Routing() {
    const [rows, setRows] = useState<RoutingType[]>([]);
    const [open, setOpen] = useState(false);

    const [editOpen, setEditOpen] = useState(false);
    const [editData, setEditData] = useState<RoutingType | null>(null);

    const qData = async () => {
      try {
        const data: RoutingType[] = await getRoutings();

        const result = data.map((row, index) => ({
          ...row,
          id: row.routingMasterId, // DataGrid id
          idx: index + 1,          // 번호 컬럼
        }));

        setRows(result);
      } catch (err) {
        console.error(err);
        alert("조회 실패!");
      }
    };

    useEffect(() => {
        qData();
    }, []);

    const tableRefresh = () => {
        qData();
    }

    const columns: GridColDef[] = [
        { field: 'idx', headerName: 'No', width: 70, headerAlign: 'center', align: 'center' },
        { field: 'processCode', headerName: '공정코드', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
        { field: 'processName', headerName: '공정명', flex: 1.5, minWidth: 200, headerAlign: 'center', align: 'center' },
        { field: 'processOrder', headerName: '공정순서', flex: 1.5, minWidth: 200, headerAlign: 'center', align: 'center' },
        { field: 'processTime', headerName: '공정시간(h)', flex: 1, minWidth: 100, headerAlign: 'center', align: 'center' },
        { field: 'remark', headerName: '비고', flex: 3, minWidth: 500, headerAlign: 'center', align: 'center' },
        { field: 'edit', headerName: '수정', width: 100, headerAlign: 'center', align: 'center',
            renderCell: (params) => (
              <CustomBtn
                width="50px"
                text="수정"
                icon="edit"
                onClick={() => handleEdit(params.row)}
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
                onClick={() => handleDelete(params.row.routingMasterId)}
              >
              </CustomBtn>
            ),
        },
    ]

    const handleRegist = () => {
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    }
    const handleRegistFinish = () => {
        tableRefresh();
        handleClose();
    }

    const handleEdit = (row: RoutingType) => {
        setEditData(row);
        setEditOpen(true);
    };

    const handleEditClose = () => {
        setEditOpen(false);
    };





    //삭제
    const handleDelete = async (id: number) => {
        if (!confirm("정말 삭제하시겠습니까?")) return;

        try {
            await deleteRouting(id);
            alert("삭제되었습니다.");

    // 삭제 후 테이블 새로고침
         setRows((prev) => {
      const newRows = prev.filter(row => row.routingMasterId !== id);
      return newRows.map((row, index) => ({
        ...row,
        idx: index + 1,   // idx 순차 재계산
      }));
    });
  } catch (err) {
    console.error(err);
    alert("삭제 실패!");
  }
        };

    return (
        <Card
            sx={{ height: '98%', margin: '0.5%'}}
        >
            <Box>
                {/* Breadcrumbs 영역 */}
                <CustomBC text="라우팅 관리" subText='기준정보 관리' />
                {/* Content 영역 */}
                <Box>
                    <Box
                        sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2}}
                    >
                        <Typography sx={{ fontSize: '24px', fontWeight: 'bold', paddingLeft: 2 }}>라우팅 정보</Typography>
                        <Box sx={{paddingRight: 2}}>
                            <CustomBtn 
                                text="등록"
                                backgroundColor='green'
                                icon="add"
                                onClick={()=> handleRegist()}
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

            
            <Dialog open={open} onClose={handleClose} //저장
                maxWidth={false}
            >
                <RoutingReg doClose={handleRegistFinish} />
            </Dialog>

            <Dialog open={editOpen} onClose={handleEditClose} maxWidth={false}>
            {editData && (
                <RoutingEdit 
                data={editData} 
                doClose={handleEditClose} 
                onUpdated={tableRefresh} 
                />
            )}
</Dialog>


        </Card>

        
    )
}

export default Routing;