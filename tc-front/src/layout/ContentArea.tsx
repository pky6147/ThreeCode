import { Box } from '@mui/material'

interface ContentAreaProps {
  children?: React.ReactNode; 
}

function ContentArea({children}: ContentAreaProps) {
    return (
        <Box
            sx={{
                width: '85%',
                height: '83.5vh',
                backgroundColor: '#d9ddf0',
                // border: '1px solid black'
            }}
        >
            {/* Content 영역 */}
            {children}
        </Box>
    ) 
}

export default ContentArea;