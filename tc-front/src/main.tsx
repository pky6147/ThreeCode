import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import ProductInputState from './page/product/InputState'
import ProductOutputReg from './page/product/OutputReg'
import ProductOutputState from './page/product/OutputState'
// 원자재 입출고 관리
import MaterialInputReg from './page/material/InputReg'
import MaterialInputState from './page/material/InputState'
import MaterialOutputReg from './page/material/OutputReg'
import MaterialOutputState from './page/material/OutputState'
import MaterialStock from './page/material/Stock'

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
            <Route path="/product/inputState" element={<ProductInputState/>} />
            <Route path="/product/OutputReg" element={<ProductOutputReg/>} />
            <Route path="/product/OutputState" element={<ProductOutputState/>} />
            {/* 원자재 입출고 관리 */}
            <Route path="/material/inputReg" element={<MaterialInputReg/>} />
            <Route path="/material/inputState" element={<MaterialInputState/>} />
            <Route path="/material/outputReg" element={<MaterialOutputReg/>} />
            <Route path="/material/outputState" element={<MaterialOutputState/>} />
            <Route path="/material/stock" element={<MaterialStock/>} />
            {/* 기준정보 관리 */}
            <Route path="/base/route" element={<BaseRouting/>} />
            <Route path="/base/company" element={<BaseCompany />} />
            <Route path="/base/material" element={<BaseMaterial/>} />
            <Route path="/base/product" element={<BaseProduct/>} />
            {/* <Route path='/base/companyReg' element={<CompanyReg/>} /> */}
          </Routes>
        </ContentArea>
      </Box>
    </BrowserRouter>
  </StrictMode>,
)
