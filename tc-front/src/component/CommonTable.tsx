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
          getRowClassName={(params) =>
            params.row.isActive === 'N' ? 'row-inactive' : ''
          }
          sx={{
              '&': {
                  '--DataGrid-t-header-background-base': '#1e88e5 !important' // 헤더색 변경
              },
              '& .MuiDataGrid-columnHeaders': { 
                  color: '#fff', // 헤더 글자색 
                  fontSize: 16, // 글자 크기 
                  fontWeight: 'bold', // 굵기 
              }, 
              '& .row-inactive': {
                backgroundColor: '#f5f5f5',  // 회색 배경
                color: '#999',               // 글자색
                fontStyle: 'italic',
              },
          }}
        />
      </Paper>
    );
}

export default CommonTable;

