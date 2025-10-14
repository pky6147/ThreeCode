import { Box } from '@mui/material'

interface MenuAreaProps {
  children?: React.ReactNode; 
}

function MenuArea({children}: MenuAreaProps) {
    return (
        <Box
            sx={{
                width: '280px',
                minWidth: '165px',
                height: '83.5vh',
                backgroundColor: '#c7c3e8',
                // border: '1px solid black'
            }}
        >
            {children}
        </Box>
    ) 
}

export default MenuArea;