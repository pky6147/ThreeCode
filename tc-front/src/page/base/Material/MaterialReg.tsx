import { useState, useEffect } from 'react'
import { Box, Typography, type SelectChangeEvent, Dialog } from '@mui/material'
import CustomBtn from '../../../component/CustomBtn';
import LabelInput from '../../../component/LabelInput';
import LabelSelect from '../../../component/LabelSelect';
import { getCompanies } from '../../../api/CompanyApi'
import { createMaterial } from '../../../api/materialApi'
import type { AxiosError } from 'axios';
import AlertPopup from '../../../component/AlertPopup';

interface RegProps {
    doFinish: ()=> void;
    doCancle: ()=> void;
}

interface MaterialDataType {
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
interface AlertInfo {
  type?: 'error' | 'warning' | 'info' | 'success';
  title?: string;
  text?: string;
}

export default function MaterialReg({doFinish, doCancle}:RegProps) {
    const [newData, setNewData] = useState<MaterialDataType>({
        isActive: 'Y'
    })

    const [listCompany, setListCompany] = useState<{id:string; name:string}[]>([])
    const [listActiveYN] = useState([
        {id: 'Y', name: 'Y'},
        {id: 'N', name: 'N'},
    ])
    const [listCategory] = useState([
        {id: '페인트', name: '페인트'},
        {id: '신나', name: '신나'},
        {id: '세척제', name: '세척제'},
        {id: '경화제', name: '경화제'},
    ])

    /* Alert */
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

    const handleSelectChange_Company = (event: SelectChangeEvent<string>) => {
        const selectedId = event.target.value;
        const selectedCompany = listCompany.find(c => c.id === selectedId)

        if(selectedCompany) {
            setNewData(prev => ({
                ...prev,
                companyId: Number(selectedCompany.id),
                companyName: selectedCompany.name,
            }))
        }
    }
    const handleSelectChange_Active = (event: SelectChangeEvent<string>) => {
        const selectedId = event.target.value;
        const selectedActiveYN = listActiveYN.find(c => c.id === selectedId)

        if(selectedActiveYN) {
            setNewData(prev => ({
                ...prev,
                isActive: selectedActiveYN.name,
            }))
        }
    }
    const handleSelectChange_Category = (event: SelectChangeEvent<string>) => {
        const selectedId = event.target.value;
        const selectedCategory = listCategory.find(c => c.id === selectedId)

        if(selectedCategory) {
            setNewData(prev => ({
                ...prev,
                category: selectedCategory.name,
            }))
        }
    }

    const handleInputChange = (key: keyof typeof newData, value: string) => {
        setNewData((prev) => ({ ...prev, [key]: value }));
    };


    const handleRegist = async () => {
        try {
            await createMaterial({
                companyId: newData.companyId,
                materialNo: newData.materialNo,
                materialName: newData.materialName,
                category: newData.category,
                color: newData.color,
                spec: newData.spec,
                specValue: newData.specValue,
                maker: newData.maker,
                remark: newData.remark,
                isActive: newData.isActive
            })
            handleAlertSuccess()
            doFinish()
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
        setNewData({
            isActive: 'Y'
        })
        doCancle()
    }

    /* Alert 팝업 */
    const handleCloseAlert = () => {
        setAlertOpen(false)
    }
    const handleAlertSuccess = () => {
        setAlertInfo({
            type: 'success',
            title: '원자재 등록',
            text: '원자재 정보 등록 성공'
        })
        setAlertOpen(true)

        setTimeout(() => setAlertOpen(false), 2000)
    }
    const handleAlertFail = () => {
        setAlertInfo({
            type: 'error',
            title: '원자재 등록',
            text: '원자재 정보 등록 실패'
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
                    <Typography sx={{fontSize: '45px', padding: 2, fontWeight: 'bold'}}>원자재 등록</Typography>
                    {/* 버튼 영역 */}
                    <Box 
                        sx={{ 
                            display: 'flex',
                            justifyContent: 'flex-end',
                            alignItems: 'center',
                            gap: 2
                        }}
                    >
                        <CustomBtn text='등록' backgroundColor='green' onClick={handleRegist} />
                        <CustomBtn text='취소' backgroundColor='gray' onClick={handleCancle} />
                    </Box>
                </Box>
                <Box sx={{ border: '3px solid green', marginLeft: 2, paddingRight: 2, paddingBottom: 2}}>
                    <Box sx={{display: 'flex'}}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2, width: '350px', height: '230px', marginTop: '20px'}}>
                            <LabelSelect 
                                color='black'
                                labelText='매입처명'
                                value={newData.companyId?.toString() || ''}
                                onChange={handleSelectChange_Company}
                                options={listCompany}
                            />
                            <LabelInput 
                                color='black'
                                labelText='품목번호'
                                value={newData.materialNo}
                                onChange={(e) => handleInputChange('materialNo', e.target.value)}
                            />
                            <LabelSelect 
                                color='black'
                                labelText='분류'
                                value={newData.category?.toString() || ''}
                                onChange={handleSelectChange_Category}
                                options={listCategory}
                            />
                            <LabelInput 
                                color='black'
                                labelText='규격'
                                value={newData.spec}
                                onChange={(e) => handleInputChange('spec', e.target.value)}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2, width: '350px', height: '230px', marginTop: '20px'}}>
                            <LabelSelect 
                                color='black'
                                labelText='사용여부'
                                value={newData.isActive?.toString() || ''}
                                onChange={handleSelectChange_Active}
                                options={listActiveYN}
                            />
                            <LabelInput 
                                color='black'
                                labelText='품목명'
                                value={newData.materialName}
                                onChange={(e) => handleInputChange('materialName', e.target.value)}
                            />
                            <LabelInput 
                                color='black'
                                labelText='색상'
                                value={newData.color}
                                onChange={(e) => handleInputChange('color', e.target.value)}
                            />
                            
                            <LabelInput 
                                color='black'
                                labelText='제원'
                                value={newData.specValue}
                                onChange={(e) => handleInputChange('specValue', e.target.value)}
                            />
                        </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2, marginTop: 1}}>
                        <LabelInput 
                                color='black'
                                labelText='제조사'
                                value={newData.maker}
                                inputWidth='562px'
                                onChange={(e) => handleInputChange('maker', e.target.value)}
                            />
                        <LabelInput 
                            color='black'
                            labelText='비고'
                            value={newData.remark}
                            inputWidth='562px'
                            onChange={(e) => handleInputChange('remark', e.target.value)}
                        />
                    </Box>
                </Box>
            </Box>
            {/* 팝업창 */}
            <Dialog open={alertOpen} onClose={handleCloseAlert}>
                <AlertPopup 
                    type={alertInfo.type || 'success'} 
                    title={alertInfo.title} 
                    text={alertInfo.text} 
                />
            </Dialog>
        </Box>
    )
}