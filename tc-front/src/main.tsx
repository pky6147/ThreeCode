import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TitleArea from './layout/TitleArea'
import MenuArea from './layout/MenuArea'
import ContentArea from './layout/ContentArea'
import Menu from './component/Menu'
import { Box } from '@mui/material'
import BaseRouting from './page/base/Routing'

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
            <Route path="/product" element={<></>} />
            {/* 원자재 입출고 관리 */}
            <Route path="/material" element={<></>} />
            {/* 기준정보 관리 */}
            <Route path="/base/route" element={<BaseRouting/>} />
          </Routes>
        </ContentArea>
      </Box>
    </BrowserRouter>
  </StrictMode>,
)
