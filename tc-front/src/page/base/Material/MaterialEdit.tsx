import { useState, useEffect } from 'react'
import { Box, Typography, Dialog, type SelectChangeEvent } from '@mui/material'
import CustomBtn from '../../../component/CustomBtn';
import LabelInput from '../../../component/LabelInput';
import LabelSelect from '../../../component/LabelSelect';
import AlertPopup from '../../../component/AlertPopup';
import { getCompanies } from '../../../api/CompanyApi'
import { updateMaterial } from '../../../api/materialApi'
import type { AxiosError } from 'axios';

interface MaterialDataType {
    id?: number;
    materialId?: number;
    companyId?: number;
    companyName?: string;
    materialNo?: string;
    materialName?: string;
    category?: string;
    color?: string;
    spec?: string;
    specValue?: string;
    maker?: string;
    remark?: string;
    isActive?: string;
}

interface EditProps {
    row: MaterialDataType;
    doFinish: ()=> void;
    doCancle: ()=> void;
}
interface AlertInfo {
  type?: 'error' | 'warning' | 'info' | 'success';
  title?: string;
  text?: string;
}

export default function MaterialEdit({row, doFinish, doCancle}:EditProps) {
    const [editData, setEditData] = useState<MaterialDataType>(row)

    const [listCompany, setListCompany] = useState<{id:string; name:string}[]>([])
    const [listActiveYN] = useState([
        {id: 'Y', name: 'Y'},
        {id: 'N', name: 'N'},
    ])

    const [alertOpen, setAlertOpen] = useState(false)
    const [alertInfo, setAlertInfo] = useState<AlertInfo>({})
    
    const getCompanyData = async () => {
        try {
            const data = await getCompanies();

            const result = data
            .filter((row) => row.companyType === '매입처')
            .map((row) => ({
                id: String(row.companyId),
                name: row.companyName
            }))
            setListCompany(result)
        } catch (err) {
            console.error(err);
            alert("조회 실패")
        }
    }

    useEffect(()=> {
        getCompanyData();
    }, [])

    const handleSelectCompanyChange = (event: SelectChangeEvent<string>) => {
        const selectedId = event.target.value;
        const selectedCompany = listCompany.find(c => c.id === selectedId)

        if(selectedCompany) {
            setEditData(prev => ({
                ...prev,
                companyId: Number(selectedCompany.id),
                companyName: selectedCompany.name,
            }))
        }
    }
    const handleSelectActiveYNChange = (event: SelectChangeEvent<string>) => {
        const selectedId = event.target.value;
        const selectedActiveYN = listActiveYN.find(c => c.id === selectedId)

        if(selectedActiveYN) {
            setEditData(prev => ({
                ...prev,
                isActive: selectedActiveYN.name,
            }))
        }
    }

    const handleInputChange = (key: keyof typeof editData, value: string) => {
        setEditData((prev) => ({ ...prev, [key]: value }));
    };


    const handleEdit = async () => {
        try {
            if (!editData.id) {
              console.error("❌ 수정할 데이터에 id가 없습니다.");
              return;
            }
            await updateMaterial(editData.id, {
                companyId: editData.companyId,
                materialName: editData.materialName,
                materialNo: editData.materialNo,
                category: editData.category,
                color: editData.color,
                spec: editData.spec,
                specValue: editData.specValue,
                maker: editData.maker,
                isActive: editData.isActive,
                remark: editData.remark,
            }).then(()=>{
                handleAlertSuccess()
                doFinish()
            })
        } catch(err) {
            const axiosError = err as AxiosError;
            console.error(err)
            if (axiosError.response && axiosError.response.data) {
                handleAlertFail()
                // alert((axiosError.response.data as AxiosError).message || "저장을 실패했습니다.");
            } else {
                handleAlertFail()
            }
        }
    }

    const handleCancle = () => {
        setEditData(row)
        doCancle()
    }

    /* Alert 팝업 */
    const handleCloseAlert = () => {
        setAlertOpen(false)
    }
    const handleAlertSuccess = () => {
        setAlertInfo({
            type: 'success',
            title: '원자재 수정',
            text: '원자재 정보 수정 성공'
        })
        setAlertOpen(true)

        setTimeout(() => setAlertOpen(false), 2000)
    }
    const handleAlertFail = () => {
        setAlertInfo({
            type: 'error',
            title: '원자재 수정',
            text: '원자재 정보 수정 실패'
        })
        setAlertOpen(true)

        setTimeout(()=> setAlertOpen(false), 3000)
    }

    return (
        <Box sx={{
            width: '750px',
            height: '550px',
            backgroundColor: 'white',
            
        }}>
            {/* 데이터 입력 폼 */}
            <Box sx={{ width: '700px'}}>
                <Box sx={{display:'flex', justifyContent: 'space-between'}}>
                    <Typography sx={{fontSize: '45px', padding: 2, fontWeight: 'bold'}}>원자재 수정</Typography>
                    {/* 버튼 영역 */}
                    <Box 
                        sx={{ 
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            gap: 2
                        }}
                    >
                        <CustomBtn text='수정' backgroundColor='green' onClick={handleEdit} />
                        <CustomBtn text='취소' backgroundColor='gray' onClick={handleCancle} />
                    </Box>
                </Box>
                <Box sx={{ border: '3px solid green', marginLeft: 2, paddingRight: 2, paddingBottom: 2}}>
                    <Box sx={{display: 'flex'}}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2, width: '350px', height: '230px', marginTop: '20px'}}>
                            {listCompany.length > 0 && (
                                <LabelSelect 
                                    color='black'
                                    labelText='매입처명'
                                    value={editData.companyId?.toString() || ''}
                                    onChange={handleSelectCompanyChange}
                                    options={listCompany}
                                />
                            )}
                            <LabelInput 
                                color='black'
                                labelText='품목번호'
                                value={editData.materialNo}
                                onChange={(e) => handleInputChange('materialNo', e.target.value)}
                            />
                            <LabelInput 
                                color='black'
                                labelText='분류'
                                value={editData.category}
                                onChange={(e) => handleInputChange('category', e.target.value)}
                            />
                            <LabelInput 
                                color='black'
                                labelText='규격'
                                value={editData.spec}
                                onChange={(e) => handleInputChange('spec', e.target.value)}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2, width: '350px', height: '230px', marginTop: '20px'}}>
                            <LabelSelect 
                                color='black'
                                labelText='사용여부'
                                value={editData.isActive?.toString() || ''}
                                onChange={handleSelectActiveYNChange}
                                options={listActiveYN}
                            />
                            <LabelInput 
                                color='black'
                                labelText='품목명'
                                value={editData.materialName}
                                onChange={(e) => handleInputChange('materialName', e.target.value)}
                            />
                            <LabelInput 
                                color='black'
                                labelText='색상'
                                value={editData.color}
                                onChange={(e) => handleInputChange('color', e.target.value)}
                            />
                            
                            <LabelInput 
                                color='black'
                                labelText='제원'
                                value={editData.specValue}
                                onChange={(e) => handleInputChange('specValue', e.target.value)}
                            />
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2, marginTop: 1}}>
                        <LabelInput 
                                color='black'
                                labelText='제조사'
                                value={editData.maker}
                                inputWidth='562px'
                                onChange={(e) => handleInputChange('maker', e.target.value)}
                            />
                        <LabelInput 
                            color='black'
                            labelText='비고'
                            value={editData.remark}
                            inputWidth='562px'
                            onChange={(e) => handleInputChange('remark', e.target.value)}
                        />
                    </Box>
                </Box>
            </Box>
            {/* 팝업창 */}
            <Dialog open={alertOpen} onClose={handleCloseAlert}>
                <AlertPopup 
                    type={alertInfo.type} 
                    title={alertInfo.title} 
                    text={alertInfo.text} 
                />
            </Dialog>
        </Box>
    )
}