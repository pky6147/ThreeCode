import {type OutputData} from './OutputState'
import '../../css/DeliveryNote.css';

interface MemoProps {
    rowData: OutputData
    handleClose: () => void;
}

export default function OutputMemo(props: MemoProps) {
    return (
        <>
        <div className="delivery-note-overlay" onClick={props.handleClose}></div>
        <div className="delivery-note-modal">
          <div className="delivery-note-header">
            <span className="delivery-note-title">출하증</span>
            <button className="delivery-note-close-btn" onClick={props.handleClose}>X</button>
          </div>
          <div className="delivery-note-content">
            <div className="delivery-note-row">
              <span className="delivery-note-label">출고번호</span>
              <span className="delivery-note-value">{props.rowData.productOutputNo}</span>
            </div>
            <div className="delivery-note-row">
              <span className="delivery-note-label">거래처명</span>
              <span className="delivery-note-value">{props.rowData.companyName}</span>
            </div>
            <div className="delivery-note-row">
              <span className="delivery-note-label">품목번호</span>
              <span className="delivery-note-value">{props.rowData.productNo}</span>
            </div>
            <div className="delivery-note-row">
              <span className="delivery-note-label">품목명</span>
              <span className="delivery-note-value">{props.rowData.productName}</span>
            </div>
            <div className="delivery-note-row">
              <span className="delivery-note-label">출고수량</span>
              <span className="delivery-note-value">{props.rowData.productOutputQty}</span>
            </div>
            <div className="delivery-note-row">
              <span className="delivery-note-label">입고일자</span>
              <span className="delivery-note-value">{props.rowData.productInputDate || '-'}</span>
            </div>
            <div className="delivery-note-row">
              <span className="delivery-note-label">출고일자</span>
              <span className="delivery-note-value">{props.rowData.productOutputDate}</span>
            </div>
          </div>
          <div className="delivery-note-actions">
            <button className="print-btn" onClick={() => window.print()}>인쇄</button>
            <button className="close-btn" onClick={props.handleClose}>닫기</button>
          </div>
        </div>
      </>
    )
}