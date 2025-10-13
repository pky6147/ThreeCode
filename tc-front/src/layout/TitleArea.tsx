import { Box } from '@mui/material'
import logo from '../image/회사로고(배경투명).png'

interface TitleAreaProps {
  title: string; 
//   image?: string;
}

// function TitleArea({title, image}: TitleAreaProps) {
function TitleArea({title}: TitleAreaProps) {
    return (
        <Box 
            sx={{
                width: '100%',
                height: '15vh',
                backgroundColor: '#1b2593ff',
                display: 'flex',
            }}
        >
            {/* 회사 로고 영역 */}
            <Box
                sx={{
                    width: '15%',
                    minWidth: '165px',
                    // backgroundColor: 'white',
                    // border: '1px solid white'
                }}
            >
                {/* {image && <img src={image} alt="company logo" style={{ height: '100%' }} />} */}
                {<img src={logo} alt="company logo" style={{ height: '100%', width: '100%' }} />}
            </Box>
            {/* 제목 영역 */}
            <Box
                sx={{
                    width: '85%',
                    fontWeight: 'bold',
                    fontSize: '48px',
                    color: 'white',
                    // border: '1px solid white',
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: '2%'
                }}
            >
                {title}
            </Box>
        </Box>
    ) 
}

export default TitleArea;