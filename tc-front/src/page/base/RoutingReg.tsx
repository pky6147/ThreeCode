import { Box, Button, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { createRouting } from '../../api/routingApi';
import type { AxiosError } from 'axios';


interface RoutingRegProps {
    doClose: () => void
}

export default function RoutingReg({doClose}:RoutingRegProps) {
    const [data, setData] = useState({
        processCode: "",
        processName: "",
        processTime: "", 
        processOrder: "",
        remark: "",
  });


    const handleSave = async () => {
        try {
            await createRouting({
                processCode: data.processCode,
                processName: data.processName,
                processTime: Number(data.processTime),
                processOrder: Number(data.processOrder),
                remark: data.remark,
            })
        alert("저장되었습니다.")
        doClose()
        }catch(err) {
        const axiosError = err as AxiosError;
          console.error(err)
            if (axiosError.response && axiosError.response.data) {
           alert((axiosError.response.data as AxiosError).message || "저장을 실패했습니다.");
         }else{
            alert("저장을 실패했습니다.")
          }
          
        }
        
    }

    const handleCancel = () => {
      setData({
      processCode: "",
      processName: "",
      processTime: "",
      processOrder: "",
      remark: "",  
    });
    doClose()
    

  };



    return (
        <Box sx={{
            backgroundColor: 'white',
            width:'500px',
            minWidth:'100px',
            height: '550px'
        }}>
            <Typography sx={{
                color:'black',
                textAlign: 'center',
                fontSize: '24px',
                mt:'20px'
            }}>
                라우팅정보 등록
            </Typography>
            <Box sx={{
            display: "flex",
            flexDirection: "column",  
            alignItems: "center",                 
            mt: 5,
            }}>
            <TextField
            label="공정코드"                 
            sx={{ width: 400, mb: 2 }}
            value={data.processCode}
            onChange={(e) => setData({ ...data, processCode: e.target.value })}
            />
            <TextField
            label="공정명"                 
            sx={{ width: 400, mb: 2 }}
            value={data.processName}
            onChange={(e) => setData({ ...data, processName: e.target.value })}  
            />
            <TextField
            label="공정시간" 
            type='number'                  
            sx={{ width: 400, mb: 2 }}
            value={data.processTime}
            onChange={(e) => setData({ ...data, processTime: e.target.value })}  
            />
            <TextField
            label="공정순서"
            type='number'                
            sx={{ width: 400, mb: 2 }}
            value={data.processOrder}
            onChange={(e) => setData({ ...data, processOrder: e.target.value })}  
            />
            <TextField
            label="비고"                 
            sx={{ width: 400, mb: 2 }}
            value={data.remark}
            onChange={(e) => setData({ ...data, remark: e.target.value })}  
            />
            </Box>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 2 }}>
            <Button variant="contained" color="primary" size="small" onClick={handleSave}>
                저장
            </Button>
            <Button variant="outlined" color="secondary" size="small" onClick={handleCancel}>
                취소
            </Button>
        </Box>
      </Box>
    
    )


}