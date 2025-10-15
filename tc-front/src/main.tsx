import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TitleArea from './layout/TitleArea'
import MenuArea from './layout/MenuArea'
import ContentArea from './layout/ContentArea'
import Menu from './component/Menu'
import { Box } from '@mui/material'

// 기준정보 관리
import BaseRouting from './page/base/Routing'
import BaseCompany from './page/base/Company'
import BaseMaterial from './page/base/Material'
import BaseProduct from './page/base/Product'
// 수주대상 입출고 관리
import ProductInputReg from './page/product/InputReg'
import CompanyReg from './page/base/CompanyReg';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <TitleArea title="대원공업" />
      <Box
        sx={{
          display: 'flex',
          width: '100%'
        }}
      >
        <MenuArea>
          <Menu />
        </MenuArea>
        <ContentArea>
          <Routes>
            {/* <Route index element={<></>} /> */}
            {/* 수주대상 입출고 관리 */}
            <Route path="/product/inputReg" element={<ProductInputReg/>} />
            {/* 원자재 입출고 관리 */}
            <Route path="/material" element={<></>} />
            {/* 기준정보 관리 */}
            <Route path="/base/route" element={<BaseRouting/>} />
            <Route path="/base/company" element={<BaseCompany />} />
            <Route path="/base/material" element={<BaseMaterial/>} />
            <Route path="/base/product" element={<BaseProduct/>} />
            <Route path='/base/companyReg' element={<CompanyReg/>} />
          </Routes>
        </ContentArea>
      </Box>
    </BrowserRouter>
  </StrictMode>,
)
