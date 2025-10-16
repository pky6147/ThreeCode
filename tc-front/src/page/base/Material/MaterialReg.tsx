import { useState, useEffect } from 'react'
import { Box, Typography, type SelectChangeEvent } from '@mui/material'
import CustomBtn from '../../../component/CustomBtn';
import LabelInput from '../../../component/LabelInput';
import LabelSelect from '../../../component/LabelSelect';

interface RegProps {
    doFinish: ()=> void;
    doCancle: ()=> void;
}

interface MaterialDataType {
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

export default function MaterialReg({doFinish, doCancle}:RegProps) {
    const [newData, setNewData] = useState<MaterialDataType>({
        is_active: 'Y'
    })

    const [listCompany, setListCompany] = useState<{id:string; name:string}[]>([])
    const [listActiveYN] = useState([
        {id: 'Y', name: 'Y'},
        {id: 'N', name: 'N'},
    ])
    
    useEffect(()=> {
        // company 데이터를 갖고올 때 id를 string으로 변환해야함
        setListCompany([
            {id: '1', name: '회사A'},
            {id: '2', name: '회사B'},
            {id: '3', name: '회사C'},
        ])
    }, [])

    const handleSelectCompanyChange = (event: SelectChangeEvent<string>) => {
        const selectedId = event.target.value;
        const selectedCompany = listCompany.find(c => c.id === selectedId)

        if(selectedCompany) {
            setNewData(prev => ({
                ...prev,
                company_id: selectedCompany.id,
                company_name: selectedCompany.name,
            }))
        }
    }
    const handleSelectActiveYNChange = (event: SelectChangeEvent<string>) => {
        const selectedId = event.target.value;
        const selectedActiveYN = listActiveYN.find(c => c.id === selectedId)

        if(selectedActiveYN) {
            setNewData(prev => ({
                ...prev,
                is_active: selectedActiveYN.name,
            }))
        }
    }

    const handleInputChange = (key: keyof typeof newData, value: string) => {
        setNewData((prev) => ({ ...prev, [key]: value }));
    };


    const handleRegist = () => {
        console.log('저장', newData)
        doFinish()
    }

    const handleCancle = () => {
        doCancle()
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
                                value={newData.company_id?.toString() || ''}
                                onChange={handleSelectCompanyChange}
                                options={listCompany}
                            />
                            <LabelInput 
                                color='black'
                                labelText='품목번호'
                                value={newData.material_no}
                                onChange={(e) => handleInputChange('material_no', e.target.value)}
                            />
                            <LabelInput 
                                color='black'
                                labelText='분류'
                                value={newData.category}
                                onChange={(e) => handleInputChange('category', e.target.value)}
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
                                value={newData.is_active?.toString() || ''}
                                onChange={handleSelectActiveYNChange}
                                options={listActiveYN}
                            />
                            <LabelInput 
                                color='black'
                                labelText='품목명'
                                value={newData.material_name}
                                onChange={(e) => handleInputChange('material_name', e.target.value)}
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
                                value={newData.spec_value}
                                onChange={(e) => handleInputChange('spec_value', e.target.value)}
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
        </Box>
    )
}