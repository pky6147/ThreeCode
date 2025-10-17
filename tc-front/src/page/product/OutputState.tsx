import { useState, useEffect } from 'react'
import { Box, Breadcrumbs, Typography, Card } from '@mui/material'
// import CustomBC from '../../component/CustomBC';
import CustomBtn from '../../component/CustomBtn';
import CommonTable from '../../component/CommonTable';
import type { GridColDef } from '@mui/x-data-grid'
import { productOutputApi } from '../../api/ProductOutputApi';
import '../../css/DeliveryNote.css';

interface OutputData {
  id: number;
  productOutputId: number;
  product_output_no: string;
  company_name: string;
  product_no: string;
  product_name: string;
  category: string;
  paint_type: string;
  product_output_qty: number | string;
  product_output_date: string;
  product_input_date?: string; // 입고일자
  isEditing?: boolean;
}


function OutputState() {
  const [rows, setRows] = useState<OutputData[]>([]);
//   const [temp, setTemp] = useState<OutputData | null>(null);
  const [modalRow, setModalRow] = useState<OutputData | null>(null);
  // 모달 닫기
const handleCloseModal = () => setModalRow(null);

  // 출고 데이터 가져오기 
  const fetchData = async () => {
    try {
      const res = await productOutputApi.getAll();
      const mapped = res.data.map((item: any, i: number) => ({
        id: item.productOutputId ?? i + 1,
        productOutputId: item.productOutputId,
        product_output_no: item.productOutputNo || '-',
        company_name: item.companyName || '-',
        product_no: item.productNo || '-',
        product_name: item.productName || '-',
        category: item.category || '-',
        paint_type: item.paintType || '-',
        product_output_qty: item.productOutputQty ?? 0,
        product_output_date: item.productOutputDate || '-',
        product_input_date: item.productInputDate || '-', // 입고일자는 임시로 '-' 처리
        isEditing: false,
      }));
      setRows(mapped);
    } catch (err) {
      console.error(err);
      alert('출고 목록을 불러오는 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

//   const handleEdit = <K extends keyof OutputData>(id: number, field: K, value: OutputData[K]) => {
//     setRows(prev => prev.map(r => (r.id === id ? { ...r, [field]: value } : r)));
//   };

//   const handleSave = (row: OutputData) => {
//     alert('수정 기능은 아직 구현되지 않았습니다.');
//     setRows(prev => prev.map(r => (r.id === row.id ? { ...r, isEditing: false } : r)));
//   };

//   const handleCancel = (row: OutputData) => {
//     if (!temp) return;
//     setRows(prev =>
//       prev.map(r =>
//         r.id === row.id
//           ? { ...r, isEditing: false, product_output_qty: temp.product_output_qty, product_output_date: temp.product_output_date }
//           : r
//       )
//     );
//   };

//   const handleDelete = (row: OutputData) => {
//     alert('삭제 기능은 아직 구현되지 않았습니다.');
//   };

  // 출하증 모달
  const handleOpenDeliveryNote = (row: OutputData) => {setModalRow(row);};

  const columns: GridColDef[] = [
    { field: 'company_name', headerName: '거래처명', flex: 1 },
    { field: 'product_no', headerName: '품목번호', flex: 1 },
    { field: 'product_name', headerName: '품목명', flex: 1 },
    { field: 'product_output_qty', headerName: '출고수량', flex: 1 },
    { field: 'product_output_date', headerName: '출고일자', flex: 1 },
    { field: 'product_input_date', headerName: '입고일자', flex: 1 },
    { field: 'category', headerName: '분류', flex: 1 },
    {
      field: 'delivery_note',
      headerName: '출하증',
      width: 120,
      renderCell: (params) => (
        <CustomBtn text="출하증" backgroundColor="green" onClick={() => handleOpenDeliveryNote(params.row)} />
      ),
    },
  ];

return (
    <>
      <Card style={{ padding: 16 }}>
        <Breadcrumbs>
          <Typography>수주대상 입출고 관리</Typography>
          <Typography fontWeight="bold">출고 현황</Typography>
        </Breadcrumbs>

        <Box style={{ marginTop: 16, marginBottom: 16 }}>
          <CustomBtn text="엑셀" backgroundColor="green" onClick={() => alert('엑셀 다운로드 기능은 아직 구현되지 않았습니다.')} />
        </Box>

        <CommonTable columns={columns} rows={rows} />
      </Card>

      {/* 출하증 모달 */}
{modalRow && (
  <>
    <div className="delivery-note-overlay" onClick={handleCloseModal}></div>
    <div className="delivery-note-modal">
      <div className="delivery-note-header">
        <span className="delivery-note-title">출하증</span>
        <button className="delivery-note-close-btn" onClick={handleCloseModal}>X</button>
      </div>
      <div className="delivery-note-content">
        <div className="delivery-note-row">
          <span className="delivery-note-label">출고번호</span>
          <span className="delivery-note-value">{modalRow.product_output_no}</span>
        </div>
        <div className="delivery-note-row">
          <span className="delivery-note-label">거래처명</span>
          <span className="delivery-note-value">{modalRow.company_name}</span>
        </div>
        <div className="delivery-note-row">
          <span className="delivery-note-label">품목번호</span>
          <span className="delivery-note-value">{modalRow.product_no}</span>
        </div>
        <div className="delivery-note-row">
          <span className="delivery-note-label">품목명</span>
          <span className="delivery-note-value">{modalRow.product_name}</span>
        </div>
        <div className="delivery-note-row">
          <span className="delivery-note-label">출고수량</span>
          <span className="delivery-note-value">{modalRow.product_output_qty}</span>
        </div>
        <div className="delivery-note-row">
          <span className="delivery-note-label">입고일자</span>
          <span className="delivery-note-value">{modalRow.product_input_date || '-'}</span>
        </div>
        <div className="delivery-note-row">
          <span className="delivery-note-label">출고일자</span>
          <span className="delivery-note-value">{modalRow.product_output_date}</span>
        </div>
      </div>
      <div className="delivery-note-actions">
        <button className="print-btn" onClick={() => window.print()}>인쇄</button>
        <button className="close-btn" onClick={handleCloseModal}>닫기</button>
      </div>
    </div>
  </>
)}
</>
)
}


export default OutputState;