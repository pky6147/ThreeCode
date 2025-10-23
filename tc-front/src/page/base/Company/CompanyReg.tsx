import { useState, useEffect } from 'react';
import { TextField, Button, Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import '../../../css/CompanyReg.css'
import { createCompany, updateCompany } from '../../../api/CompanyApi';

interface CompanyFormProps {
  mode: 'create' | 'edit'; // 등록 or 수정 모드
  initialData?: any;       // 수정 시 기존 데이터
  onSubmit?: () => void;   // 저장 후 콜백
  onClose?: () => void;    // 닫기 버튼 콜백
} 

function CompanyForm({ mode, initialData, onSubmit, onClose }: CompanyFormProps) {
  const [form, setForm] = useState({
    companyType: '',
    companyName: '',
    ceoName: '',
    ceoPhone: '',
    address: '',
    remark: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    contactAddress: '',
    contactRemark: '',
    isActive: 'Y', // 기본값 사용
  });

  //수정 모드일 때 기존 데이터 채워넣기
  useEffect(() => {
  if (mode === 'edit' && initialData) {
    // console.log('initialData', initialData)
    setForm({
      companyType: initialData.companyType || '',
      companyName: initialData.companyName || '',
      ceoName: initialData.ceoName || '',
      ceoPhone: initialData.ceoPhone || '',
      address: initialData.address || '',
      remark: initialData.remark || '',
      contactName: initialData.contactName || '',   
      contactPhone: initialData.contactPhone || '',
      contactEmail: initialData.contactEmail || '',
      contactAddress: initialData.contactAddress || '', 
      contactRemark: initialData.contactRemark || '',   
      isActive: initialData.isActive || 'Y',
    });
  }
}, [mode, initialData]);

//폼 변경 처리
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  //등록/수정 처리
  const handleSubmit = async () => {
  // 필수 입력값 체크 (비고 제외)
  const requiredFields = [
    { key: 'companyType', label: '업체유형' },
    { key: 'companyName', label: '업체명' },
    { key: 'ceoName', label: '대표명' },
    { key: 'ceoPhone', label: '대표 전화번호' },
    { key: 'address', label: '주소' },
    { key: 'contactName', label: '담당자명' },
    { key: 'contactPhone', label: '담당자 전화번호' },
    { key: 'contactEmail', label: '담당자 이메일' },
  ];

  for (const field of requiredFields) {
    const value = form[field.key as keyof typeof form];
    if (!value || !value.toString().trim()) {
      alert(`${field.label}을(를) 입력해주세요.`);
      return;
    }
  }

  // 전화번호 형식 체크 (대표 + 담당자)
  const phoneRegex = /^\d{3}-\d{3,4}-\d{4}$/;
  if (!phoneRegex.test(form.ceoPhone)) {
    alert('대표 전화번호 형식이 올바르지 않습니다. 예: 010-1234-5678');
    return;
  }
  if (!phoneRegex.test(form.contactPhone)) {
    alert('담당자 전화번호 형식이 올바르지 않습니다. 예: 010-1234-5678');
    return;
  }

  try {
    if (mode === 'edit' && initialData?.companyId) {
      await updateCompany(initialData.companyId, form);
      alert('업체 정보가 수정되었습니다.');
    } else {
      await createCompany(form);
      alert('업체가 등록되었습니다.');
    }
    if (onSubmit) onSubmit();
  } catch (err) {
    console.error(err);
    alert('저장 중 오류가 발생했습니다.');
  }
};


  return (
    <div className="company-container">
  <Typography variant="h5">{mode === 'edit' ? '업체 수정' : '업체 등록'}</Typography>

  <Typography className="company-section-title">기본 정보</Typography>
  <div className="company-form-grid">
    <FormControl component="fieldset">
      <FormLabel component="legend">업체유형</FormLabel>
      <RadioGroup row name="companyType" value={form.companyType} onChange={handleChange}>
        <FormControlLabel value="거래처" control={<Radio />} label="거래처" />
        <FormControlLabel value="매입처" control={<Radio />} label="매입처" />
      </RadioGroup>
    </FormControl>

    {/* 업체명만 한 줄 전체로 */}
  <TextField label="업체명" name="companyName" value={form.companyName} onChange={handleChange} fullWidth className="full-width"/>
    <TextField label="대표명" name="ceoName" value={form.ceoName} onChange={handleChange} fullWidth />
    <TextField label="대표 전화번호" name="ceoPhone" value={form.ceoPhone} onChange={handleChange} fullWidth placeholder='010-0000-0000'/>
    <TextField label="주소" name="address" value={form.address} onChange={handleChange} fullWidth />
    <TextField label="비고" name="remark" value={form.remark} onChange={handleChange} fullWidth />
  </div>

  <Typography className="company-section-title">상세 정보</Typography>
  <div className="company-form-grid">
    <TextField label="담당자명" name="contactName" value={form.contactName} onChange={handleChange} fullWidth />
    <TextField label="담당자 전화번호" name="contactPhone" value={form.contactPhone} onChange={handleChange} fullWidth placeholder='010-0000-0000' />
    <TextField label="담당자 이메일" name="contactEmail" value={form.contactEmail} onChange={handleChange} fullWidth placeholder="test@0000.com" />
  </div>

  {mode === 'edit' && (
    <FormControl component="fieldset" style={{ marginTop: 16 }}>
      <FormLabel component="legend">사용여부</FormLabel>
      <RadioGroup row name="isActive" value={form.isActive} onChange={handleChange}>
        <FormControlLabel value="Y" control={<Radio />} label="사용" />
        <FormControlLabel value="N" control={<Radio />} label="미사용" />
      </RadioGroup>
    </FormControl>
  )}

  {/* 버튼 그룹 */}
<div className="company-button-group">
  <Button variant="contained" color="primary" onClick={handleSubmit}>
    {mode === 'edit' ? '수정 완료' : '등록'}
  </Button>

  {onClose && (
    <Button variant="outlined" color="secondary" onClick={onClose}>
      닫기
    </Button>
  )}
</div>
</div>
  )}

export default CompanyForm;
