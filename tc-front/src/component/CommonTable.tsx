import { Paper } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef, GridRowsProp  } from '@mui/x-data-grid'

interface CommonTableProps {
  columns: GridColDef[];  // ✅ 컬럼 정의 타입
  rows: GridRowsProp;     // ✅ 행 데이터 타입
  pageSize?: number;      // ✅ 선택적 페이지 크기
  height?: number | string; // ✅ 선택적 높이
  width? : number | string;
  check?: boolean;
}

// 헤더 양식
// const columns: GridColDef[] = [
//   { field: 'id', headerName: 'ID', width: 70 },
//   { field: 'firstName', headerName: 'First name', width: 130 },
//   { field: 'lastName', headerName: 'Last name', width: 130 },
// ];
// 데이터 양식
// const rows = [
//   { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
//   { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
//   { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
//   { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
//   { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
//   { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
//   { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
//   { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
//   { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
// ];

function CommonTable(props: CommonTableProps) {
    const paginationModel = { page: 0, pageSize: props.pageSize || 5 };

    return (
      <Paper sx={{ height: props.height || 400, width: props.width || '100%' }}>
        <DataGrid
          rows={props.rows}
          columns={props.columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          checkboxSelection={props.check || false}
          sx={{
              '&': {
                  '--DataGrid-t-header-background-base': '#1e88e5 !important' // 헤더색 변경
              },
              '& .MuiDataGrid-columnHeaders': { 
                  color: '#fff', // 헤더 글자색 
                  fontSize: 16, // 글자 크기 
                  fontWeight: 'bold', // 굵기 
              }, 
          }}
        />
      </Paper>
    );
}

export default CommonTable;