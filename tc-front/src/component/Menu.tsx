import { useNavigate } from 'react-router-dom';
import { 
    Paper,
    MenuList,
    MenuItem,
    ListItemText,
    Divider,
    ListSubheader
} from '@mui/material';

const productData = [
    {title: '입고 등록', path: '/product/inputReg'},
    {title: '입고 현황', path: '/product/inputState'},
    {title: '출고 등록', path: '/product/outputReg'},
    {title: '출고 현황', path: '/product/outputState'},
]
const materialData = [
    {title: '입고 등록', path: '/material/inputReg'},
    {title: '입고 현황', path: '/material/inputState'},
    {title: '출고 등록', path: '/material/outputReg'},
    {title: '출고 현황', path: '/material/outputState'},
    {title: '재고 현황', path: '/material/stock'},
]
const baseData = [
    {title: '라우팅 관리', path: '/base/route'},
    {title: '업체 관리', path: '/base/company'},
    {title: '원자재 관리', path: '/base/material'},
    {title: '수주품목 관리', path: '/base/product'},
]

const dashboardData = [
    {title: '원자재 대시보드', path: '/dashboard/material'},
    // {title: '수주대상 대시보드', path: '/dashboard/product'},
]

function Menu() {
  const navigate = useNavigate();

    return (
        <Paper sx={{ width: '100%', minWidth: '165px'}}>
            <ListSubheader sx={{backgroundColor:'black', color: 'white'}}>수주대상 입출고 관리</ListSubheader>
            <MenuList>
                { productData.map((item, index) => (
                    <MenuItem
                        sx={index > 0 ? {borderTop: '0.5px solid'} : {}} 
                        key={index}  
                        onClick={() => navigate(item.path)}
                    >
                        <ListItemText primary={item.title} />
                    </MenuItem>
                    
                ))}
            </MenuList>
            <Divider />
            <ListSubheader sx={{backgroundColor:'black', color: 'white'}}>원자재 입출고 관리</ListSubheader>
            <MenuList>
                { materialData.map((item, index) => (
                    <MenuItem
                        sx={index > 0 ? {borderTop: '0.5px solid'} : {}} 
                        key={index}  
                        onClick={() => navigate(item.path)}
                    >
                        <ListItemText primary={item.title} />
                    </MenuItem>
                    
                ))}
            </MenuList>
            <Divider />
            <ListSubheader sx={{backgroundColor:'black', color: 'white'}}>기준정보 관리</ListSubheader>
            <MenuList>
                { baseData.map((item, index) => (
                    <MenuItem
                        sx={index > 0 ? {borderTop: '0.5px solid'} : {}} 
                        key={index}  
                        onClick={() => navigate(item.path)}
                    >
                        <ListItemText primary={item.title} />
                    </MenuItem>
                    
                ))}
            </MenuList>
            <ListSubheader sx={{backgroundColor:'black', color: 'white'}}>대시보드</ListSubheader>
            <MenuList>
                { dashboardData.map((item, index) => (
                    <MenuItem
                        sx={index > 0 ? {borderTop: '0.5px solid'} : {}} 
                        key={index}  
                        onClick={() => navigate(item.path)}
                    >
                        <ListItemText primary={item.title} />
                    </MenuItem>
                    
                ))}
            </MenuList>
        </Paper>
    )
}

export default Menu;